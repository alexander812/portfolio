# Орбиты опыта

Статический сайт на Astro. Форма «Связаться» отправляет сообщения через отдельный Cloudflare Worker в личный чат Telegram. Токен бота и ID чата не попадают в `dist`.

## Подключение формы

1. Создайте бота через [@BotFather](https://t.me/BotFather) командой `/newbot`. Сохраните выданный токен только у себя. Откройте созданного бота в Telegram и нажмите **Start**.
2. Узнайте ID личного чата: в терминале из корня проекта запустите команду ниже. Она попросит токен отдельным скрытым вводом и выведет только ID личных чатов. Это число, а не username. Если чатов нет, напишите боту `/start` или другое сообщение и повторите команду.

   ```bash
   node scripts/get-telegram-chat-id.mjs
   ```

3. После публикации сайта создайте виджет [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/) для его домена. Сохраните публичный sitekey и секретный ключ.
4. Worker уже развёрнут по адресу `https://portfolio-contact.a-s-smirnoff.workers.dev/contact`. В нём настроено ограничение частоты запросов. Откройте Cloudflare → Workers & Pages → `portfolio-contact` → Settings → Runtime variables and secrets. Добавьте три значения типа **Secret** и одно значение типа **Variable**. Для `ALLOWED_ORIGIN` укажите **только origin** опубликованного сайта: `https://alexander812.github.io` без `/portfolio` и завершающего `/`.

   - `TELEGRAM_BOT_TOKEN` — токен от BotFather;
   - `TELEGRAM_CHAT_ID` — числовой ID вашего личного чата;
   - `TURNSTILE_SECRET_KEY` — секретный ключ виджета;
   - `ALLOWED_ORIGIN` — origin сайта, тип **Variable**.

   Для будущих обновлений кода можно использовать `npx wrangler login` и `npx wrangler deploy` из корня проекта. Привязка лимита уже отражена в `wrangler.toml`.

5. Скопируйте `.env.example` в `.env` и впишите публичный Turnstile sitekey. Если сайт собирается в CI, задайте переменные `PUBLIC_CONTACT_API_URL` и `PUBLIC_TURNSTILE_SITE_KEY` в окружении сборки. Затем выполните `npm run build` и опубликуйте `dist` на статическом хостинге.
6. Проверьте отправку тестового сообщения на опубликованном сайте. Личное сообщение от бота должно прийти в Telegram. Если нет, проверьте, что вы нажали **Start**, указали верный числовой `TELEGRAM_CHAT_ID`, а `ALLOWED_ORIGIN` совпадает с адресом сайта.

Worker принимает запросы только с указанного origin, проверяет Turnstile на сервере, ограничивает частоту до пяти запросов в минуту на IP и не пересылает сообщения с заполненным скрытым полем. Ограничение частоты Cloudflare приблизительное и действует отдельно в каждой локации; оно уменьшает поток спама, но не гарантирует его полного отсутствия.

## Публикация на GitHub Pages

Сайт собирается и публикуется автоматически при пуше в `main` через workflow `.github/workflows/deploy.yml`. Адрес проекта: <https://alexander812.github.io/portfolio/>.

1. Откройте **Settings → Pages → Build and deployment** и выберите источник **GitHub Actions** (не «Deploy from a branch»).
2. В **Settings → Secrets and variables → Actions → Variables** добавьте переменные сборки:
   - `PUBLIC_CONTACT_API_URL` — `https://portfolio-contact.a-s-smirnoff.workers.dev/contact`;
   - `PUBLIC_TURNSTILE_SITE_KEY` — публичный sitekey виджета Turnstile.
3. Запушьте изменения в `main` или запустите workflow вручную на вкладке **Actions**. После первого успешного деплоя форма заработает, если в Worker заданы секреты и `ALLOWED_ORIGIN=https://alexander812.github.io`.

Сайт публикуется по подпути `/portfolio`, поэтому в `astro.config.mjs` заданы `site` и `base: '/portfolio'`. При переезде на отдельный домен или пользовательский сайт `alexander812.github.io` измените `base` на `'/'` и обновите `site`.

## Проверка локально

```bash
npm install
npm run check
node tests/contact-worker.mjs
npm test
```

Без настроенных публичных переменных форма показывает, что она пока не подключена. Секреты не записывайте в `.env`, исходники или настройки сборки сайта; они нужны только Worker.
