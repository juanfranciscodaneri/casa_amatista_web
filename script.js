/* ===========================================================
   CASA AMATISTA · INTERACCIONES
   =========================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navbar al hacer scroll ---------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.pageYOffset > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navLinks.querySelectorAll('a, .nav-cta').forEach(function (el) {
      el.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  /* ---------- Scroll suave para anclas ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#' || id === '') return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.pageYOffset - 74;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Volver arriba ---------- */
  var toTop = document.getElementById('backToTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 600) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Reveal al entrar en viewport ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Banner de cookies ---------- */
  var banner = document.getElementById('cookieBanner');
  try {
    if (banner && !localStorage.getItem('ca_cookies')) {
      setTimeout(function () { banner.classList.add('show'); }, 900);
    }
    function setCookies(v) {
      try { localStorage.setItem('ca_cookies', v); } catch (e) {}
      banner.classList.remove('show');
    }
    var ok = document.getElementById('cookieAccept');
    var no = document.getElementById('cookieReject');
    if (ok) ok.addEventListener('click', function () { setCookies('accepted'); });
    if (no) no.addEventListener('click', function () { setCookies('rejected'); });
  } catch (e) {}

  /* ---------- Modal de contacto ---------- */
  var modal = document.getElementById('contactModal');
  var form = document.getElementById('contactForm');
  var reasonSel = document.getElementById('ct-reason');

  function openModal(reason) {
    if (!modal) return;
    if (reason && reasonSel) reasonSel.value = reason;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var f = modal.querySelector('input, select, textarea');
    if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (form) { form.hidden = false; form.reset(); }
    var alt = modal.querySelector('.modal-alt');
    if (alt) alt.hidden = false;
    var ok = modal.querySelector('.modal-success');
    if (ok) ok.hidden = true;
    if (typeof turnstile !== 'undefined' && turnstile.reset) {
      try { turnstile.reset(); } catch (e) {}
    }
  }

  document.querySelectorAll('.js-open-contact').forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(btn.getAttribute('data-reason')); });
  });
  document.querySelectorAll('.js-close-contact').forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  /* ---------- Modal de Cuerpo · Mente · Alma (Visión · Misión · Propósito) ---------- */
  var VMP = {
    cuerpo: {
      badge: 'Nuestra Misión',
      titulo: 'Cuerpo',
      concepto: 'El cuerpo es el lugar donde nuestra misión se hace concreta, día a día: cuidar y sostener el bienestar físico de cada persona que llega a Casa Amatista. Es a través del cuerpo (el movimiento, el tacto, la respiración) que la misión deja de ser una idea y se transforma en un cambio real y palpable en cada sesión.',
      vivimos: 'La vivimos a través de la Kinesiología, la Reflexología, los Masajes y las prácticas de movimiento consciente como el Yoga, el Tai Chi y la gimnasia para embarazadas: todas disciplinas que trabajan directamente sobre el cuerpo para aliviar, fortalecer y devolverle su capacidad de habitar el presente.',
      sinergia: 'El cuerpo no actúa solo: necesita de la claridad de la Mente para saber hacia dónde dirigir ese cuidado, y del sentido que aporta el Alma para que ese trabajo físico tenga un propósito que lo trascienda. Cuando cuerpo, mente y alma se sostienen mutuamente, la misión de acompañar se cumple de manera integral.'
    },
    mente: {
      badge: 'Nuestra Visión',
      titulo: 'Mente',
      concepto: 'La mente es la que traza el rumbo: la visión de un bienestar posible, la claridad necesaria para imaginarlo y la constancia para sostenerlo en el tiempo. Sin una mente clara, es difícil orientar el cuidado del cuerpo o darle un sentido profundo al camino personal.',
      vivimos: 'La acompañamos a través de la Psicología, la Psicopedagogía, el Coaching Ontológico y prácticas como el Mindfulness y la meditación: espacios que ayudan a ordenar el pensamiento, gestionar las emociones y sostener una mirada más clara sobre la propia vida.',
      sinergia: 'La visión de la mente necesita del cuerpo para materializarse en acciones concretas, y del alma para no quedarse solo en la razón, sino conectar también con lo que verdaderamente importa. Cuerpo, mente y alma se sostienen entre sí para que esa visión se convierta en bienestar real.'
    },
    alma: {
      badge: 'Nuestro Propósito',
      titulo: 'Alma',
      concepto: 'El alma es la que conecta con el propósito: el porqué profundo que le da sentido a cada camino personal, más allá de lo físico o lo racional. Es el espacio donde se busca trascendencia, conexión y significado en medio del cotidiano.',
      vivimos: 'La cuidamos a través de las Constelaciones Familiares, el Reiki, el Tarot Perceptivo y la Bioexistencia Consciente: prácticas que invitan a la introspección, a la conexión con la propia energía y a la búsqueda de sentido en los vínculos y en la propia historia.',
      sinergia: 'El propósito del alma necesita del cuerpo para expresarse en el mundo, y de la mente para poder ser comprendido y sostenido en el tiempo. Cuando cuerpo, mente y alma dialogan entre sí, el propósito deja de ser una búsqueda abstracta y se convierte en un camino de vida con sentido.'
    }
  };

  var vModal = document.getElementById('vmpModal');
  var vBadge = document.getElementById('vmpBadge');
  var vTitle = document.getElementById('vmpTitle');
  var vBody = document.getElementById('vmpBody');
  var lastVmpTrigger = null;

  function renderVmp(data) {
    if (!vBody) return;
    vBadge.textContent = data.badge || 'Casa Amatista';
    vTitle.textContent = data.titulo;
    vBody.innerHTML =
      '<div class="tm-section"><h4>Qué significa</h4><p>' + data.concepto + '</p></div>' +
      '<div class="tm-section"><h4>Cómo la vivimos</h4><p>' + data.vivimos + '</p></div>' +
      '<div class="tm-section"><h4>En sinergia con las otras dos</h4><p>' + data.sinergia + '</p></div>';
  }
  function openVmpModal(key, trigger) {
    var data = VMP[key];
    if (!vModal || !data) return;
    renderVmp(data);
    lastVmpTrigger = trigger || null;
    vModal.hidden = false;
    document.body.style.overflow = 'hidden';
    var closeBtn = vModal.querySelector('.modal-close');
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 60);
  }
  function closeVmpModal() {
    if (!vModal) return;
    vModal.hidden = true;
    document.body.style.overflow = '';
    if (lastVmpTrigger) lastVmpTrigger.focus();
  }
  document.querySelectorAll('.eje[data-vmp]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openVmpModal(btn.getAttribute('data-vmp'), btn);
    });
  });
  document.querySelectorAll('.js-close-vmp').forEach(function (btn) {
    btn.addEventListener('click', closeVmpModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && vModal && !vModal.hidden) closeVmpModal();
  });
  var vmpToTerapias = document.getElementById('vmpToTerapias');
  if (vmpToTerapias) {
    vmpToTerapias.addEventListener('click', function () {
      closeVmpModal();
      var t = document.getElementById('terapias');
      if (t) {
        var y = t.getBoundingClientRect().top + window.pageYOffset - 74;
        setTimeout(function () {
          window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
        }, 10);
      }
    });
  }

  /* ---------- Modal de terapias ---------- */
  var TERAPIAS = {
    psicologia: {
      badge: 'Cuerpo · Mente',
      titulo: 'Psicología',
      concepto: 'La psicología es un espacio de escucha profesional donde podés poner en palabras lo que te pasa, comprender tus patrones de pensamiento y emoción, y encontrar herramientas concretas para atravesar los momentos difíciles. El proceso terapéutico se construye en un vínculo de confianza entre vos y tu terapeuta, respetando tus tiempos.',
      beneficios: [
        'Mejora la gestión emocional y el autoconocimiento.',
        'Aporta herramientas para atravesar duelos, cambios y crisis vitales.',
        'Fortalece los vínculos personales, familiares y de pareja.',
        'Favorece la toma de decisiones desde un lugar más consciente.'
      ],
      recomendada: 'Para cualquier persona que atraviese malestar emocional, quiera conocerse más a sí misma, esté transitando un cambio de vida importante, o simplemente busque un espacio propio de reflexión y contención.',
    },
    psicopedagogia: {
      badge: 'Mente',
      titulo: 'Psicopedagogía',
      concepto: 'La psicopedagogía acompaña los procesos de aprendizaje a lo largo de toda la vida. Trabaja tanto con niños en edad escolar como con jóvenes y adultos.',
      beneficios: [
        'Detecta y aborda dificultades de aprendizaje.',
        'Mejora la organización del estudio y la autonomía escolar.',
        'Fortalece la autoestima vinculada al desempeño académico.',
        'Orienta a familias y docentes sobre cómo acompañar el proceso.'
      ],
      recomendada: 'Para niños y adolescentes con dificultades de aprendizaje, atención o rendimiento escolar, y para adultos que buscan reorganizar sus hábitos de estudio o sospechan una dificultad no diagnosticada.',
    },
    fonoaudiologia: {
      badge: 'Cuerpo',
      titulo: 'Fonoaudiología',
      concepto: 'La fonoaudiología evalúa y trata los trastornos del habla, el lenguaje, la audición y la deglución. A través de ejercicios y técnicas específicas, ayuda a comunicarse con mayor claridad y confianza en cualquier etapa de la vida.',
      beneficios: [
        'Mejora la articulación, fluidez del lenguaje.',
        'Estimula el desarrollo del lenguaje en la infancia.',
        'Rehabilita la comunicación tras eventos neurológicos.',
        'Trabaja la deglución y funciones orofaciales.'
      ],
      recomendada: 'Para niños con demoras en el habla o el lenguaje, y personas que necesiten rehabilitación de la comunicación por distintas causas.',
    },
    kinesiologia: {
      badge: 'Cuerpo',
      titulo: 'Kinesiología',
      concepto: 'La kinesiología trabaja sobre el movimiento del cuerpo para prevenir, tratar y rehabilitar lesiones, dolores y limitaciones físicas. Combina técnicas manuales, ejercicio terapéutico y educación postural para devolverle funcionalidad al cuerpo.',
      beneficios: [
        'Alivia dolores musculares, articulares y de columna.',
        'Acelera la recuperación de lesiones y post-cirugías.',
        'Mejora la movilidad, la postura y el equilibrio.',
        'Previene lesiones a través del fortalecimiento y la corrección postural.'
      ],
      recomendada: 'Para personas con dolores crónicos o agudos, en proceso de rehabilitación post-lesión o post-quirúrgico, deportistas y cualquiera que busque mejorar su condición física general.',
    },
    reflexologia: {
      badge: 'Cuerpo',
      titulo: 'Reflexología',
      concepto: 'La reflexología es una técnica de estimulación manual sobre puntos reflejos ubicados principalmente en pies y manos, que se corresponden con distintos órganos y sistemas del cuerpo, promoviendo la relajación y el equilibrio general.',
      beneficios: [
        'Induce un estado profundo de relajación y descanso.',
        'Ayuda a disminuir la tensión muscular y el estrés.',
        'Mejora la circulación en pies y manos.',
        'Favorece la conexión cuerpo-mente como práctica de autocuidado.'
      ],
      recomendada: 'Para quienes buscan una práctica de relajación complementaria, alivio del estrés cotidiano y bienestar general. Es una técnica suave, apta para la mayoría de las personas.',
    },
    coaching: {
      badge: 'Mente',
      titulo: 'Coaching Ontológico',
      concepto: 'El coaching ontológico es un proceso de conversación estructurada que invita a cuestionar los propios modelos mentales y la forma en que interpretamos la realidad, para abrir nuevas posibilidades de acción frente a los desafíos personales o profesionales.',
      beneficios: [
        'Clarifica objetivos personales y profesionales.',
        'Mejora la comunicación y las relaciones interpersonales.',
        'Ayuda a superar bloqueos y creencias limitantes.',
        'Impulsa el paso de la reflexión a la acción concreta.'
      ],
      recomendada: 'Para personas que atraviesan un momento de definición de rumbo (laboral, vocacional o personal), equipos de trabajo, y quienes buscan potenciar su desarrollo personal desde la acción.',
    },
    mindfulness: {
      badge: 'Mente · Alma',
      titulo: 'Mindfulness',
      concepto: 'El mindfulness o atención plena es una práctica de entrenamiento mental que consiste en dirigir la atención al momento presente, sin juzgar la experiencia. A través de la meditación y ejercicios de respiración, ayuda a salir del piloto automático y habitar el aquí y ahora.',
      beneficios: [
        'Reduce el estrés, la rumiación y la ansiedad.',
        'Mejora la concentración y la calidad del sueño.',
        'Aumenta la regulación emocional frente a situaciones difíciles.',
        'Favorece una relación más amable con uno mismo.'
      ],
      recomendada: 'Para cualquier persona, sin necesidad de experiencia previa. Especialmente útil para quienes viven con altos niveles de estrés, ansiedad o dificultad para desconectar.',
    },
    constelaciones: {
      badge: 'Alma',
      titulo: 'Constelaciones Familiares',
      concepto: 'Las constelaciones familiares son una práctica sistémica que permite visualizar las dinámicas y lealtades invisibles dentro de una familia o sistema, para identificar patrones que se repiten y encontrar un nuevo orden que traiga alivio y movimiento. Se realizan en formato individual o grupal.',
      beneficios: [
        'Ayuda a comprender patrones familiares repetitivos.',
        'Aporta alivio en conflictos vinculares y de pareja.',
        'Favorece el cierre de duelos y situaciones no resueltas.',
        'Ofrece una mirada sistémica complementaria a otros procesos.'
      ],
      recomendada: 'Para quienes atraviesan conflictos familiares o vinculares recurrentes, duelos no resueltos, o quieren explorar el origen sistémico de ciertos patrones de vida.',
    },
    tarot: {
      badge: 'Alma',
      titulo: 'Tarot Perceptivo',
      concepto: 'El tarot perceptivo utiliza las cartas como disparador simbólico para la introspección, ayudando a poner en palabras intuiciones y emociones que muchas veces cuesta nombrar. No se trata de predecir el futuro, sino de generar una lectura reflexiva sobre el presente.',
      beneficios: [
        'Favorece la introspección y la toma de conciencia.',
        'Ayuda a ordenar ideas frente a una decisión o encrucijada.',
        'Abre preguntas nuevas sobre situaciones personales.',
        'Es un espacio de escucha simbólica y no directiva.'
      ],
      recomendada: 'Para quienes buscan un espacio de reflexión simbólica sobre su momento actual, con curiosidad y apertura, como complemento a otras prácticas de autoconocimiento.',
    },
    bioexistencia: {
      badge: 'Cuerpo · Alma',
      titulo: 'Bioexistencia Consciente',
      concepto: 'La bioexistencia consciente es un trabajo corporal y emocional que integra movimiento, respiración y expresión para reconectar con la propia vitalidad. Busca liberar tensiones acumuladas y recuperar la energía vital a través de la conciencia del cuerpo.',
      beneficios: [
        'Libera tensiones físicas y emocionales acumuladas.',
        'Reconecta con la vitalidad y la energía corporal.',
        'Favorece la expresión genuina de las emociones.',
        'Complementa otros procesos terapéuticos y de autoconocimiento.'
      ],
      recomendada: 'Para quienes sienten estancamiento físico o emocional, buscan reconectar con su cuerpo y su energía vital, o desean complementar un proceso terapéutico con trabajo corporal.',
    },
    reiki: {
      badge: 'Alma',
      titulo: 'Reiki',
      concepto: 'El reiki es una técnica de armonización energética de origen japonés, en la que el terapeuta canaliza energía a través de la imposición de manos, con el objetivo de promover la relajación profunda, el equilibrio y la sensación de bienestar general.',
      beneficios: [
        'Induce un estado de relajación profunda.',
        'Ayuda a disminuir el estrés y la fatiga.',
        'Favorece la sensación de equilibrio y bienestar general.'
      ],
      recomendada: 'Para quienes buscan una práctica de relajación y acompañamiento energético complementario, en cualquier etapa de la vida, sin contraindicaciones físicas de por medio.',
    },
    masajes: {
      badge: 'Cuerpo',
      titulo: 'Masajes',
      concepto: 'Los masajes terapéuticos utilizan distintas técnicas manuales para trabajar sobre la musculatura, liberar tensiones y mejorar la circulación. Según la técnica y el objetivo, pueden ser relajantes, descontracturantes o focalizados en zonas específicas.',
      beneficios: [
        'Alivia contracturas y tensiones musculares.',
        'Mejora la circulación sanguínea y linfática.',
        'Reduce el estrés y favorece la relajación profunda.',
        'Mejora la calidad del sueño y la sensación general de bienestar.'
      ],
      recomendada: 'Para quienes sufren de tensión muscular por estrés o malas posturas, buscan una pausa de relajación, o necesitan un trabajo focalizado sobre alguna zona específica del cuerpo.',
    }
  };

  var tModal = document.getElementById('terapiaModal');
  var tBadge = document.getElementById('terapiaBadge');
  var tTitle = document.getElementById('terapiaTitle');
  var tBody = document.getElementById('terapiaBody');
  var lastTerapiaTrigger = null;

  function renderTerapia(data) {
    if (!tBody) return;
    tBadge.textContent = data.badge || 'Casa Amatista';
    tTitle.textContent = data.titulo;
    var beneficiosHtml = data.beneficios.map(function (b) { return '<li>' + b + '</li>'; }).join('');
    tBody.innerHTML =
      '<div class="tm-section"><h4>Qué es</h4><p>' + data.concepto + '</p></div>' +
      '<div class="tm-section"><h4>Beneficios</h4><ul>' + beneficiosHtml + '</ul></div>' +
      '<div class="tm-section"><h4>Se recomienda para</h4><p>' + data.recomendada + '</p></div>';
  }
  function openTerapiaModal(key, trigger) {
    var data = TERAPIAS[key];
    if (!tModal || !data) return;
    renderTerapia(data);
    lastTerapiaTrigger = trigger || null;
    tModal.hidden = false;
    document.body.style.overflow = 'hidden';
    var closeBtn = tModal.querySelector('.modal-close');
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 60);
  }
  function closeTerapiaModal() {
    if (!tModal) return;
    tModal.hidden = true;
    document.body.style.overflow = '';
    if (lastTerapiaTrigger) lastTerapiaTrigger.focus();
  }
  document.querySelectorAll('.terapia[data-terapia]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openTerapiaModal(btn.getAttribute('data-terapia'), btn);
    });
  });
  document.querySelectorAll('.js-close-terapia').forEach(function (btn) {
    btn.addEventListener('click', closeTerapiaModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && tModal && !tModal.hidden) closeTerapiaModal();
  });
  var terapiaToContact = document.getElementById('terapiaToContact');
  if (terapiaToContact) {
    terapiaToContact.addEventListener('click', function () {
      closeTerapiaModal();
      openModal('terapia');
    });
  }

  /* ---------- Envío del formulario ---------- */
  var WA_NUMBER = '5493434732062';
  var reasonText = {
    reserva: 'Reservar un turno',
    terapia: 'Una terapia',
    practica: 'Prácticas (yoga / meditación)',
    alquiler: 'Alquiler de espacio',
    general: 'Consulta general'
  };

  function waFallback(data) {
    var msg = 'Hola Casa Amatista! Soy ' + data.name + '.\n' +
      'Motivo: ' + (reasonText[data.reason] || data.reason) + '.\n' +
      data.message +
      (data.whatsapp ? ('\nMi WhatsApp: ' + data.whatsapp) : '') +
      (data.email ? ('\nMi email: ' + data.email) : '');
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = {
        name: form.querySelector('#ct-name').value.trim(),
        email: form.querySelector('#ct-email').value.trim(),
        whatsapp: form.querySelector('#ct-whatsapp').value.trim(),
        reason: form.querySelector('#ct-reason').value,
        message: form.querySelector('#ct-message').value.trim()
      };
      var turnstileField = form.querySelector('[name="cf-turnstile-response"]');
      var turnstileToken = turnstileField ? turnstileField.value : null;

      var submitBtn = form.querySelector('.modal-submit');
      var original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      function showSuccess() {
        form.hidden = true;
        var alt = modal.querySelector('.modal-alt');
        if (alt) alt.hidden = true;
        var ok = modal.querySelector('.modal-success');
        if (ok) ok.hidden = false;
      }

      if (!turnstileToken) {
        // Sin verificación de seguridad completa: vamos directo al fallback de WhatsApp.
        window.open(waFallback(data), '_blank');
        showSuccess();
        submitBtn.disabled = false;
        submitBtn.textContent = original;
        return;
      }

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp || null,
          reason: data.reason,
          message: data.message,
          turnstileToken: turnstileToken
        })
      }).then(function (r) {
        if (!r.ok) throw new Error('bad');
        return r.json();
      }).then(function () {
        showSuccess();
      }).catch(function () {
        // Sin backend disponible: abrimos WhatsApp con el mensaje ya escrito.
        window.open(waFallback(data), '_blank');
        showSuccess();
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      });
    });
  }

  /* ---------- Hero: partículas suaves (motas de luz / incienso) ---------- */
  var canvas = document.getElementById('petals');
  if (canvas && !reduce) {
    var ctx = canvas.getContext('2d');
    var W, H, parts = [];
    var COLORS = ['rgba(222,216,228,', 'rgba(199,191,209,', 'rgba(183,162,172,'];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    function make() {
      return {
        x: Math.random() * W,
        y: H + Math.random() * H,
        r: 2.5 + Math.random() * 6.5,
        sp: 0.25 + Math.random() * 0.85,
        drift: (Math.random() - 0.5) * 0.6,
        a: 0.35 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
        c: COLORS[(Math.random() * COLORS.length) | 0]
      };
    }
    function init() {
      resize();
      var n = Math.min(70, Math.round(W / 16));
      parts = [];
      for (var i = 0; i < n; i++) { var p = make(); p.y = Math.random() * H; parts.push(p); }
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.sp;
        p.x += p.drift + Math.sin(p.tw * 0.5) * 0.15;
        p.tw += 0.025;
        var alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.save();
        ctx.shadowColor = p.c + (alpha * 0.9).toFixed(3) + ')';
        ctx.shadowBlur = p.r * 2.2;
        ctx.beginPath();
        ctx.fillStyle = p.c + alpha.toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.strokeStyle = p.c + (alpha * 0.9).toFixed(3) + ')';
        ctx.lineWidth = 0.7;
        ctx.arc(p.x - p.r * 0.32, p.y - p.r * 0.32, p.r * 0.55, 0, Math.PI * 2);
        ctx.stroke();
        if (p.y < -10) { parts[i] = make(); }
      }
      requestAnimationFrame(tick);
    }
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(init, 200); });
    init();
    tick();
  }
})();
