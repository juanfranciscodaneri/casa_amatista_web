// Casa Amatista · Worker de entrada
// Sirve el sitio estático y enruta /api/contact a la lógica de envío de emails.

import { handleContact } from './contact-handler.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // SEO: una sola versión del sitio (www → apex) para evitar contenido duplicado.
    if (url.hostname === 'www.casaamatista.org') {
      url.hostname = 'casaamatista.org';
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    const res = await env.ASSETS.fetch(request);

    // Caché larga para imágenes (los nombres de archivo no cambian sin cambiar contenido).
    if (url.pathname.startsWith('/assets/') && res.ok) {
      const cached = new Response(res.body, res);
      cached.headers.set('Cache-Control', 'public, max-age=2592000');
      return cached;
    }
    return res;
  },
};
