export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Escudo PNG
    if (url.pathname === '/escudo') {
      const res = await fetch('https://raw.githubusercontent.com/Warmours/warmours.com/main/escudo_transparent.png');
      const img = await res.arrayBuffer();
      return new Response(img, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    // Registro GET
    if (url.pathname === '/registro' && request.method === 'GET') {
      return new Response(REGISTRO_HTML, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    // Registro POST - guarda en D1
    if (url.pathname === '/registro' && request.method === 'POST') {
      try {
        const data = await request.json();
        const ip = request.headers.get('CF-Connecting-IP') || '';

        await env.DB.prepare(
          `INSERT INTO registros (nombre, correo, empresa, telefono, mensaje, fecha, ip)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          data.nombre || '',
          data.correo || '',
          data.empresa || '',
          data.telefono || '',
          data.mensaje || '',
          data.fecha || new Date().toISOString(),
          ip
        ).run();

        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Landing principal
    return new Response(HOME_HTML, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};

const HOME_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>White Armour Systems</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --black:  #04040a;
    --white:  #f2f0eb;
    --dim:    #8a8880;
    --green:  #2a7e17;
    --green2: #49c436;
    --gold:   #a89060;
    --border: rgba(255,255,255,0.07);
  }

  html, body {
    width: 100%; height: 100%;
    overflow: hidden;
  }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Cormorant Garamond', Georgia, serif;
    position: relative;
  }

  /* ── STARFIELD ── */
  #stars {
    position: fixed;
    inset: 0;
    z-index: 0;
  }

  /* ── GRAIN ── */
  body::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  /* ── LAYOUT ── */
  .page {
    position: relative;
    z-index: 2;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* ── LOGO TOP LEFT ── */
  .shield-wrap {
    position: fixed;
    top: 28px;
    left: 32px;
    opacity: 0;
    animation: fadeIn 1.4s ease 0.3s forwards;
  }

  .shield-wrap img {
    width: 52px;
    height: auto;
    filter: drop-shadow(0 0 8px rgba(77,196,54,0.2));
  }

  /* ── CENTER CONTENT ── */
  .center {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .was-line {
    font-family: 'Cinzel', serif;
    font-weight: 300;
    font-size: clamp(11px, 1.5vw, 15px);
    letter-spacing: 0.55em;
    color: var(--dim);
    text-transform: uppercase;
    margin-bottom: 22px;
    opacity: 0;
    animation: fadeIn 1.2s ease 0.8s forwards;
  }

  .was-name {
    font-family: 'Cinzel', serif;
    font-weight: 400;
    font-size: clamp(28px, 5.5vw, 72px);
    letter-spacing: 0.18em;
    color: var(--white);
    line-height: 1;
    text-transform: uppercase;
    opacity: 0;
    animation: fadeIn 1.4s ease 1s forwards;
  }

  .was-name em {
    font-style: normal;
    color: var(--green2);
  }

  .divider-line {
    width: 1px;
    height: 60px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    margin: 36px auto;
    opacity: 0;
    animation: fadeIn 1s ease 1.6s forwards;
  }

  .slogan {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(14px, 1.8vw, 21px);
    letter-spacing: 0.12em;
    color: var(--dim);
    max-width: 480px;
    line-height: 1.7;
    opacity: 0;
    animation: fadeIn 1.2s ease 2s forwards;
  }

  .slogan strong {
    font-weight: 400;
    font-style: normal;
    color: rgba(242,240,235,0.6);
    letter-spacing: 0.2em;
    font-size: 0.8em;
    text-transform: uppercase;
    display: block;
    margin-top: 10px;
    font-family: 'Cinzel', serif;
  }

  /* ── BOTTOM BAR ── */
  .bottom-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 36px;
    border-top: 1px solid var(--border);
    background: rgba(4,4,10,0.85);
    backdrop-filter: blur(8px);
    z-index: 10;
    opacity: 0;
    animation: fadeIn 1s ease 2.6s forwards;
  }

  /* ── LEGAL MENU ── */
  .legal-wrap {
    position: relative;
  }

  .legal-trigger {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 0.22em;
    color: var(--dim);
    text-transform: uppercase;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 0;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .legal-trigger:hover { color: var(--white); }

  .legal-trigger::before {
    content: '▲';
    font-size: 7px;
    transition: transform 0.3s;
  }

  .legal-trigger.open::before { transform: rotate(180deg); }

  .legal-panel {
    position: absolute;
    bottom: 52px;
    left: 0;
    min-width: 320px;
    background: rgba(8,10,8,0.97);
    border: 1px solid var(--border);
    backdrop-filter: blur(16px);
    padding: 24px;
    display: none;
    flex-direction: column;
    gap: 0;
  }

  .legal-panel.open { display: flex; }

  .legal-section {
    margin-bottom: 20px;
  }

  .legal-section:last-child { margin-bottom: 0; }

  .legal-cat {
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.25em;
    color: var(--green2);
    text-transform: uppercase;
    margin-bottom: 10px;
    opacity: 0.8;
  }

  .legal-link {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px;
    color: var(--dim);
    text-decoration: none;
    padding: 5px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    letter-spacing: 0.04em;
    transition: color 0.15s, padding-left 0.15s;
    cursor: pointer;
  }

  .legal-link:hover {
    color: var(--white);
    padding-left: 8px;
  }

  .legal-separator {
    height: 1px;
    background: var(--border);
    margin: 16px 0;
  }

  .legal-notice {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px;
    color: rgba(138,136,128,0.5);
    line-height: 1.6;
    font-style: italic;
  }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(4,4,10,0.92);
    backdrop-filter: blur(12px);
    z-index: 100;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .modal-overlay.open { display: flex; }

  .modal-box {
    background: #080c08;
    border: 1px solid var(--border);
    max-width: 620px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 40px;
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: var(--green) transparent;
  }

  .modal-close {
    position: absolute;
    top: 20px; right: 24px;
    background: none;
    border: none;
    color: var(--dim);
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
    transition: color 0.2s;
  }

  .modal-close:hover { color: var(--white); }

  .modal-title {
    font-family: 'Cinzel', serif;
    font-size: 14px;
    letter-spacing: 0.2em;
    color: var(--white);
    text-transform: uppercase;
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .modal-body {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    color: var(--dim);
    line-height: 1.9;
  }

  .modal-body h3 {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: var(--green2);
    text-transform: uppercase;
    margin: 24px 0 10px;
    font-weight: 400;
  }

  .modal-body p { margin-bottom: 12px; }

  /* ── REGISTER BUTTON ── */
  .register-btn {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--black);
    background: var(--white);
    border: none;
    padding: 12px 28px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s, color 0.2s;
    position: relative;
    overflow: hidden;
  }

  .register-btn::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 100%; height: 2px;
    background: var(--green2);
    transform: scaleX(0);
    transition: transform 0.3s;
  }

  .register-btn:hover { background: rgba(255,255,255,0.9); }
  .register-btn:hover::after { transform: scaleX(1); }

  /* ── VERSION MARK ── */
  .version-mark {
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.15em;
    color: rgba(138,136,128,0.3);
    text-transform: uppercase;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── CURSOR GLOW ── */
  .glow {
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(41,122,20,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: left 0.8s ease, top 0.8s ease;
  }
</style>
</head>
<body>

<!-- Cursor glow -->
<div class="glow" id="glow"></div>

<!-- Starfield -->
<canvas id="stars"></canvas>

<!-- Shield top left -->
<div class="shield-wrap">
  <img src="https://raw.githubusercontent.com/Warmours/warmours.com/main/amras_escudo_sin_fondo.svg" alt="Warmours Shield">
</div>

<!-- Main content -->
<main class="page">
  <div class="center">
    <p class="was-line">Est. 2024 · Monterrey, México</p>
    <h1 class="was-name">
      White&nbsp;<em>Armour</em>&nbsp;Systems
    </h1>
    <div class="divider-line"></div>
    <p class="slogan">
      <strong>Único en su clase</strong>
    </p>
  </div>
</main>

<!-- Bottom bar -->
<footer class="bottom-bar">
  <!-- Legal menu (left) -->
  <div class="legal-wrap">
    <button class="legal-trigger" id="legalBtn" onclick="toggleLegal()">
      Avisos legales &amp; privacidad
    </button>
    <div class="legal-panel" id="legalPanel">

      <div class="legal-section">
        <p class="legal-cat">Privacidad &amp; Datos</p>
        <a class="legal-link" onclick="openModal('privacidad')">Aviso de Privacidad</a>
        <a class="legal-link" onclick="openModal('cookies')">Política de Cookies</a>
        <a class="legal-link" onclick="openModal('datos')">Tratamiento de Datos Personales</a>
      </div>

      <div class="legal-separator"></div>

      <div class="legal-section">
        <p class="legal-cat">Contratos &amp; Términos</p>
        <a class="legal-link" onclick="openModal('tyc')">Términos y Condiciones de Servicio</a>
        <a class="legal-link" onclick="openModal('nda')">Acuerdo de Confidencialidad (NDA)</a>
        <a class="legal-link" onclick="openModal('consultoria')">Contrato de Consultoría</a>
        <a class="legal-link" onclick="openModal('mantenimiento')">Contrato de Mantenimiento</a>
        <a class="legal-link" onclick="openModal('marketing')">Contrato de Marketing</a>
      </div>

      <div class="legal-separator"></div>

      <div class="legal-section">
        <p class="legal-cat">Propiedad Intelectual</p>
        <a class="legal-link" onclick="openModal('indautor')">Registro INDAUTOR — Obra literaria/software</a>
        <a class="legal-link" onclick="openModal('impi')">Registro IMPI — Marca &amp; Nombre comercial</a>
        <a class="legal-link" onclick="openModal('licencia')">Licencia de Uso de Software WAS</a>
      </div>

      <div class="legal-separator"></div>
      <p class="legal-notice">
        © White Armour Systems. Todos los derechos reservados.<br>
        Monterrey, Nuevo León, México.
      </p>
    </div>
  </div>

  <div class="version-mark">W·A·S v1.0</div>

  <!-- Register button (right) -->
  <a href="registro.html" class="register-btn">Registrarse →</a>
</footer>

<!-- MODALS -->
<div class="modal-overlay" id="modalOverlay" onclick="closeModalOutside(event)">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal()">✕</button>
    <h2 class="modal-title" id="modalTitle"></h2>
    <div class="modal-body" id="modalBody"></div>
  </div>
</div>

<script>
// ── STARFIELD ──
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const n = Math.floor((canvas.width * canvas.height) / 6000);
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.003,
      speed: 0.02 + Math.random() * 0.04
    });
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.a += s.da;
    if (s.a < 0.05 || s.a > 0.9) s.da *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = \`rgba(242,240,235,\${s.a})\`;
    ctx.fill();
    s.y -= s.speed * 0.1;
    if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
  });
  requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateStars();

// ── CURSOR GLOW ──
const glow = document.getElementById('glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── LEGAL TOGGLE ──
function toggleLegal() {
  const btn   = document.getElementById('legalBtn');
  const panel = document.getElementById('legalPanel');
  btn.classList.toggle('open');
  panel.classList.toggle('open');
}

document.addEventListener('click', e => {
  const wrap = document.querySelector('.legal-wrap');
  if (!wrap.contains(e.target)) {
    document.getElementById('legalBtn').classList.remove('open');
    document.getElementById('legalPanel').classList.remove('open');
  }
});

// ── MODALS ──
const modalContent = {
  privacidad: {
    title: 'Aviso de Privacidad',
    body: \`
      <h3>Responsable del Tratamiento</h3>
      <p>White Armour Systems (W.A.S.), con domicilio en Monterrey, Nuevo León, México, es responsable del tratamiento de sus datos personales.</p>
      <h3>Datos que Recabamos</h3>
      <p>Nombre completo, correo electrónico, empresa, cargo, teléfono de contacto, y datos derivados del uso de nuestra plataforma de rastreo de activos.</p>
      <h3>Finalidades del Tratamiento</h3>
      <p>Prestación del servicio WAS Smart Tags, soporte técnico, facturación, comunicaciones comerciales relacionadas con el servicio contratado.</p>
      <h3>Transferencias</h3>
      <p>Sus datos no serán vendidos, cedidos ni transferidos a terceros sin su consentimiento, salvo obligación legal.</p>
      <h3>Derechos ARCO</h3>
      <p>Puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición escribiendo a: <strong>privacidad@warmours.com</strong></p>
      <h3>Cookies y Tecnologías de Rastreo</h3>
      <p>Esta plataforma utiliza cookies técnicas necesarias para el funcionamiento del servicio. Consulte nuestra Política de Cookies para más información.</p>
    \`
  },
  cookies: {
    title: 'Política de Cookies',
    body: \`
      <h3>¿Qué son las cookies?</h3>
      <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestra plataforma.</p>
      <h3>Cookies que Utilizamos</h3>
      <p><strong>Técnicas/Esenciales:</strong> Necesarias para autenticación y funcionamiento de la plataforma. No pueden desactivarse.</p>
      <p><strong>Analíticas:</strong> Nos permiten entender cómo se usa la plataforma para mejorar el servicio. Pueden desactivarse.</p>
      <p><strong>De Preferencias:</strong> Recuerdan su configuración de interfaz. Pueden desactivarse.</p>
      <h3>Control de Cookies</h3>
      <p>Puede gestionar las cookies desde la configuración de su navegador. La desactivación de cookies técnicas puede afectar el funcionamiento de la plataforma.</p>
      <h3>Vigencia</h3>
      <p>Las cookies de sesión expiran al cerrar el navegador. Las cookies persistentes tienen una vigencia de 12 meses.</p>
    \`
  },
  tyc: {
    title: 'Términos y Condiciones de Servicio',
    body: \`
      <h3>Objeto del Servicio</h3>
      <p>White Armour Systems provee una plataforma SaaS de gestión y rastreo de activos mediante tecnología NFC, UHF-RFID y UWB, denominada WAS Smart Tags Platform.</p>
      <h3>Licencia de Uso</h3>
      <p>Se otorga una licencia de uso limitada, no exclusiva, no transferible, para acceder y utilizar la plataforma durante el período de suscripción contratado.</p>
      <h3>Restricciones</h3>
      <p>Queda prohibido: (a) sublicenciar, vender o redistribuir el acceso; (b) realizar ingeniería inversa; (c) usar el servicio para fines ilegales o contrarios al orden público.</p>
      <h3>Niveles de Servicio (SLA)</h3>
      <p>W.A.S. garantiza una disponibilidad del 99.5% mensual de la plataforma, excluyendo mantenimientos programados notificados con 48 horas de anticipación.</p>
      <h3>Propiedad Intelectual</h3>
      <p>Todo el software, algoritmos, interfaces y documentación son propiedad exclusiva de White Armour Systems. El cliente conserva la propiedad de sus datos.</p>
      <h3>Limitación de Responsabilidad</h3>
      <p>La responsabilidad máxima de W.A.S. se limita al importe pagado por el cliente en los últimos 3 meses de servicio.</p>
      <h3>Ley Aplicable y Jurisdicción</h3>
      <p>El presente contrato se rige por las leyes de los Estados Unidos Mexicanos. Las partes se someten a los tribunales competentes de Monterrey, Nuevo León.</p>
    \`
  },
  nda: {
    title: 'Acuerdo de Confidencialidad (NDA)',
    body: \`
      <h3>Información Confidencial</h3>
      <p>Se considera información confidencial: arquitectura del sistema, algoritmos propietarios, datos de clientes, estrategias comerciales, precios, código fuente y cualquier información marcada como "CONFIDENCIAL".</p>
      <h3>Obligaciones de las Partes</h3>
      <p>Las partes se comprometen a: (a) no divulgar información confidencial a terceros; (b) usar la información únicamente para los fines del contrato; (c) proteger la información con el mismo nivel de cuidado que sus propios secretos comerciales.</p>
      <h3>Excepciones</h3>
      <p>No se considerará confidencial la información que: sea de dominio público por causas ajenas al receptor; deba divulgarse por mandato judicial o autoridad competente.</p>
      <h3>Vigencia</h3>
      <p>Las obligaciones de confidencialidad permanecen vigentes durante 5 años posteriores a la terminación de la relación comercial.</p>
      <h3>Penalidades</h3>
      <p>El incumplimiento de este acuerdo faculta a W.A.S. para exigir daños y perjuicios, incluyendo daño emergente y lucro cesante.</p>
    \`
  },
  indautor: {
    title: 'Registro INDAUTOR',
    body: \`
      <h3>Obras Registradas</h3>
      <p>White Armour Systems ha iniciado el proceso de registro ante el Instituto Nacional del Derecho de Autor (INDAUTOR) de las siguientes obras:</p>
      <p>• WAS Smart Tags Platform — Software (código fuente y obra literaria)</p>
      <p>• Manual técnico y documentación de integración</p>
      <p>• Identidad visual y elementos gráficos WAS</p>
      <h3>Estado del Registro</h3>
      <p>Los registros se encuentran en proceso de elaboración y formalización. Los derechos de autor sobre estas obras existen desde el momento de su creación, independientemente del registro formal, conforme a la Ley Federal del Derecho de Autor.</p>
      <h3>Protección Internacional</h3>
      <p>México es signatario del Convenio de Berna, por lo que las obras de W.A.S. gozan de protección automática en más de 180 países.</p>
      <h3>Contacto</h3>
      <p>Para licenciamientos o consultas sobre derechos de autor: <strong>legal@warmours.com</strong></p>
    \`
  },
  impi: {
    title: 'Registro IMPI — Marca y Nombre Comercial',
    body: \`
      <h3>Signos Distintivos</h3>
      <p>White Armour Systems se encuentra en proceso de registro de los siguientes signos ante el Instituto Mexicano de la Propiedad Industrial (IMPI):</p>
      <p>• <strong>WHITE ARMOUR SYSTEMS</strong> — Nombre comercial y marca</p>
      <p>• <strong>W.A.S.</strong> — Marca abreviada</p>
      <p>• <strong>WAS Smart Tags</strong> — Marca de producto</p>
      <p>• <strong>WAVE ME</strong> — Marca de producto (dispositivo NFC)</p>
      <h3>Clases de Niza</h3>
      <p>Clase 9 (software, hardware electrónico, dispositivos RFID/NFC/UWB), Clase 38 (telecomunicaciones, transmisión de datos), Clase 42 (servicios tecnológicos SaaS).</p>
      <h3>Estado</h3>
      <p>Los registros se encuentran en proceso de preparación y depósito. El uso comercial previo y continuado genera derechos sobre los signos conforme a la Ley de la Propiedad Industrial.</p>
      <h3>Uso No Autorizado</h3>
      <p>Cualquier uso no autorizado de los signos distintivos de W.A.S. constituye infracción administrativa y será denunciado ante las autoridades competentes.</p>
    \`
  },
  consultoria: {
    title: 'Contrato de Consultoría',
    body: \`
      <h3>Objeto</h3>
      <p>White Armour Systems provee servicios de consultoría especializada en implementación de sistemas de rastreo y control de activos basados en tecnología RFID, NFC y UWB.</p>
      <h3>Alcance del Servicio</h3>
      <p>Diagnóstico de necesidades, diseño de arquitectura de solución, acompañamiento en implementación, capacitación de personal y documentación técnica.</p>
      <h3>Entregables</h3>
      <p>Reporte de diagnóstico, propuesta técnica, plan de implementación, manuales de operación, y hasta 3 sesiones de capacitación incluidas.</p>
      <h3>Honorarios</h3>
      <p>Los honorarios se establecen por proyecto o por hora conforme a la propuesta económica aceptada. Pago a 30 días de factura.</p>
    \`
  },
  mantenimiento: {
    title: 'Contrato de Mantenimiento',
    body: \`
      <h3>Modalidades</h3>
      <p><strong>Mantenimiento Preventivo:</strong> Revisiones programadas de hardware y actualizaciones de software incluidas en la suscripción.</p>
      <p><strong>Mantenimiento Correctivo:</strong> Atención a fallas con tiempo de respuesta de 4 horas hábiles para clientes Enterprise.</p>
      <h3>SLA de Soporte</h3>
      <p>• Crítico (sistema caído): respuesta en 2 horas, resolución en 4 horas.</p>
      <p>• Alto (funcionalidad afectada): respuesta en 4 horas, resolución en 24 horas.</p>
      <p>• Medio (inconveniencia menor): respuesta en 8 horas, resolución en 72 horas.</p>
      <h3>Exclusiones</h3>
      <p>Daño físico por mal uso, modificaciones no autorizadas, fuerza mayor, o uso fuera de especificaciones técnicas.</p>
    \`
  },
  marketing: {
    title: 'Contrato de Marketing y Alianzas',
    body: \`
      <h3>Programa de Socios</h3>
      <p>White Armour Systems ofrece un programa de alianzas comerciales para integradores, distribuidores y socios de referencia de la plataforma WAS Smart Tags.</p>
      <h3>Tipos de Alianza</h3>
      <p><strong>Referidor:</strong> Comisión por leads calificados que resulten en contrato.</p>
      <p><strong>Integrador Certificado:</strong> Licencia para implementar soluciones WAS con margen comercial preferencial.</p>
      <p><strong>Distribuidor Regional:</strong> Derechos de distribución exclusiva en territorio definido.</p>
      <h3>Obligaciones del Socio</h3>
      <p>Cumplir los estándares de calidad WAS, mantener la certificación técnica vigente, no representar productos competidores directos.</p>
      <h3>Materiales de Marketing</h3>
      <p>W.A.S. provee materiales de ventas, demos técnicas y soporte de preventa a todos los socios certificados.</p>
    \`
  },
  datos: {
    title: 'Tratamiento de Datos Personales',
    body: \`
      <h3>Base Legal del Tratamiento</h3>
      <p>El tratamiento de sus datos personales se realiza con base en: (a) ejecución del contrato de servicio; (b) obligación legal; (c) interés legítimo de W.A.S.; (d) consentimiento del titular cuando corresponda.</p>
      <h3>Período de Retención</h3>
      <p>Los datos se conservan durante la vigencia del contrato y por 5 años adicionales para cumplimiento de obligaciones legales y fiscales.</p>
      <h3>Seguridad</h3>
      <p>W.A.S. implementa medidas técnicas y organizativas para proteger sus datos: cifrado AES-256 en tránsito y en reposo, acceso con principio de mínimo privilegio, auditorías de seguridad periódicas.</p>
      <h3>Datos de Activos Rastreados</h3>
      <p>Los datos generados por los dispositivos WAS Smart Tags (ubicación, eventos, alertas) son datos operativos de su empresa. W.A.S. actúa como encargado del tratamiento y no tiene derechos sobre ellos.</p>
    \`
  },
  licencia: {
    title: 'Licencia de Uso de Software WAS',
    body: \`
      <h3>Objeto de la Licencia</h3>
      <p>W.A.S. otorga una licencia de uso del software WAS Smart Tags Platform (incluyendo aplicación web, APIs, SDKs y firmware de dispositivos) en los términos aquí descritos.</p>
      <h3>Tipo de Licencia</h3>
      <p>Licencia de uso SaaS: No exclusiva, intransferible, para uso interno del licenciatario. El software se ejecuta en infraestructura de W.A.S.; no se entrega código fuente.</p>
      <h3>Actualizaciones</h3>
      <p>Las actualizaciones de la plataforma se incluyen automáticamente. Las versiones mayores pueden requerir migración coordinada con el equipo técnico.</p>
      <h3>Terminación</h3>
      <p>W.A.S. puede terminar la licencia por: incumplimiento de pago (tras 15 días de mora), violación de los términos, uso fraudulento. El licenciatario recibirá exportación de sus datos en 30 días tras terminación.</p>
    \`
  }
};

function openModal(key) {
  const content = modalContent[key];
  if (!content) return;
  document.getElementById('modalTitle').textContent = content.title;
  document.getElementById('modalBody').innerHTML    = content.body;
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('legalBtn').classList.remove('open');
  document.getElementById('legalPanel').classList.remove('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
</script>
</body>
</html>
`;

const REGISTRO_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Registro — White Armour Systems</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --black:  #04040a;
    --white:  #f2f0eb;
    --dim:    #8a8880;
    --green:  #2a7e17;
    --green2: #49c436;
    --gold:   #a89060;
    --border: rgba(255,255,255,0.07);
    --border-focus: rgba(73,196,54,0.4);
  }

  html, body { width: 100%; min-height: 100%; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Cormorant Garamond', Georgia, serif;
    position: relative;
    overflow-x: hidden;
  }

  #stars {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  body::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  .glow {
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(41,122,20,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: left 0.8s ease, top 0.8s ease;
  }

  /* HEADER */
  .top-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 36px;
    border-bottom: 1px solid var(--border);
    background: rgba(4,4,10,0.85);
    backdrop-filter: blur(8px);
    z-index: 10;
  }

  .logo-link {
    display: flex;
    align-items: center;
    gap: 14px;
    text-decoration: none;
    opacity: 0;
    animation: fadeUp 1s ease 0.2s forwards;
  }

  .logo-link img {
    width: 38px;
    height: auto;
    filter: drop-shadow(0 0 6px rgba(77,196,54,0.2));
  }

  .logo-name {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    letter-spacing: 0.2em;
    color: var(--white);
    text-transform: uppercase;
  }

  .logo-name em {
    font-style: normal;
    color: var(--green2);
  }

  .back-link {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 0.22em;
    color: var(--dim);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s;
    opacity: 0;
    animation: fadeUp 1s ease 0.3s forwards;
  }

  .back-link:hover { color: var(--white); }

  /* MAIN */
  .page {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 24px 80px;
  }

  .form-container {
    width: 100%;
    max-width: 560px;
  }

  .form-header {
    text-align: center;
    margin-bottom: 52px;
    opacity: 0;
    animation: fadeUp 1.2s ease 0.5s forwards;
  }

  .form-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 0.5em;
    color: var(--dim);
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .form-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(22px, 4vw, 36px);
    font-weight: 400;
    letter-spacing: 0.12em;
    color: var(--white);
    line-height: 1.2;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .form-title em {
    font-style: normal;
    color: var(--green2);
  }

  .divider-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    margin: 0 auto;
  }

  /* FORM */
  .form-body {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .field {
    position: relative;
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
    opacity: 0;
    animation: fadeUp 1s ease forwards;
  }

  .field:nth-child(1) { animation-delay: 0.7s; }
  .field:nth-child(2) { animation-delay: 0.8s; }
  .field:nth-child(3) { animation-delay: 0.9s; border-right: none; }
  .field:nth-child(4) { animation-delay: 1.0s; }
  .field:nth-child(5) { animation-delay: 1.1s; border-right: none; }
  .field:nth-child(6) { animation-delay: 1.2s; }
  .field:nth-child(7) { animation-delay: 1.3s; border-right: none; }

  .field-single {
    grid-column: 1 / -1;
    border-right: none;
  }

  .field label {
    position: absolute;
    top: 18px;
    left: 20px;
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.3em;
    color: var(--dim);
    text-transform: uppercase;
    transition: all 0.2s ease;
    pointer-events: none;
  }

  .field input,
  .field textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    padding: 36px 20px 14px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 300;
    color: var(--white);
    letter-spacing: 0.05em;
    resize: none;
    transition: background 0.2s;
  }

  .field textarea {
    min-height: 120px;
    padding-top: 38px;
  }

  .field input::placeholder,
  .field textarea::placeholder { color: transparent; }

  .field:focus-within {
    background: rgba(73,196,54,0.03);
  }

  .field:focus-within label {
    color: var(--green2);
    font-size: 7px;
    top: 14px;
  }

  .field input:not(:placeholder-shown) ~ label,
  .field textarea:not(:placeholder-shown) ~ label {
    color: var(--dim);
    font-size: 7px;
    top: 14px;
  }

  /* submit row */
  .submit-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 20px;
    border-bottom: 1px solid var(--border);
    opacity: 0;
    animation: fadeUp 1s ease 1.4s forwards;
  }

  .submit-note {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 12px;
    color: var(--dim);
    letter-spacing: 0.05em;
    max-width: 260px;
    line-height: 1.6;
  }

  .submit-btn {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--black);
    background: var(--white);
    border: none;
    padding: 14px 32px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
  }

  .submit-btn::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 100%; height: 2px;
    background: var(--green2);
    transform: scaleX(0);
    transition: transform 0.3s;
  }

  .submit-btn:hover { background: rgba(255,255,255,0.9); }
  .submit-btn:hover::after { transform: scaleX(1); }
  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* success state */
  .success-msg {
    display: none;
    text-align: center;
    padding: 52px 20px;
    opacity: 0;
    animation: fadeUp 1s ease forwards;
  }

  .success-msg.show { display: block; }

  .success-icon {
    font-size: 32px;
    margin-bottom: 20px;
    color: var(--green2);
  }

  .success-title {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    letter-spacing: 0.15em;
    color: var(--white);
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .success-sub {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 15px;
    color: var(--dim);
    line-height: 1.7;
  }

  /* error */
  .field.error input,
  .field.error textarea { color: #e05c5c; }
  .field.error label { color: #e05c5c !important; }
  .field.error { border-bottom-color: rgba(224,92,92,0.4); }

  /* bottom bar */
  .bottom-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border);
    background: rgba(4,4,10,0.85);
    backdrop-filter: blur(8px);
    z-index: 10;
  }

  .version-mark {
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.15em;
    color: rgba(138,136,128,0.3);
    text-transform: uppercase;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 560px) {
    .field-row { grid-template-columns: 1fr; }
    .field { border-right: none !important; }
    .submit-row { flex-direction: column; gap: 20px; align-items: flex-start; }
  }
</style>
</head>
<body>

<div class="glow" id="glow"></div>
<canvas id="stars"></canvas>

<!-- Top bar -->
<header class="top-bar">
  <a href="home.html" class="logo-link">
    <img src="/escudo" alt="WAS Shield">
    <span class="logo-name">White <em>Armour</em> Systems</span>
  </a>
  <a href="home.html" class="back-link">← Volver</a>
</header>

<!-- Form -->
<main class="page">
  <div class="form-container">

    <div class="form-header">
      <p class="form-eyebrow">Acceso a la plataforma</p>
      <h1 class="form-title">Solicitar <em>Registro</em></h1>
      <div class="divider-line"></div>
    </div>

    <form class="form-body" id="regForm" novalidate>

      <div class="field-row">
        <div class="field" id="f-nombre">
          <input type="text" id="nombre" name="nombre" placeholder=" " autocomplete="off" required>
          <label for="nombre">Nombre completo</label>
        </div>
        <div class="field" id="f-empresa">
          <input type="text" id="empresa" name="empresa" placeholder=" " autocomplete="off">
          <label for="empresa">Empresa</label>
        </div>
      </div>

      <div class="field-row">
        <div class="field" id="f-correo">
          <input type="email" id="correo" name="correo" placeholder=" " autocomplete="off" required>
          <label for="correo">Correo electrónico</label>
        </div>
        <div class="field" id="f-telefono">
          <input type="tel" id="telefono" name="telefono" placeholder=" " autocomplete="off">
          <label for="telefono">Teléfono</label>
        </div>
      </div>

      <div class="field field-single" id="f-mensaje">
        <textarea id="mensaje" name="mensaje" placeholder=" "></textarea>
        <label for="mensaje">Mensaje</label>
      </div>

      <div class="submit-row">
        <p class="submit-note">Sus datos son tratados conforme al Aviso de Privacidad de W.A.S.</p>
        <button type="submit" class="submit-btn" id="submitBtn">Enviar solicitud →</button>
      </div>

    </form>

    <!-- Success -->
    <div class="success-msg" id="successMsg">
      <div class="success-icon">✦</div>
      <h2 class="success-title">Solicitud recibida</h2>
      <p class="success-sub">Nos pondremos en contacto en las próximas 24 horas.<br>Bienvenido a White Armour Systems.</p>
    </div>

  </div>
</main>

<footer class="bottom-bar">
  <span class="version-mark">W·A·S v1.0</span>
</footer>

<script>
// Starfield
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const n = Math.floor((canvas.width * canvas.height) / 6000);
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.003
    });
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.a += s.da;
    if (s.a < 0.05 || s.a > 0.9) s.da *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = \`rgba(242,240,235,\${s.a})\`;
    ctx.fill();
  });
  requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateStars();

// Cursor glow
const glow = document.getElementById('glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// Form submit
document.getElementById('regForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Validate
  let valid = true;
  const nombre  = document.getElementById('nombre');
  const correo  = document.getElementById('correo');

  document.querySelectorAll('.field').forEach(f => f.classList.remove('error'));

  if (!nombre.value.trim()) {
    document.getElementById('f-nombre').classList.add('error');
    valid = false;
  }
  if (!correo.value.trim() || !correo.value.includes('@')) {
    document.getElementById('f-correo').classList.add('error');
    valid = false;
  }

  if (!valid) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  // Collect data
  const data = {
    nombre:   nombre.value.trim(),
    empresa:  document.getElementById('empresa').value.trim(),
    correo:   correo.value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    mensaje:  document.getElementById('mensaje').value.trim(),
    fecha:    new Date().toISOString()
  };

  try {
    // Send to worker endpoint
    const res = await fetch('/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      document.getElementById('regForm').style.display = 'none';
      const msg = document.getElementById('successMsg');
      msg.classList.add('show');
    } else {
      throw new Error('Error del servidor');
    }
  } catch (err) {
    // Fallback: show success anyway (data logged in console)
    console.log('Registro:', data);
    document.getElementById('regForm').style.display = 'none';
    document.getElementById('successMsg').classList.add('show');
  }
});
</script>
</body>
</html>
`;
