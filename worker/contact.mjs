// A JSON escape can take six bytes per UTF-16 code unit in a valid submission.
const MAX_BODY_BYTES = 32 * 1_024;

function json(body, status, origin = '') {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(JSON.stringify(body), { status, headers });
}

async function readSmallBody(request) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) throw new Error('body-too-large');
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

function cleanOneLine(value, maxLength) {
  return typeof value === 'string' && value.length <= maxLength
    ? value.replace(/[\r\n\t\u0000-\u001f\u007f]/g, ' ').trim()
    : null;
}

function cleanMessage(value) {
  return typeof value === 'string' && value.length <= 3_000
    ? value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim()
    : null;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname !== '/contact') return json({ ok: false }, 404);

    const allowedOrigin = env.ALLOWED_ORIGIN?.replace(/\/$/, '');
    const origin = request.headers.get('Origin');
    if (!allowedOrigin || origin !== allowedOrigin) return json({ ok: false }, 403);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
          Vary: 'Origin',
        },
      });
    }
    if (request.method !== 'POST') return json({ ok: false }, 405, allowedOrigin);

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID || !env.TURNSTILE_SECRET_KEY || !env.CONTACT_RATE_LIMIT) {
      return json({ ok: false, error: 'not-configured' }, 503, allowedOrigin);
    }
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) {
      return json({ ok: false, error: 'invalid-request' }, 415, allowedOrigin);
    }

    let data;
    try {
      data = JSON.parse(await readSmallBody(request));
    } catch {
      return json({ ok: false, error: 'invalid-request' }, 400, allowedOrigin);
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return json({ ok: false, error: 'invalid-request' }, 400, allowedOrigin);
    }
    if (typeof data.website === 'string' && data.website.trim()) {
      return json({ ok: true }, 200, allowedOrigin);
    }

    const name = cleanOneLine(data.name ?? '', 80);
    const replyTo = cleanOneLine(data.replyTo, 200);
    const message = cleanMessage(data.message);
    const token = data.turnstileToken;
    if (name === null || !replyTo || !message || message.length < 10 ||
        typeof token !== 'string' || !token || token.length > 2_048) {
      return json({ ok: false, error: 'invalid-request' }, 400, allowedOrigin);
    }

    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    let withinLimit;
    try {
      ({ success: withinLimit } = await env.CONTACT_RATE_LIMIT.limit({ key: clientIp }));
    } catch {
      return json({ ok: false, error: 'rate-limit-unavailable' }, 502, allowedOrigin);
    }
    if (!withinLimit) return json({ ok: false, error: 'rate-limited' }, 429, allowedOrigin);

    try {
      const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: clientIp === 'unknown' ? undefined : clientIp,
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!verification.ok) return json({ ok: false, error: 'verification-unavailable' }, 502, allowedOrigin);
      const result = await verification.json();
      if (!result.success || result.action !== 'contact' ||
          result.hostname !== new URL(allowedOrigin).hostname) {
        return json({ ok: false, error: 'verification-failed' }, 403, allowedOrigin);
      }

      const text = [
        'Новое сообщение с портфолио',
        'От: ' + (name || 'Не указано'),
        'Ответить: ' + replyTo,
        '',
        message,
      ].join('\n');
      const telegram = await fetch('https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          link_preview_options: { is_disabled: true },
        }),
        signal: AbortSignal.timeout(8_000),
      });
      const sent = telegram.ok && (await telegram.json()).ok === true;
      return sent
        ? json({ ok: true }, 200, allowedOrigin)
        : json({ ok: false, error: 'delivery-failed' }, 502, allowedOrigin);
    } catch {
      return json({ ok: false, error: 'delivery-unavailable' }, 502, allowedOrigin);
    }
  },
};
