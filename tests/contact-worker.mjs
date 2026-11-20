import assert from 'node:assert/strict';
import worker from '../worker/contact.mjs';

const origin = 'https://example.github.io';
const env = {
  ALLOWED_ORIGIN: origin,
  TELEGRAM_BOT_TOKEN: 'test-token',
  TELEGRAM_CHAT_ID: '123456',
  TURNSTILE_SECRET_KEY: 'test-secret',
  CONTACT_RATE_LIMIT: { limit: async () => ({ success: true }) },
};
const payload = {
  name: 'Компания',
  replyTo: 'recruiter@example.com',
  message: 'Хотим обсудить проект и вакансию.',
  website: '',
  turnstileToken: 'test-turnstile-token',
};
const makeRequest = (body = payload, requestOrigin = origin) => new Request('https://worker.example/contact', {
  method: 'POST',
  headers: { Origin: requestOrigin, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const originalFetch = globalThis.fetch;
const calls = [];
globalThis.fetch = async (url, options) => {
  calls.push({ url, options });
  if (url.includes('siteverify')) {
    return Response.json({ success: true, action: 'contact', hostname: 'example.github.io' });
  }
  return Response.json({ ok: true });
};

try {
  let response = await worker.fetch(makeRequest(), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  assert.equal(calls.length, 2);
  assert.equal(JSON.parse(calls[0].options.body).secret, 'test-secret');
  const sent = JSON.parse(calls[1].options.body);
  assert.equal(sent.chat_id, '123456');
  assert.match(sent.text, /recruiter@example.com/);
  assert.match(sent.text, /Хотим обсудить проект/);
  assert.equal(sent.link_preview_options.is_disabled, true);

  calls.length = 0;
  response = await worker.fetch(makeRequest(payload, 'https://other.example'), env);
  assert.equal(response.status, 403);
  assert.equal(calls.length, 0);

  response = await worker.fetch(makeRequest({ ...payload, website: 'spam.example' }), env);
  assert.equal(response.status, 200);
  assert.equal(calls.length, 0);

  response = await worker.fetch(makeRequest({ ...payload, message: 'short' }), env);
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);

  response = await worker.fetch(makeRequest(), {
    ...env,
    CONTACT_RATE_LIMIT: { limit: async () => ({ success: false }) },
  });
  assert.equal(response.status, 429);
  assert.equal(calls.length, 0);

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ success: true, action: 'contact', hostname: 'wrong.example' });
  };
  response = await worker.fetch(makeRequest(), env);
  assert.equal(response.status, 403);
  assert.equal(calls.length, 1);

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return url.includes('siteverify')
      ? Response.json({ success: true, action: 'contact', hostname: 'example.github.io' })
      : Response.json({ ok: false, description: 'chat not found' }, { status: 400 });
  };
  response = await worker.fetch(makeRequest(), env);
  assert.equal(response.status, 502);

  console.log('Contact Worker: 7 checks passed.');
} finally {
  globalThis.fetch = originalFetch;
}
