# Орбиты опыта

Статический сайт на Astro. Форма «Связаться» отправляет сообщения через отдельный Cloudflare Worker в личный чат Telegram. Токен бота и ID чата не попадают в `dist`.

## Подключение формы

1. Создайте бота через [@BotFather](https://t.me/BotFather) командой `/newbot`. Сохраните выданный токен только у себя. Откройте созданного бота в Telegram и нажмите **Start**.
2. Узнайте ID личного чата: в терминале выполните команды ниже, введите токен при запросе и найдите `message.chat.id` в ответе. Это число, а не username. Если `result` пуст, напишите боту ещё одно сообщение и повторите запрос.

   ```bash
   read -r -s -p 'Bot token: ' PORTFOLIO_BOT_TOKEN; echo
   curl -sS "https://api.telegram.org/bot${PORTFOLIO_BOT_TOKEN}/getUpdates"
   unset PORTFOLIO_BOT_TOKEN
   ```

3. После публикации сайта создайте виджет [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/) для его домена. Сохраните публичный sitekey и секретный ключ.
4. В аккаунте Cloudflare из корня проекта выполните `npx wrangler login`, затем `npx wrangler deploy`. Wrangler выдаст адрес Worker вида `https://portfolio-contact.<subdomain>.workers.dev`.
5. Задайте секреты Worker интерактивными командами. Для `ALLOWED_ORIGIN` укажите **только origin** опубликованного сайта: например, `https://alexander812.github.io` без `/portfolio` и завершающего `/`.

   ```bash
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   npx wrangler secret put TURNSTILE_SECRET_KEY
   npx wrangler secret put ALLOWED_ORIGIN
   ```

6. Скопируйте `.env.example` в `.env` и впишите адрес Worker с `/contact` и публичный Turnstile sitekey. Если сайт собирается в CI, задайте те же переменные `PUBLIC_CONTACT_API_URL` и `PUBLIC_TURNSTILE_SITE_KEY` в окружении сборки. Затем выполните `npm run build` и опубликуйте `dist` на статическом хостинге.
7. Проверьте отправку тестового сообщения на опубликованном сайте. Личное сообщение от бота должно прийти в Telegram. Если нет, проверьте, что вы нажали **Start**, указали верный числовой `TELEGRAM_CHAT_ID`, а `ALLOWED_ORIGIN` совпадает с адресом сайта.

Worker принимает запросы только с указанного origin, проверяет Turnstile на сервере, ограничивает частоту до пяти запросов в минуту на IP и не пересылает сообщения с заполненным скрытым полем. Ограничение частоты Cloudflare приблизительное и действует отдельно в каждой локации; оно уменьшает поток спама, но не гарантирует его полного отсутствия.

## Проверка локально

```bash
npm install
npm run check
node tests/contact-worker.mjs
npm test
```

Без настроенных публичных переменных форма показывает, что она пока не подключена. Секреты не записывайте в `.env`, исходники или настройки сборки сайта; они нужны только Worker.
