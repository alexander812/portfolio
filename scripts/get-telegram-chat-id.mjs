import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';

if (!process.stdin.isTTY) {
  console.error('Запустите команду в обычном терминале.');
  process.exit(1);
}

const muted = new Writable({ write(_chunk, _encoding, done) { done(); } });
process.stdout.write('Токен бота (ввод скрыт): ');
const prompt = createInterface({ input: process.stdin, output: muted, terminal: true });
const token = (await new Promise((resolve) => prompt.question('', resolve))).trim();
prompt.close();
process.stdout.write('\n');

if (!/^\d+:[A-Za-z0-9_-]+$/.test(token)) {
  console.error('Токен имеет неверный формат.');
  process.exit(1);
}

try {
  const response = await fetch('https://api.telegram.org/bot' + token + '/getUpdates?limit=100', {
    signal: AbortSignal.timeout(10_000),
  });
  const data = await response.json();
  if (!response.ok || data.ok !== true) throw new Error('Telegram не принял запрос.');

  const chats = new Map();
  for (const update of data.result ?? []) {
    const chat = update.message?.chat;
    if (chat?.type === 'private') chats.set(chat.id, chat.first_name || chat.username || 'личный чат');
  }

  if (chats.size === 0) {
    console.log('Личных чатов не найдено. Отправьте своему боту /start или любое сообщение и запустите команду снова.');
  } else {
    console.log('ID личных чатов:');
    for (const [id, label] of chats) console.log(id + ' — ' + label);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Не удалось обратиться к Telegram.');
  process.exitCode = 1;
}
