export {};

interface TurnstileWindow extends Window {
  turnstile?: {
    render: (container: HTMLElement, options: { sitekey: string; action: string; theme: string }) => string;
    getResponse: (widgetId: string) => string;
    reset: (widgetId: string) => void;
  };
}

const dialog = document.querySelector<HTMLDialogElement>('#contactDialog');
const form = document.querySelector<HTMLFormElement>('#contactForm');
const contactStatus = document.querySelector<HTMLElement>('#contactStatus');
const submit = document.querySelector<HTMLButtonElement>('#contactSubmit');
const widget = document.querySelector<HTMLElement>('#contactTurnstile');

if (dialog && form && contactStatus && submit) {
  let lastTrigger: HTMLElement | null = null;
  let widgetId: string | null = null;
  let widgetPromise: Promise<void> | null = null;
  const turnstileWindow = window as TurnstileWindow;

  function ensureWidget(): Promise<void> {
    if (!widget) return Promise.resolve();
    if (widgetId && turnstileWindow.turnstile) {
      turnstileWindow.turnstile.reset(widgetId);
      return Promise.resolve();
    }
    if (widgetPromise) return widgetPromise;

    widgetPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => {
        if (!turnstileWindow.turnstile || !widget.dataset.sitekey) {
          reject(new Error('Turnstile unavailable'));
          return;
        }
        widgetId = turnstileWindow.turnstile.render(widget, {
          sitekey: widget.dataset.sitekey,
          action: 'contact',
          theme: 'dark',
        });
        resolve();
      };
      script.onerror = () => {
        script.remove();
        reject(new Error('Turnstile unavailable'));
      };
      document.head.append(script);
    }).catch((error) => {
      widgetPromise = null;
      throw error;
    });
    return widgetPromise;
  }

  document.querySelectorAll<HTMLElement>('[data-open-contact]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      lastTrigger = trigger;
      contactStatus.textContent = '';
      dialog.showModal();
      dialog.querySelector<HTMLInputElement>('[name="name"]')?.focus();
      void ensureWidget().catch(() => {
        contactStatus.textContent = 'Не удалось загрузить проверку. Попробуйте открыть форму позже.';
      });
    });
  });

  document.querySelector('#contactClose')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.stopPropagation();
  });
  dialog.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true });
  for (const type of ['touchstart', 'touchmove', 'touchend'] as const) {
    dialog.addEventListener(type, (event) => event.stopPropagation(), { passive: true });
  }
  dialog.addEventListener('close', () => lastTrigger?.focus({ preventScroll: true }));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || submit.disabled) return;

    const apiUrl = form.getAttribute('action');
    if (!apiUrl || apiUrl === '#') {
      contactStatus.textContent = 'Форма пока не подключена. Попробуйте позже.';
      return;
    }

    const data = new FormData(form);
    const token = widgetId ? turnstileWindow.turnstile?.getResponse(widgetId) : '';
    if (!token) {
      contactStatus.textContent = 'Подождите, пока завершится проверка, и попробуйте ещё раз.';
      return;
    }

    submit.disabled = true;
    contactStatus.textContent = 'Отправляем сообщение…';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          replyTo: data.get('replyTo'),
          message: data.get('message'),
          website: data.get('website'),
          turnstileToken: token,
        }),
      });

      if (!response.ok) {
        contactStatus.textContent = response.status === 429
          ? 'Слишком много запросов. Попробуйте позже.'
          : response.status === 403
            ? 'Проверка не прошла. Попробуйте ещё раз.'
            : 'Не удалось отправить сообщение. Попробуйте позже.';
        if (widgetId) turnstileWindow.turnstile?.reset(widgetId);
        return;
      }

      form.reset();
      if (widgetId) turnstileWindow.turnstile?.reset(widgetId);
      contactStatus.textContent = 'Сообщение отправлено. Спасибо!';
    } catch {
      contactStatus.textContent = 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.';
      if (widgetId) turnstileWindow.turnstile?.reset(widgetId);
    } finally {
      submit.disabled = false;
    }
  });
}
