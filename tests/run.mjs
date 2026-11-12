import { spawn } from 'node:child_process';
import { execFile } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const astro = join(root, 'node_modules', '.bin', 'astro');

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.unref();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address();
      probe.close(() => resolve(typeof address === 'object' && address ? address.port : 4321));
    });
  });
}

const port = Number(process.env.PORT ?? (await getFreePort()));
const baseUrl = `http://localhost:${port}`;

const server = spawn(astro, ['preview', '--port', String(port)], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverOutput = '';
server.stdout.on('data', (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on('data', (chunk) => {
  serverOutput += chunk.toString();
});

function stopServer() {
  if (!server.killed) server.kill('SIGTERM');
}

process.on('exit', stopServer);
process.on('SIGINT', () => {
  stopServer();
  process.exit(130);
});

async function waitForServer() {
  const deadline = Date.now() + 20_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(`Astro preview did not start on ${baseUrl}\n${serverOutput}`);
}

const tests = ['e2e.mjs', 'interactions.mjs'];

try {
  await waitForServer();
  let failed = false;

  for (const test of tests) {
    process.stdout.write(`\n▶ ${test}\n`);

    try {
      const { stdout, stderr } = await run(process.execPath, [join(root, 'tests', test)], {
        env: { ...process.env, BASE_URL: baseUrl },
      });
      process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
    } catch (error) {
      failed = true;
      process.stdout.write(error.stdout ?? '');
      process.stderr.write(error.stderr ?? error.message);
    }
  }

  process.exitCode = failed ? 1 : 0;
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
} finally {
  stopServer();
}
