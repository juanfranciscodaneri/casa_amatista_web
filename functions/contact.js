// ===========================================================
// CASA AMATISTA · Cloudflare Pages Function · /contact
// Recibe el formulario de contacto y envía:
//   (1) una notificación al mail de Casa Amatista
//   (2) una confirmación cálida a la persona que escribió
//
// Requiere una variable de entorno en Cloudflare Pages:
//   RESEND_API_KEY  → tu clave de API de Resend (https://resend.com)
//
// Opcional (recomendado para producción con dominio propio):
//   Verificá el dominio casaamatista.com.ar en Resend y ajustá
//   las direcciones "from" de abajo. Mientras tanto, el sitio ya
//   funciona: si esta función no está disponible, el formulario
//   abre WhatsApp con el mensaje ya escrito (fallback en script.js).
// ===========================================================

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const data = await request.json();

    // Validación mínima
    if (!data.name || !data.email || !data.message || !data.reason) {
      return json({ error: 'Faltan datos requeridos' }, 400);
    }
    if (!env.RESEND_API_KEY) {
      return json({ error: 'Configuración incompleta' }, 500);
    }

    // (Opcional) Verificación anti-spam con Cloudflare Turnstile.
    // Si configurás TURNSTILE_SECRET_KEY y agregás el widget al form,
    // esta comprobación se activa sola. Si no, se omite.
    if (env.TURNSTILE_SECRET_KEY && data.turnstileToken) {
      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: data.turnstileToken,
          remoteip: request.headers.get('CF-Connecting-IP'),
        }),
      });
      const result = await verify.json();
      if (!result.success) return json({ error: 'Verificación de seguridad falló' }, 403);
    }

    const timestamp = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const reasonLabels = {
      reserva: 'Reservar un turno',
      terapia: 'Una terapia',
      practica: 'Prácticas (yoga / meditación / tai chi)',
      alquiler: 'Alquiler de consultorio o salón',
      general: 'Consulta general',
    };
    const reasonLabel = reasonLabels[data.reason] || data.reason;

    // Direcciones. Cambialas por las de tu dominio verificado en Resend.
    const FROM_NOTIFY = 'Casa Amatista <notificaciones@casaamatista.com.ar>';
    const FROM_REPLY  = 'Casa Amatista <hola@casaamatista.com.ar>';
    const TO_INBOX    = 'casaamatistaparana@gmail.com';

    // ---- Email 1: aviso interno ----
    const adminHtml = `
      <h2>Nueva consulta desde el sitio</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>WhatsApp:</strong> ${escapeHtml(data.whatsapp || '(no proporcionado)')}</p>
      <p><strong>Motivo:</strong> ${escapeHtml(reasonLabel)}</p>
      <p><strong>Fecha:</strong> ${timestamp}</p>
      <hr>
      <p><strong>Mensaje:</strong></p>
      <p style="white-space:pre-wrap; padding:12px; background:#f4f1f5; border-radius:6px;">${escapeHtml(data.message)}</p>
      <hr>
      <p><small>Podés responder directamente a este email; le llegará a ${escapeHtml(data.email)}.</small></p>
    `;
    await sendEmail(env.RESEND_API_KEY, {
      from: FROM_NOTIFY,
      to: [TO_INBOX],
      reply_to: data.email,
      subject: `🔔 Nueva consulta [${reasonLabel}]: ${data.name}`,
      html: adminHtml,
    });

    // ---- Email 2: confirmación a la persona ----
    const firstName = String(data.name).split(' ')[0];
    await sendEmail(env.RESEND_API_KEY, {
      from: FROM_REPLY,
      to: [data.email],
      reply_to: TO_INBOX,
      subject: `${firstName}, recibimos tu mensaje 🤍`,
      html: confirmationEmail(firstName),
    });

    return json({ success: true }, 200);
  } catch (err) {
    console.error('Contact error:', err);
    return json({ error: 'Error interno del servidor' }, 500);
  }
}

// ===================== Helpers =====================
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function sendEmail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error('Resend error:', await res.text());
    throw new Error('Error al enviar email');
  }
  return res.json();
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function confirmationEmail(firstName) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F6F4F1;color:#4A4048;}
  .container{max-width:600px;margin:0 auto;background:#FBFAF7;}
  .header{background:linear-gradient(180deg,#3B3047 0%,#2A2333 100%);padding:44px 32px;text-align:center;}
  .header h1{color:#F6F4F1;font-size:24px;font-weight:600;margin:0;font-family:Georgia,'Times New Roman',serif;}
  .tagline{color:#C7BFD1;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-top:8px;}
  .content{padding:38px 34px;}
  .content p{font-size:15px;line-height:1.7;color:#4A4048;margin:0 0 16px;}
  .content p strong{color:#3B3047;}
  .divider{height:1px;background:rgba(110,90,120,.14);margin:28px 0;}
  .note{font-size:12.5px;color:#7C727C;padding:13px 16px;background:rgba(110,90,120,.06);border-left:3px solid #B7A2AC;border-radius:4px;margin:22px 0;}
  .signature{margin-top:28px;font-size:14px;color:#7C727C;}
  .signature strong{color:#3B3047;}
  .footer{background:#2A2333;padding:24px 32px;text-align:center;}
  .footer p{color:#C7BFD1;font-size:11px;margin:4px 0;}
  .footer a{color:#DED8E4;text-decoration:none;}
</style></head>
<body>
<div class="container">
  <div class="header">
    <h1>Recibimos tu mensaje, ${firstName}</h1>
    <div class="tagline">Cuerpo · Mente · Alma</div>
  </div>
  <div class="content">
    <p>Gracias por escribirle a <strong>Casa Amatista</strong>. Tu mensaje ya está con nosotros y muy pronto vamos a responderte.</p>
    <p>Dar el paso de buscar un espacio para cuidarte también es una forma de cuidado. Nos alegra que hayas pensado en nosotros para acompañarte.</p>
    <div class="divider"></div>
    <p>Una persona de nuestro equipo va a leer tu consulta y responderte por este medio. Si tu tema es urgente, también podés escribirnos por <strong>WhatsApp al +54 9 343 473 2062</strong>.</p>
    <div class="note">💡 <strong>Para no perderte nuestra respuesta:</strong> revisá tu carpeta de <em>Spam</em> o <em>Promociones</em> y, si nos encontrás ahí, movenos a tu bandeja principal.</div>
    <p class="signature">Con cariño,<br><strong>Casa Amatista</strong><br>Paraná, Entre Ríos</p>
  </div>
  <div class="footer">
    <p><strong style="color:#DED8E4;">Casa Amatista</strong> · Salud integrativa y holística</p>
    <p>De La Torre y Vera 1064 · Parque Urquiza · Paraná</p>
  </div>
</div>
</body>
</html>`.trim();
}
