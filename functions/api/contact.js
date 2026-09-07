// Cloudflare Pages Function · Consultas generales de Casa Amatista
// Envía: (1) notificación a casaamatistaparana@gmail.com con los datos y el motivo
//        (2) confirmación cálida a quien consultó

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const data = await request.json();

    if (!data.name || !data.email || !data.message || !data.reason) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Configuración incompleta' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!data.turnstileToken) {
      return new Response(JSON.stringify({ error: 'Falta verificación de seguridad' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const turnstileVerify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: data.turnstileToken,
        remoteip: request.headers.get('CF-Connecting-IP'),
      }),
    });

    const turnstileResult = await turnstileVerify.json();
    if (!turnstileResult.success) {
      return new Response(JSON.stringify({ error: 'Verificación de seguridad falló' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const timestamp = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const reasonLabels = {
      reserva: 'Reservar un turno',
      terapia: 'Una terapia',
      practica: 'Yoga / meditación / prácticas',
      alquiler: 'Alquiler de consultorio o salón',
      general: 'Consulta general',
    };
    const reasonLabel = reasonLabels[data.reason] || data.reason;

    // ================= EMAIL 1: notificación a Casa Amatista =================
    const adminEmailHtml = `
      <h2>Nueva consulta desde el formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>WhatsApp:</strong> ${data.whatsapp ? escapeHtml(data.whatsapp) : '(no proporcionado)'}</p>
      <p><strong>Motivo:</strong> ${escapeHtml(reasonLabel)}</p>
      <p><strong>Fecha:</strong> ${timestamp}</p>
      <hr>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-wrap; padding: 12px; background: #f5f4f1; border-radius: 4px;">${escapeHtml(data.message)}</p>
      <hr>
      <p><small>Podés responder directamente a este email; llegará a ${escapeHtml(data.email)}.</small></p>
    `;

    await sendEmail(env.RESEND_API_KEY, {
      from: 'Casa Amatista · Web <notificaciones@casaamatista.org>',
      to: ['casaamatistaparana@gmail.com'],
      reply_to: data.email,
      subject: `🔔 Nueva consulta [${reasonLabel}]: ${data.name}`,
      html: adminEmailHtml,
    });

    // ================= EMAIL 2: confirmación a quien consultó =================
    const firstName = data.name.split(' ')[0];
    const userEmailHtml = getContactConfirmationEmail(firstName, reasonLabel);

    await sendEmail(env.RESEND_API_KEY, {
      from: 'Casa Amatista <hola@casaamatista.org>',
      to: [data.email],
      reply_to: 'casaamatistaparana@gmail.com',
      subject: `${firstName}, recibimos tu consulta 💜`,
      html: userEmailHtml,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact error:', err);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ================= Helpers =================

async function sendEmail(apiKey, payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Resend error:', errorText);
    throw new Error('Error al enviar email');
  }
  return response.json();
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getContactConfirmationEmail(firstName, reasonLabel) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F6F4F1; color: #4A4048; }
  .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; }
  .header { background: linear-gradient(180deg, #3B3047 0%, #2A2333 100%); padding: 40px 32px; text-align: center; }
  .header-brand { color: #DED8E4; font-size: 12px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 8px; }
  .header-logo { max-height: 46px; width: auto; margin-bottom: 14px; }
  .header-title { color: #F6F4F1; font-size: 23px; font-weight: 600; margin: 0; font-family: Georgia, serif; }
  .content { padding: 40px 32px; }
  .content p { font-size: 15px; line-height: 1.7; color: #4A4048; margin: 0 0 16px; }
  .content p strong { color: #3B3047; }
  .divider { height: 1px; background: rgba(59,48,71,0.1); margin: 32px 0; }
  .signature { margin-top: 32px; font-size: 14px; color: #7C727C; }
  .signature strong { color: #3B3047; }
  .footer { background: #2A2333; padding: 24px 32px; text-align: center; }
  .footer p { color: #B7A2AC; font-size: 11px; margin: 4px 0; }
  .footer a { color: #DED8E4; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="header-brand">Cuerpo · Mente · Alma</div>
    <img src="https://casaamatista.org/assets/logo-crema.png" alt="Casa Amatista" class="header-logo">
    <h1 class="header-title">Recibimos tu consulta, ${firstName}</h1>
  </div>
  <div class="content">
    <p>Gracias por escribirnos y por darte el tiempo de acercarte a <strong>Casa Amatista</strong>. Ya recibimos tu mensaje sobre <strong>${escapeHtml(reasonLabel)}</strong>.</p>

    <p>Animarse a preguntar, a pedir ayuda o simplemente a buscar un espacio propio ya es un primer paso de cuidado. Nos alegra que hayas elegido dar ese paso con nosotros.</p>

    <div class="divider"></div>

    <p>Alguien del equipo va a leer tu consulta y responderte a la brevedad, de forma personal, al mismo email desde el que nos escribiste (o por WhatsApp si nos dejaste tu número).</p>

    <p>Mientras tanto, podés conocer más sobre nuestras terapias, prácticas y el espacio en <a href="https://casaamatista.org" style="color: #6E5A78;">casaamatista.org</a>.</p>

    <p style="font-size: 12px; color: #7C727C; padding: 12px 16px; background: rgba(110,90,120,0.06); border-left: 3px solid #B7A2AC; border-radius: 3px; margin: 24px 0;">💡 <strong>Para no perderte la respuesta:</strong> agregá <strong>hola@casaamatista.org</strong> a tus contactos o revisá también Spam / Promociones.</p>

    <p class="signature">
      Con calma,<br>
      <strong>Equipo Casa Amatista</strong><br>
      Parque Urquiza · Paraná
    </p>
  </div>
  <div class="footer">
    <p><strong style="color: #DED8E4;">Casa Amatista</strong> · Salud Integrativa y Holística</p>
    <p><a href="https://casaamatista.org">casaamatista.org</a> · <a href="mailto:casaamatistaparana@gmail.com">casaamatistaparana@gmail.com</a></p>
  </div>
</div>
</body>
</html>
`.trim();
}
