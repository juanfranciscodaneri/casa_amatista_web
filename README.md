# Casa Amatista · Sitio web

Sitio web institucional de **Casa Amatista**, centro de salud integrativa y holística en Paraná, Entre Ríos.
Diseñado según el manual de identidad de la marca (paleta amatista, tipografías Cormorant Garamond + Lora + Inter).

> **Cuerpo · Mente · Alma**

---

## Estructura

```
casa_amatista_web/
├── index.html            ← Página principal (one-page)
├── styles.css            ← Sistema visual completo de la marca
├── script.js             ← Interacciones (nav, reveal, cookies, modal, hero)
├── robots.txt
├── sitemap.xml
├── assets/               ← Logos, favicon y fotos optimizadas
│   ├── logo-violeta.png / logo-crema.png
│   ├── isotipo-violeta.png / isotipo-crema.png
│   ├── favicon.png
│   └── (fotos: salon-yoga, buda, patio-zen, consultorios, hall, diosa…)
├── paginas/              ← Páginas legales
│   ├── aviso-legal.html
│   ├── privacidad.html
│   ├── cookies.html
│   └── terminos.html
└── functions/            ← Cloudflare Pages Function del formulario
    └── contact.js
```

---

## Secciones de la página

Inicio (hero) · Filosofía (Cuerpo/Mente/Alma) · Terapias (12) · Prácticas (yoga, meditación, tai chi, gimnasia para embarazadas) · El espacio (galería) · Alquiler (consultorios y salones) · Contacto (dirección, mapa, WhatsApp) · Preguntas frecuentes.

---

## Identidad visual

| Elemento | Especificación |
|----------|----------------|
| Violeta Amatista | `#6E5A78` |
| Amatista profundo (secciones oscuras) | `#3B3047` / `#2A2333` |
| Lavanda Gris | `#C7BFD1` |
| Blanco Roto (fondo) | `#F6F4F1` |
| Beige Piedra | `#E6DFD6` |
| Nude Rosé | `#B7A2AC` |
| Tipografía títulos | Cormorant Garamond |
| Tipografía cuerpo | Inter |
| Tipografía citas | Lora (itálica) |

---

## Formulario de contacto

El formulario del sitio funciona en **dos modos**:

1. **Con backend (recomendado):** al desplegar en Cloudflare Pages, la función `functions/contact.js` recibe el envío y manda un email de aviso a `casaamatistaparana@gmail.com` y una confirmación a la persona.
   - Requiere una variable de entorno: **`RESEND_API_KEY`** (cuenta gratuita en [resend.com](https://resend.com)).
   - Para que los emails salgan desde `@casaamatista.com.ar`, verificá el dominio en Resend y ajustá las direcciones `from` dentro de `functions/contact.js`. (Opcional pero recomendado.)
   - Anti-spam opcional con Cloudflare Turnstile: si definís `TURNSTILE_SECRET_KEY` y agregás el widget al formulario, la verificación se activa sola.

2. **Sin backend (fallback automático):** si la función no está disponible, el formulario abre **WhatsApp** con el mensaje ya redactado hacia el +54 9 343 473 2062. El sitio nunca queda “sin salida”.

El botón principal en toda la página es **WhatsApp**, que es el canal preferido para reservar turnos.

---

## Deploy (Cloudflare Pages · recomendado)

1. Subí la carpeta `casa_amatista_web` a un repositorio, o arrastrala en el panel de Cloudflare Pages.
2. Build command: *(ninguno)* · Output directory: `/` (la raíz del proyecto).
3. En **Settings → Environment variables**, agregá `RESEND_API_KEY`.
4. Configurá tu dominio (`casaamatista.com.ar` u otro).

También funciona en **Netlify**, **Vercel** o cualquier hosting estático (en ese caso, el formulario usará el fallback de WhatsApp salvo que adaptes la función a la plataforma).

---

## Pendientes / a verificar antes de publicar

- [ ] **Dominio:** el sitio usa `casaamatista.com.ar` como placeholder en las URLs, el sitemap y los metadatos. Reemplazalo por el dominio real cuando lo tengas.
- [ ] **Facebook:** el enlace apunta a `facebook.com/casaamatista.parana` (tentativo). Confirmá la URL real de la página.
- [ ] **Instagram / Threads:** apuntan a `@casaamatista.parana`. Verificá que sean correctos.
- [ ] **Email de envío:** si configurás Resend con dominio propio, actualizá las direcciones `from` en `functions/contact.js`.
- [ ] **Fotos:** las imágenes fueron optimizadas para web. Si querés reemplazar alguna, mantené proporciones similares.

---

## Notas de diseño

- Las terapias, prácticas y ejes **no llevan numeración** (Cuerpo · Mente · Alma no es una secuencia), a diferencia del sitio de referencia.
- El favicon fue generado a partir del isologotipo de Casa Amatista (el favicon incluido en los archivos originales pertenecía a otra marca).
- El "Nude Rosé" del manual tenía un hex duplicado por error; se corrigió a `#B7A2AC` según el swatch real.
- Animación del hero (partículas suaves) y transiciones respetan `prefers-reduced-motion`.

---

© 2026 Casa Amatista · Paraná, Entre Ríos.
