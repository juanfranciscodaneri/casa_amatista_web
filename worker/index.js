// Casa Amatista · Worker de entrada
// Sirve el sitio estático y enruta /api/contact a la lógica de envío de emails.

import { handleContact } from './contact-handler.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
