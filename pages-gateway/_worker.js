export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === '/contact') {
      if (!env.CONTACT_SERVICE) {
        return new Response('{"ok":false,"error":"not-configured"}', {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://alexander812.github.io',
            Vary: 'Origin',
          },
        });
      }
      return env.CONTACT_SERVICE.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
