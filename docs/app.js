(function () {
'use strict';

/* =========================================================
   Íconos y utilidades
   ========================================================= */
var IC = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  chart:'<path d="M5 20v-9M12 20V5M19 20v-6M3 20h18"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5c2.3.3 3.9 2 4.5 4.5"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  play:'<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
  arrow:'<path d="M7 17L17 7M8 7h9v9"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  left:'<path d="M15 6l-6 6 6 6"/>',
  right:'<path d="M9 6l6 6-6 6"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  save:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
  send:'<path d="M4 12l16-8-6 16-2.5-6.5z"/>',
  tv:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'
};
function ic(n, cls) {
  return '<svg class="' + (cls || 'i') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + '</svg>';
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function fmt(n) { return Math.round(Number(n) || 0).toLocaleString('es-MX'); }
function $(s) { return document.querySelector(s); }
function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
function isPhone() { return window.matchMedia('(max-width:720px)').matches; }

/* Fechas (hora local del dispositivo) */
var DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
var DIASL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var MESL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
function pad(n) { return String(n).padStart(2, '0'); }
function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function parse(s) { var p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2] || 1); }
function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return ymd(d); }
function monday(s) { var d = parse(s), w = d.getDay(); d.setDate(d.getDate() + (w === 0 ? -6 : 1 - w)); return ymd(d); }
function today() { return ymd(new Date()); }
function fCorta(s) { var d = parse(s); return DIAS[d.getDay()] + ' ' + d.getDate() + ' ' + MES[d.getMonth()]; }
function fLarga(s) { var d = parse(s); return DIASL[d.getDay()] + ' ' + d.getDate() + ' de ' + MESL[d.getMonth()]; }
function mesCorto(m) { var p = m.split('-'); var t = MES[Number(p[1]) - 1]; return t.charAt(0).toUpperCase() + t.slice(1); }
function mesLargo(m) { var p = m.split('-'); var t = MESL[Number(p[1]) - 1]; return t.charAt(0).toUpperCase() + t.slice(1) + ' ' + p[0]; }
function rangoSemana(lun) {
  var a = parse(lun), b = parse(addDays(lun, 6));
  return a.getMonth() === b.getMonth()
    ? 'Semana del ' + a.getDate() + ' al ' + b.getDate() + ' de ' + MESL[b.getMonth()]
    : 'Semana del ' + a.getDate() + ' de ' + MESL[a.getMonth()] + ' al ' + b.getDate() + ' de ' + MESL[b.getMonth()];
}

/* =========================================================
   Catálogos
   ========================================================= */
var CUENTAS = [
  { k: 'fbDel', pagina: 'Delegación', red: 'Facebook', ab: 'FB', re: /^https?:\/\/(www\.|m\.|web\.)?(facebook\.com|fb\.watch|fb\.com)\//i },
  { k: 'igDel', pagina: 'Delegación', red: 'Instagram', ab: 'IG', re: /^https?:\/\/(www\.)?instagram\.com\//i },
  { k: 'fbDto', pagina: 'Delegado', red: 'Facebook', ab: 'FB', re: /^https?:\/\/(www\.|m\.|web\.)?(facebook\.com|fb\.watch|fb\.com)\//i },
  { k: 'igDto', pagina: 'Delegado', red: 'Instagram', ab: 'IG', re: /^https?:\/\/(www\.)?instagram\.com\//i }
];
var TIPOS = ['Video', 'Reel', 'Arte', 'Carrusel', 'Historia', 'En vivo'];
var ROL_TXT = { admin: 'Administrador', capturista: 'Capturista', aprobador: 'Aprobador' };
var ROL_DESC = { admin: 'Acceso total', capturista: 'Sube y edita contenidos', aprobador: 'Revisa y aprueba' };
var MODS = {
  inicio: ['Inicio', 'home'], parrilla: ['Parrilla', 'calendar'], contenidos: ['Subir contenido', 'upload'],
  links: ['Links', 'link'], aprobaciones: ['Aprobaciones', 'shield'], resultados: ['Resultados', 'chart'],
  equipo: ['Equipo', 'users'], config: ['Configuración', 'gear']
};
var MODS_ROL = {
  admin: ['inicio', 'parrilla', 'contenidos', 'links', 'aprobaciones', 'resultados', 'equipo', 'config'],
  capturista: ['inicio', 'parrilla', 'contenidos', 'links'],
  aprobador: ['inicio', 'parrilla', 'aprobaciones', 'resultados']
};
var ST = { 'Publicado': 'pub', 'Programado': 'prog', 'En revisión': 'rev', 'Rechazado': 'rech', 'Borrador': 'bor' };
var PGNAME = { amb: 'Ambas páginas', del: 'Delegación', dto: 'Delegado', none: 'Sin destino' };

function st(e) { return '<span class="st ' + (ST[e] || 'bor') + '">' + esc(e) + '</span>'; }
function active(it) { return CUENTAS.filter(function (a) { return it.dest && it.dest[a.k]; }); }
function filled(it) { return active(it).filter(function (a) { return it.links && it.links[a.k]; }).length; }
function pagesOf(it) {
  var p = active(it).map(function (a) { return a.pagina; }).filter(function (x, i, arr) { return arr.indexOf(x) === i; });
  return p.length === 2 ? 'amb' : p[0] === 'Delegación' ? 'del' : p[0] === 'Delegado' ? 'dto' : 'none';
}
function nets(it) {
  var g = ['Delegación', 'Delegado'].map(function (p) {
    var a = active(it).filter(function (x) { return x.pagina === p; });
    return a.length ? p + ' ' + a.map(function (x) { return '<span class="net">' + x.ab + '</span>'; }).join(' ') : '';
  }).filter(Boolean);
  return g.join(' · ') || 'Sin destino';
}
/** "Aprobó Beto · 2026-10-22 18:40" o "Rechazó…" según quién lo revisó. */
function revision(it) {
  if (!it.revisadoPor) return '';
  return (it.estado === 'Rechazado' ? 'Rechazó ' : 'Aprobó ') + it.revisadoPor + (it.revisadoEn ? ' · ' + it.revisadoEn : '');
}
function initials(n) {
  var p = String(n || '?').trim().split(/\s+/);
  return ((p[0] || '').charAt(0) + (p[1] || '').charAt(0)).toUpperCase() || '?';
}
function linkTag(a, t) {
  return '<span class="tag ' + (t && a === t ? 'ok' : a === 0 ? 'bad' : 'warn') + '">' +
    (t ? a + ' de ' + t + (t === 1 ? ' link' : ' links') : 'Sin destino') + '</span>';
}

/* =========================================================
   Estado, servidor y avisos
   ========================================================= */
var S = {
  token: null, user: null, mod: 'inicio', seq: 0,
  week: null, day: null, sel: null, items: {},
  editItem: null, linkSel: null, res: 'all', file: null, confirmDel: null, rejecting: null
};

function guardarSesion() {
  try { localStorage.setItem('bc_token', S.token || ''); } catch (e) {}
}
function leerSesion() {
  try { return localStorage.getItem('bc_token') || null; } catch (e) { return null; }
}

/* ---------- Servidor (Apps Script) ---------- */
var API_URL = (window.BC_CONFIG && window.BC_CONFIG.API_URL) || '';
function apiLista() { return /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(API_URL); }

/**
 * Manda una acción al servidor. Va como text/plain para que sea una
 * petición "simple" y Apps Script la acepte desde GitHub Pages.
 */
function call(accion, datos) {
  if (!apiLista()) return Promise.reject(new Error('Falta configurar el servidor: pega la URL de Apps Script en config.js.'));
  var control = 'AbortController' in window ? new AbortController() : null;
  var limite = setTimeout(function () { if (control) control.abort(); }, accion === 'subirParte' || accion === 'actualizarMetricas' ? 300000 : 60000);
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ token: S.token, accion: accion, datos: datos || {} }),
    redirect: 'follow',
    signal: control ? control.signal : undefined
  }).then(function (r) {
    if (!r.ok) throw new Error('El servidor respondió con un error (' + r.status + '). Intenta de nuevo.');
    return r.json().catch(function () { throw new Error('Respuesta inválida del servidor. Revisa que la URL en config.js sea la correcta.'); });
  }, function (e) {
    throw new Error(e && e.name === 'AbortError' ? 'El servidor tardó demasiado. Intenta de nuevo.' : 'No hay conexión con el servidor. Revisa tu internet e intenta de nuevo.');
  }).then(function (j) {
    clearTimeout(limite);
    if (j.ok) return j.data;
    var msg = String(j.error || 'Ocurrió un error.');
    if (msg.indexOf('SESION:') === 0) {
      msg = msg.replace(/^SESION:\s*/, '');
      S.token = null; S.user = null; guardarSesion();
      mostrarAcceso(msg);
    }
    throw new Error(msg);
  }, function (e) { clearTimeout(limite); throw e; });
}

function toast(m) {
  var t = $('#toast'); t.textContent = m; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(function () { t.hidden = true; }, 2800);
}

function cargando(texto) {
  $('#view').innerHTML = '<div class="loading"><span class="spin" aria-hidden="true"></span>' + esc(texto || 'Cargando…') + '</div>';
}
function errorVista(e) {
  $('#view').innerHTML = '<div class="card"><div class="emptyst"><span class="round">' + ic('refresh') + '</span><b>No se pudo cargar</b><p>' + esc(e.message) +
    '</p><button class="btn ghost" id="reintentar">' + ic('refresh') + 'Reintentar</button></div></div>';
  var b = $('#reintentar'); if (b) b.onclick = function () { go(S.mod); };
}

/* Ventana emergente */
var _modalPrevio = null;
function abrirModal(titulo, html) {
  _modalPrevio = document.activeElement;
  $('#mTitle').textContent = titulo; $('#mBody').innerHTML = html; $('#modal').hidden = false;
  var f = $('#mBody input, #mBody button, #mBody iframe'); (f || $('#mClose')).focus();
}
function cerrarModal() {
  $('#modal').hidden = true; $('#mBody').innerHTML = '';
  if (_modalPrevio && _modalPrevio.focus) _modalPrevio.focus();
}

/* Menú lateral */
function abrirMenu() {
  $('#drawer').hidden = false; $('#menuBtn').setAttribute('aria-expanded', 'true');
  var c = $('#dlist [aria-current]') || $('#drawerClose'); c.focus();
}
function cerrarMenu() {
  if ($('#drawer').hidden) return;
  $('#drawer').hidden = true; $('#menuBtn').setAttribute('aria-expanded', 'false');
}

/* Copiar al portapapeles con respaldo */
function copiar(texto, area, estado) {
  function respaldo() {
    if (area) { area.focus(); area.select(); }
    if (estado) estado('Texto seleccionado: cópialo con el menú de tu teléfono.');
  }
  try {
    navigator.clipboard.writeText(texto).then(function () { toast('Copiado'); if (estado) estado('Copiado.'); }, respaldo);
  } catch (e) { respaldo(); }
}

/* =========================================================
   Gráficas (SVG con colores del tema)
   ========================================================= */
var gid = 0;
function barsSVG(vals, labels, hi, badge, tam) {
  gid++;
  var ph = isPhone(), W = tam ? tam[0] : ph ? 380 : 640, H = tam ? tam[1] : ph ? 240 : 270, x0 = 40, x1 = W - 10, y0 = 28, y1 = H - 34;
  var mx = Math.max.apply(null, vals.concat([1]));
  var paso = Math.pow(10, Math.floor(Math.log10(mx)));
  var max = Math.ceil(mx * 1.15 / paso) * paso;
  var step = (x1 - x0) / vals.length, bw = Math.min(54, step * 0.55), g = '';
  for (var k = 0; k <= 3; k++) {
    var t = max * k / 3, y = y1 - (t / max) * (y1 - y0);
    g += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y + '" y2="' + y + '" style="stroke:var(--line)" stroke-dasharray="4 5"/>' +
      '<text x="' + (x0 - 8) + '" y="' + (y + 4) + '" text-anchor="end" style="fill:var(--muted)">' + (t >= 1000 ? (t / 1000).toFixed(t % 1000 ? 1 : 0) + 'k' : Math.round(t)) + '</text>';
  }
  vals.forEach(function (v, i) {
    var h = Math.max(2, (v / max) * (y1 - y0)), x = x0 + step * i + (step - bw) / 2, y = y1 - h;
    var fill = i === hi ? 'fill:var(--vino)' : 'fill:url(#h' + gid + ')';
    g += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="' + Math.min(bw / 2, h / 2) + '" style="' + fill + '"><title>' + esc(labels[i]) + ': ' + fmt(v) + '</title></rect>';
    g += '<text x="' + (x + bw / 2) + '" y="' + (H - 10) + '" text-anchor="middle" style="fill:' + (i === hi ? 'var(--ink)' : 'var(--muted)') + ';font-weight:' + (i === hi ? 600 : 400) + '">' + esc(labels[i]) + '</text>';
    if (i === hi && badge) {
      g += '<rect x="' + (x + bw / 2 - 30) + '" y="' + (y - 28) + '" width="60" height="22" rx="11" style="fill:var(--vino-soft)"/>' +
        '<text x="' + (x + bw / 2) + '" y="' + (y - 13) + '" text-anchor="middle" style="fill:var(--vino);font-weight:700">' + esc(badge) + '</text>';
    }
  });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Interacciones por mes"><defs><pattern id="h' + gid + '" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" style="fill:var(--bar-soft)"/><line x1="0" y1="0" x2="0" y2="9" style="stroke:var(--bar-hatch)" stroke-width="4"/></pattern></defs>' + g + '</svg>';
}
function areaSVG(vals, labels) {
  var ph = isPhone(), W = ph ? 380 : 640, H = ph ? 230 : 250, x0 = 44, x1 = W - 16, y0 = 40, y1 = H - 34;
  var mx = Math.max.apply(null, vals.concat([1]));
  var paso = Math.pow(10, Math.floor(Math.log10(mx)));
  var max = Math.ceil(mx * 1.15 / paso) * paso;
  var n = vals.length;
  var X = function (i) { return n === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (n - 1); };
  var Y = function (v) { return y1 - (v / max) * (y1 - y0); };
  var g = '';
  for (var k = 0; k <= 3; k++) {
    var t = max * k / 3, y = Y(t);
    g += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y + '" y2="' + y + '" style="stroke:var(--line)" stroke-dasharray="4 5"/>' +
      '<text x="' + (x0 - 8) + '" y="' + (y + 4) + '" text-anchor="end" style="fill:var(--muted)">' + (t >= 1000 ? (t / 1000).toFixed(t % 1000 ? 1 : 0) + 'k' : Math.round(t)) + '</text>';
  }
  var pts = vals.map(function (v, i) { return [X(i), Y(v)]; });
  var d = 'M' + pts[0][0] + ',' + pts[0][1];
  for (var i = 1; i < pts.length; i++) {
    var a = pts[i - 1], b = pts[i], m = (a[0] + b[0]) / 2;
    d += ' C' + m + ',' + a[1] + ' ' + m + ',' + b[1] + ' ' + b[0] + ',' + b[1];
  }
  if (n > 1) g += '<path d="' + d + ' L' + pts[n - 1][0] + ',' + y1 + ' L' + pts[0][0] + ',' + y1 + ' Z" style="fill:var(--vino);fill-opacity:.12"/>';
  g += '<path d="' + d + '" fill="none" style="stroke:var(--vino)" stroke-width="3" stroke-linecap="round"/>';
  labels.forEach(function (l, i) {
    g += '<text x="' + X(i) + '" y="' + (H - 10) + '" text-anchor="middle" style="fill:' + (i === n - 1 ? 'var(--ink)' : 'var(--muted)') + ';font-weight:' + (i === n - 1 ? 600 : 400) + '">' + esc(l) + '</text>';
  });
  var e = pts[n - 1], bx = Math.min(Math.max(e[0] - 36, x0), x1 - 72);
  g += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="7" style="fill:var(--card);stroke:var(--vino)" stroke-width="3"/>' +
    '<rect x="' + bx + '" y="' + (e[1] - 36) + '" width="72" height="24" rx="12" style="fill:var(--vino)"/>' +
    '<text x="' + (bx + 36) + '" y="' + (e[1] - 20) + '" text-anchor="middle" style="fill:var(--on-vino);font-weight:600">' + fmt(vals[n - 1]) + '</text>';
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Evolución de interacciones">' + g + '</svg>';
}
function ringSVG(p) {
  var r = 62, c = 2 * Math.PI * r;
  return '<svg viewBox="0 0 150 150" width="150" height="150" aria-hidden="true"><circle cx="75" cy="75" r="' + r + '" fill="none" style="stroke:var(--sunk)" stroke-width="14"/>' +
    '<circle cx="75" cy="75" r="' + r + '" fill="none" style="stroke:var(--jade)" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + (c * p) + ' ' + c + '" transform="rotate(-90 75 75)"/></svg>';
}
function pct(a, b) { return b ? (a - b) / b * 100 : 0; }
function dl(a, b) {
  if (!b) return '';
  var p = pct(a, b);
  return '<span class="delta ' + (p < 0 ? 'down' : '') + '">' + (p < 0 ? '↓' : '↑') + ' ' + Math.abs(p).toFixed(1) + '%</span>';
}

/* Vista previa del archivo en Drive */
function mediaHtml(archivo, tipo, modo) {
  if (!archivo) {
    return '<div class="thumb' + (modo === 'sm' ? ' sm' : '') + '"><span class="tag kind">' + esc(tipo || 'Sin archivo') + '</span><span class="play">' + ic('play') + '</span></div>';
  }
  var esImagen = /^image\//.test(archivo.mime || '');
  if (modo === 'sm') {
    return '<button class="thumb sm" data-prev="' + esc(archivo.id) + '" data-mime="' + esc(archivo.mime || '') + '" aria-label="Ver archivo">' +
      (esImagen ? '<img alt="" src="https://drive.google.com/thumbnail?id=' + encodeURIComponent(archivo.id) + '&sz=w300">' : '<span class="play">' + ic('play') + '</span>') + '</button>';
  }
  if (esImagen) {
    return '<div class="thumb"><img alt="Vista previa" src="https://drive.google.com/thumbnail?id=' + encodeURIComponent(archivo.id) + '&sz=w800"></div>';
  }
  return '<div style="flex:1 1 220px;max-width:280px;min-width:0"><iframe class="frame" title="Vista previa del video" allow="autoplay" src="https://drive.google.com/file/d/' + encodeURIComponent(archivo.id) + '/preview"></iframe></div>';
}
function abrirPreview(id, mime) {
  var img = /^image\//.test(mime || '');
  abrirModal('Vista previa',
    (img ? '<img alt="Vista previa" style="width:100%;border-radius:16px" src="https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w1200">'
         : '<iframe class="frame" title="Vista previa del video" allow="autoplay" src="https://drive.google.com/file/d/' + encodeURIComponent(id) + '/preview"></iframe>') +
    '<a class="btn ghost" target="_blank" rel="noopener" href="https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view">Abrir en Drive</a>');
}
function bindPreviews() {
  $$('[data-prev]').forEach(function (b) { b.onclick = function () { abrirPreview(b.dataset.prev, b.dataset.mime); }; });
}

/* =========================================================
   Acceso
   ========================================================= */
function mostrarAcceso(msg) {
  $('#splash').hidden = true;
  if (typeof cerrarTV === 'function') cerrarTV();
  $('#app').hidden = true; cerrarMenu(); cerrarModal();
  $('#acceso').hidden = false; $('#fLogin').hidden = false; $('#fCambio').hidden = true;
  $('#lMsg').textContent = msg || '';
  setTimeout(function () { $('#lEmail').focus(); }, 50);
}
function mostrarCambio() {
  $('#splash').hidden = true;
  $('#app').hidden = true; $('#acceso').hidden = false; $('#fLogin').hidden = true; $('#fCambio').hidden = false;
  $('#cMsg').textContent = ''; setTimeout(function () { $('#cNueva').focus(); }, 50);
}
function entrar() {
  if (S.user.cambiar) { mostrarCambio(); return; }
  $('#splash').hidden = true; $('#acceso').hidden = true; $('#app').hidden = false;
  pintarMarco(); go('inicio');
}

$('#fLogin').addEventListener('submit', function (e) {
  e.preventDefault();
  var b = $('#lBtn'); b.disabled = true; $('#lMsg').textContent = 'Entrando…';
  call('login', { email: $('#lEmail').value, pass: $('#lPass').value }).then(function (r) {
    S.token = r.token; S.user = r.usuario; guardarSesion(); $('#lPass').value = ''; $('#lMsg').textContent = ''; entrar();
  }).catch(function (err) { $('#lMsg').textContent = err.message; }).then(function () { b.disabled = false; });
});
$('#fCambio').addEventListener('submit', function (e) {
  e.preventDefault();
  var n = $('#cNueva').value, c = $('#cConf').value;
  if (n.length < 8) { $('#cMsg').textContent = 'Debe tener al menos 8 caracteres.'; return; }
  if (n !== c) { $('#cMsg').textContent = 'Las contraseñas no coinciden.'; return; }
  var b = $('#cBtn'); b.disabled = true;
  call('cambiarPass', { nueva: n }).then(function () {
    S.user.cambiar = false; $('#cNueva').value = ''; $('#cConf').value = ''; toast('Contraseña guardada'); entrar();
  }).catch(function (err) { $('#cMsg').textContent = err.message; }).then(function () { b.disabled = false; });
});

function salir() {
  var t = S.token;
  S.token = null; S.user = null; guardarSesion();
  if (t && apiLista()) {
    fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ token: t, accion: 'logout', datos: {} }) }).catch(function () {});
  }
  mostrarAcceso('Cerraste sesión.');
}

function ventanaCuenta() {
  abrirModal('Tu cuenta',
    '<dl class="kv"><dt>Nombre</dt><dd>' + esc(S.user.nombre) + '</dd><dt>Correo</dt><dd>' + esc(S.user.email) + '</dd><dt>Rol</dt><dd>' + ROL_TXT[S.user.rol] + '</dd></dl>' +
    '<form id="fPass" class="stack" novalidate><h3>Cambiar contraseña</h3>' +
    '<div><label class="l" for="pAct">Contraseña actual</label><input type="password" id="pAct" autocomplete="current-password"></div>' +
    '<div><label class="l" for="pNue">Contraseña nueva</label><input type="password" id="pNue" autocomplete="new-password"></div>' +
    '<button class="btn" type="submit">' + ic('save') + 'Guardar</button><p class="status err" id="pMsg"></p></form>' +
    '<button class="btn ghost" id="pSalir">Cerrar sesión</button>');
  $('#fPass').onsubmit = function (e) {
    e.preventDefault();
    call('cambiarPass', { actual: $('#pAct').value, nueva: $('#pNue').value })
      .then(function () { cerrarModal(); toast('Contraseña actualizada'); })
      .catch(function (err) { $('#pMsg').textContent = err.message; });
  };
  $('#pSalir').onclick = function () { cerrarModal(); salir(); };
}

/* =========================================================
   Marco: navegación según el rol
   ========================================================= */
function pintarMarco() {
  var u = S.user, mods = MODS_ROL[u.rol];
  var botones = mods.map(function (m) {
    return '<button data-go="' + m + '"' + (S.mod === m ? ' aria-current="page"' : '') + '>' + ic(MODS[m][1]) + MODS[m][0] + '</button>';
  }).join('');
  $('#nav').innerHTML = botones; $('#dlist').innerHTML = botones;
  $('#meAv').textContent = initials(u.nombre); $('#dAv').textContent = initials(u.nombre);
  $('#meName').textContent = u.nombre; $('#dName').textContent = u.nombre;
  $('#meRole').textContent = ROL_TXT[u.rol]; $('#dRole').textContent = ROL_TXT[u.rol];
  $('#uName').textContent = u.nombre; $('#uMail').textContent = u.email || '';
  $$('#nav [data-go], #dlist [data-go]').forEach(function (b) {
    b.onclick = function () { if (b.dataset.go === 'contenidos') S.editItem = null; go(b.dataset.go); };
  });
}

function go(mod) {
  cerrarMenu(); cerrarUMenu();
  if (MODS_ROL[S.user.rol].indexOf(mod) === -1) mod = 'inicio';
  S.mod = mod; S.confirmDel = null; S.rejecting = null;
  pintarMarco();
  var seq = ++S.seq;
  var v = $('#view'); v.classList.remove('view'); void v.offsetWidth; v.classList.add('view');
  window.scrollTo(0, 0);
  cargando();
  var fn = { inicio: mInicio, parrilla: mParrilla, contenidos: mContenidos, links: mLinks, aprobaciones: mAprob, resultados: mResultados, equipo: mEquipo, config: mConfig }[mod];
  Promise.resolve().then(function () { return fn(seq); }).catch(function (e) { if (seq === S.seq && S.user) errorVista(e); });
}
function vigente(seq) { return seq === S.seq; }
function bindGo() {
  $$('#view [data-go]').forEach(function (b) {
    b.onclick = function () { if (b.dataset.go === 'contenidos') S.editItem = null; go(b.dataset.go); };
  });
}

/* =========================================================
   Módulo: Inicio
   ========================================================= */
function mInicio(seq) {
  return call('inicio').then(function (d) {
    if (!vigente(seq)) return;
    var u = S.user, k = d.kpis;
    var h = new Date().getHours(), saludo = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
    var meses = d.meses || [], ult = meses[meses.length - 1], prev = meses[meses.length - 2];
    var cta = u.rol === 'aprobador'
      ? '<button class="btn" data-go="aprobaciones">' + ic('shield') + 'Revisar pendientes</button>'
      : '<button class="btn" data-go="contenidos">' + ic('plus') + 'Subir contenido</button>';
    var hero = ult
      ? '<div class="big">' + fmt(ult.interacciones) + '</div><div class="meta">' + (prev ? dl(ult.interacciones, prev.interacciones) + ' vs ' + mesCorto(prev.mes).toLowerCase() : 'Primer mes registrado') + ' · ' + mesLargo(ult.mes) + '</div>'
      : '<div class="big">—</div><div class="meta">' + (u.rol === 'admin' ? 'Configura Meta o captura las cifras en Configuración' : 'Aún no hay métricas registradas') + '</div>';
    var exp = d.links.esperados, got = d.links.capturados;

    $('#view').innerHTML =
      '<div class="head"><div><h1>' + saludo + ', <span style="color:var(--muted)">' + esc(u.nombre.split(' ')[0]) + '</span></h1><p class="sub">' +
        fLarga(d.hoy).replace(/^./, function (c) { return c.toUpperCase(); }) + ' · ' + rangoSemana(d.semanaIni).toLowerCase() + '</p></div>' +
        '<div class="actions"><button class="btn ghost" id="btnTV">' + ic('tv') + 'Vista completa TV</button><button class="btn ghost" data-go="parrilla">' + ic('calendar') + 'Ver parrilla</button>' + cta + '</div></div>' +
      '<section class="kpis">' +
        '<div class="card kpi hero"><div class="card-h"><span class="lbl">Interacciones del mes</span>' + (u.rol !== 'capturista' ? '<button class="round" data-go="resultados" aria-label="Ver resultados">' + ic('arrow') + '</button>' : '') + '</div>' + hero + '</div>' +
        '<div class="card kpi"><div class="card-h"><span class="lbl">Publicadas esta semana</span><span class="round">' + ic('check') + '</span></div><div class="big">' + k.publicadasSemana + '</div><div class="meta">de ' + k.totalSemana + ' en la parrilla</div></div>' +
        '<div class="card kpi"><div class="card-h"><span class="lbl">En revisión</span><span class="round">' + ic('shield') + '</span></div><div class="big">' + k.enRevision + '</div><div class="meta">' + (u.rol === 'aprobador' && k.enRevision ? 'Esperan tu revisión' : 'Con una aprobación queda programado') + '</div></div>' +
        '<div class="card kpi"><div class="card-h"><span class="lbl">Programadas</span><span class="round">' + ic('clock') + '</span></div><div class="big">' + k.programadas + '</div><div class="meta">' + (k.atrasadas ? '<span class="tag warn">' + k.atrasadas + ' sin marcar como publicadas</span>' : 'Al día') + '</div></div>' +
      '</section>' +
      '<section class="row2">' +
        '<div class="card chart"><div class="card-h"><div><h2>Interacciones por mes</h2><p>Reacciones, comentarios y compartidos de las 4 cuentas</p></div></div>' +
          (meses.length ? barsSVG(meses.map(function (m) { return m.interacciones; }), meses.map(function (m) { return mesCorto(m.mes); }), meses.length - 1, prev ? (pct(ult.interacciones, prev.interacciones) >= 0 ? '+' : '') + pct(ult.interacciones, prev.interacciones).toFixed(0) + '%' : '')
            : '<div class="emptyst"><span class="round">' + ic('chart') + '</span><b>Sin métricas todavía</b><p>Se llenan el día 1 de cada mes o cuando el administrador las actualiza.</p></div>') +
        '</div>' +
        '<div class="card"><div class="card-h"><div><h2>Links capturados</h2><p>Publicaciones de los últimos 14 días</p></div>' + (u.rol !== 'aprobador' ? '<button class="round" data-go="links" aria-label="Ir a Links">' + ic('arrow') + '</button>' : '') + '</div>' +
          (exp ? '<div class="ringwrap"><div class="ring">' + ringSVG(got / exp) + '<div class="c"><div><b>' + Math.round(got / exp * 100) + '%</b><small>' + got + ' de ' + exp + ' links</small></div></div></div>' +
            '<div class="miss">' + d.links.detalle.map(function (x) { return '<div><span>' + esc(x.tema) + '</span>' + linkTag(x.tienen, x.total) + '</div>'; }).join('') + '</div></div>'
            : '<div class="emptyst"><span class="round">' + ic('link') + '</span><b>Nada publicado aún</b><p>Cuando algo se publique aparecerá aquí cuántos links faltan.</p></div>') +
        '</div>' +
      '</section>' +
      '<section class="row2">' +
        '<div class="card"><div class="card-h"><div><h2>Próximas publicaciones</h2><p>Los siguientes 7 días</p></div></div>' +
          (d.proximas.length ? '<div class="tbl"><table class="rt"><thead><tr><th>Contenido</th><th>Fecha</th><th>Dónde</th><th>Estado</th></tr></thead><tbody>' +
            d.proximas.map(function (i) {
              return '<tr><td class="first"><div class="tcell"><span class="pg ' + pagesOf(i) + '"></span><div><b>' + esc(i.tema) + '</b><small>' + esc(i.tipo) + ' · subió ' + esc(i.autorNombre) + (i.revisadoPor && i.estado !== 'Rechazado' ? ' · aprobó ' + esc(i.revisadoPor) : '') + '</small></div></div></td>' +
                '<td data-label="Fecha" style="white-space:nowrap">' + fCorta(i.fecha) + ' · ' + esc(i.hora) + '</td><td data-label="Dónde">' + nets(i) + '</td><td data-label="Estado">' + st(i.estado) + '</td></tr>';
            }).join('') + '</tbody></table></div>'
            : '<div class="emptyst"><span class="round">' + ic('calendar') + '</span><b>No hay nada programado</b><p>Lo que se suba para los próximos días aparecerá aquí.</p></div>') +
        '</div>' +
        '<div class="card"><div class="card-h"><div><h2>Actividad reciente</h2><p>Quién hizo qué</p></div></div>' +
          (d.actividad.length ? '<div class="feed">' + d.actividad.map(function (l) {
            return '<div><span class="avatar">' + initials(l.usuario) + '</span><div><p><b>' + esc(l.usuario) + '</b> · ' + esc(l.accion).toLowerCase() + (l.detalle ? ': ' + esc(l.detalle) : '') + '</p><small>' + esc(l.fecha) + '</small></div></div>';
          }).join('') + '</div>' : '<p class="meta">Sin actividad todavía.</p>') +
        '</div>' +
      '</section>';
    bindGo();
    $('#btnTV').onclick = abrirTV;
  });
}

/* =========================================================
   Vista completa TV
   ========================================================= */
var TV = { on: false, fs: false, datos: null, en: null, timer: null, reloj: null, lock: null, idle: null, error: '' };
var TV_CADA = 120000; // se actualiza cada 2 minutos

function hhmm(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }

function abrirTV() {
  cerrarMenu(); cerrarModal();
  var el = $('#tv');
  el.hidden = false; TV.on = true; TV.error = '';
  document.body.style.overflow = 'hidden';
  el.innerHTML = '<div class="loading" style="margin:auto"><span class="spin" aria-hidden="true"></span>Preparando la vista…</div>';
  try { if (el.requestFullscreen) { var p = el.requestFullscreen(); if (p && p.catch) p.catch(function () {}); } } catch (e) {}
  pedirPantallaEncendida();
  cargarTV();
  TV.timer = setInterval(cargarTV, TV_CADA);
  TV.reloj = setInterval(tickTV, 1000);
  moverTV();
}

function cerrarTV() {
  if (!TV.on) return;
  TV.on = false; TV.fs = false;
  clearInterval(TV.timer); clearInterval(TV.reloj); clearTimeout(TV.idle);
  var el = $('#tv'); el.hidden = true; el.innerHTML = ''; el.classList.remove('idle');
  document.body.style.overflow = '';
  if (document.fullscreenElement && document.exitFullscreen) { var p = document.exitFullscreen(); if (p && p.catch) p.catch(function () {}); }
  if (TV.lock) { try { TV.lock.release(); } catch (e) {} TV.lock = null; }
  var b = $('#btnTV'); if (b) b.focus();
}

function pedirPantallaEncendida() {
  try {
    if (navigator.wakeLock && document.visibilityState === 'visible') {
      navigator.wakeLock.request('screen').then(function (l) { TV.lock = l; }, function () {});
    }
  } catch (e) {}
}

/* Esconde el cursor si no se mueve el mouse */
function moverTV() {
  if (!TV.on) return;
  var el = $('#tv'); el.classList.remove('idle');
  clearTimeout(TV.idle);
  TV.idle = setTimeout(function () { if (TV.on) el.classList.add('idle'); }, 4000);
}

function cargarTV() {
  return call('tv').then(function (d) {
    if (!TV.on) return;
    TV.datos = d; TV.en = new Date(); TV.error = '';
    pintarTV();
  }).catch(function (e) {
    if (!TV.on) return;
    TV.error = e.message;
    if (TV.datos) { pintarTV(); return; }
    $('#tv').innerHTML = '<div class="emptyst" style="margin:auto"><b>No se pudo cargar</b><p>' + esc(e.message) + '</p><button class="btn" id="tvSalir">Salir</button></div>';
    $('#tvSalir').onclick = cerrarTV;
  });
}

function tickTV() {
  if (!TV.on) return;
  var ahora = new Date();
  var h = $('#tvHora'); if (h) h.textContent = hhmm(ahora);
  var f = $('#tvAct');
  if (f && TV.en) {
    var min = Math.floor((ahora - TV.en) / 60000);
    f.textContent = 'Actualizado ' + (min < 1 ? 'hace un momento' : 'hace ' + min + ' min') + ' · se actualiza cada 2 minutos';
  }
  // Al cambiar el minuto se recalcula qué sigue y qué ya debió salir.
  if (ahora.getSeconds() === 0 && TV.datos) pintarTV();
}

function pintarTV() {
  var d = TV.datos, k = d.kpis, ahora = hhmm(new Date());
  var lista = d.hoyLista || [];
  var publicadasHoy = lista.filter(function (x) { return x.estado === 'Publicado'; }).length;
  var siguiente = lista.filter(function (x) { return x.estado !== 'Publicado' && x.hora >= ahora; })[0];
  var exp = d.links.esperados, got = d.links.capturados;
  var meses = d.meses || [], ult = meses[meses.length - 1], prev = meses[meses.length - 2];
  var fecha = fLarga(d.hoy); fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  // Se pintan todas las filas; ajustarTV() esconde las que no caben y pone "y N más".
  var mas = '<p class="tv-more" hidden></p>';
  var filasHoy = lista.length ? lista.slice(0, 15).map(function (x) {
    var esSig = siguiente && x.id === siguiente.id;
    var atrasada = x.estado !== 'Publicado' && x.hora < ahora;
    var badges = [];
    if (esSig) badges.push('<span class="tag ok">Siguiente</span>');
    if (atrasada && x.estado === 'Programado') badges.push('<span class="tag warn">Ya debió salir</span>');
    if (atrasada && x.estado === 'En revisión') badges.push('<span class="tag bad">Sin aprobar</span>');
    badges.push(st(x.estado));
    return '<div class="tv-row' + (esSig ? ' next' : '') + (x.estado === 'Publicado' ? ' done' : '') + '">' +
      '<span class="h">' + esc(x.hora) + '</span>' +
      '<div style="min-width:0"><b>' + esc(x.tema) + '</b><small>' + esc(x.tipo) + ' · ' + nets(x) +
        (x.revisadoPor ? ' · aprobó ' + esc(x.revisadoPor) : '') + '</small></div>' +
      '<div class="badges">' + badges.join('') + '</div></div>';
  }).join('') + mas : '<p class="tv-empty">No hay publicaciones para hoy.</p>';

  var filasPend = d.pendientes.length ? d.pendientes.map(function (x) {
    var p = parse(x.fecha);
    return '<div class="tv-mini"><div class="d">' + p.getDate() + '<small>' + DIAS[p.getDay()] + '</small></div>' +
      '<div style="min-width:0"><b>' + esc(x.tema) + '</b><span>' + esc(x.hora) + ' · ' + esc(x.tipo) + ' · subió ' + esc(x.autorNombre) + '</span></div></div>';
  }).join('') + mas : '<p class="tv-empty">Nada pendiente. Todo está revisado.</p>';

  var filasProx = d.proximas.length ? d.proximas.map(function (x) {
    var p = parse(x.fecha);
    return '<div class="tv-mini"><div class="d">' + p.getDate() + '<small>' + DIAS[p.getDay()] + '</small></div>' +
      '<div style="min-width:0"><b>' + esc(x.tema) + '</b><span>' + esc(x.hora) + ' · ' + nets(x) + ' · ' + esc(x.estado) + '</span></div></div>';
  }).join('') + mas : '<p class="tv-empty">Sin publicaciones en los próximos 7 días.</p>';

  var ticker = (d.actividad || []).slice(0, 2).map(function (l) {
    return '<span><b>' + esc(l.usuario) + '</b> ' + esc(l.accion).toLowerCase() + (l.detalle ? ': ' + esc(l.detalle) : '') + '</span>';
  }).join('');

  $('#tv').innerHTML =
    '<header class="tv-head"><div><div class="logo">' +
      '<svg width="44" height="44" viewBox="0 0 130 130" aria-hidden="true"><path d="M62 118 C 61 98, 61 82, 63 64" fill="none" style="stroke:var(--jade)" stroke-width="8" stroke-linecap="round"/><path d="M61 72 C 30 74, 12 52, 14 22 C 44 20, 64 40, 61 72 Z" style="fill:var(--vino)"/><path d="M65 60 C 70 30, 92 12, 120 16 C 122 46, 98 66, 65 60 Z" style="fill:var(--oro)"/></svg>' +
      '<div><b>Bienestar</b> <span>Conecta</span></div></div><p class="sub">Comunicación Social · Programas para el Bienestar Tabasco</p></div>' +
      '<div class="tv-clock"><b id="tvHora">' + hhmm(new Date()) + '</b><span>' + esc(fecha) + '</span></div></header>' +

    '<section class="tv-kpis">' +
      '<div class="card kpi hero"><span class="lbl">Hoy en redes</span><div class="big">' + lista.length + '</div><div class="meta">' + publicadasHoy + (publicadasHoy === 1 ? ' publicada' : ' publicadas') + (siguiente ? ' · siguiente a las ' + esc(siguiente.hora) : '') + '</div></div>' +
      '<div class="card kpi"><span class="lbl">Por aprobar</span><div class="big"' + (d.pendientes.length ? ' style="color:var(--warn)"' : '') + '>' + k.enRevision + '</div><div class="meta">' + (k.enRevision ? 'Esperan a un aprobador' : 'Todo revisado') + '</div></div>' +
      '<div class="card kpi"><span class="lbl">Publicadas esta semana</span><div class="big">' + k.publicadasSemana + '</div><div class="meta">de ' + k.totalSemana + ' en la parrilla' + (k.atrasadas ? ' · <span class="tag warn">' + k.atrasadas + ' sin marcar</span>' : '') + '</div></div>' +
      '<div class="card kpi"><span class="lbl">Interacciones del mes</span><div class="big">' + (ult ? fmt(ult.interacciones) : '—') + '</div><div class="meta">' + (ult ? (prev ? dl(ult.interacciones, prev.interacciones) + ' vs ' + mesCorto(prev.mes).toLowerCase() : mesLargo(ult.mes)) : 'Sin métricas todavía') + '</div></div>' +
    '</section>' +

    '<section class="tv-main">' +
      '<div class="tv-col">' +
        '<div class="card grow" data-total="' + lista.length + '"><div class="card-h"><h2>Hoy · ' + esc(fecha) + '</h2><span class="tag">' + lista.length + '</span></div><div class="tv-list">' + filasHoy + '</div></div>' +
      '</div>' +
      '<div class="tv-col">' +
        '<div class="card keep" data-total="' + k.enRevision + '"><div class="card-h"><h2>Por aprobar</h2><span class="tag ' + (d.pendientes.length ? 'warn' : 'ok') + '">' + k.enRevision + '</span></div>' + filasPend + '</div>' +
        '<div class="card grow" data-total="' + d.proximas.length + '"><div class="card-h"><h2>Próximos días</h2></div>' + filasProx + '</div>' +
      '</div>' +
      '<div class="tv-col">' +
        '<div class="card chart grow"><div class="card-h"><h2>Interacciones por mes</h2><span class="meta">4 cuentas</span></div>' +
          (meses.length ? barsSVG(meses.map(function (m) { return m.interacciones; }), meses.map(function (m) { return mesCorto(m.mes); }), meses.length - 1, prev ? (pct(ult.interacciones, prev.interacciones) >= 0 ? '+' : '') + pct(ult.interacciones, prev.interacciones).toFixed(0) + '%' : '', [400, 280]) : '<p class="tv-empty">Las métricas aparecen el día 1 de cada mes.</p>') +
        '</div>' +
        '<div class="card"><div class="card-h"><h2>Links capturados</h2><span class="meta">últimos 14 días</span></div>' +
          (exp ? '<div class="ringwrap"><div class="ring">' + ringSVG(got / exp) + '<div class="c"><div><b>' + Math.round(got / exp * 100) + '%</b><small>' + got + ' de ' + exp + '</small></div></div></div>' +
            '<div class="miss">' + d.links.detalle.slice(0, 3).map(function (x) { return '<div><span>' + esc(x.tema) + '</span>' + linkTag(x.tienen, x.total) + '</div>'; }).join('') + '</div></div>'
            : '<p class="tv-empty">Aún no hay publicaciones con links por capturar.</p>') + '</div>' +
      '</div>' +
    '</section>' +

    '<footer class="tv-foot"><div class="tv-ticker">' + ticker + '</div>' +
      '<div class="tv-exit"><span id="tvAct">' + (TV.error ? 'Sin conexión: se muestran los últimos datos' : 'Actualizado hace un momento · se actualiza cada 2 minutos') + '</span>' +
      '<button class="btn ghost sm" id="tvRec" aria-label="Actualizar ahora">' + ic('refresh') + '</button>' +
      '<button class="btn sm" id="tvSalir">' + ic('x') + 'Salir</button></div></footer>';

  $('#tvSalir').onclick = cerrarTV;
  $('#tvRec').onclick = function () { cargarTV(); };
  tickTV();
  requestAnimationFrame(ajustarTV);
}

/** En pantallas anchas todo debe caber: esconde las últimas filas que no entran y dice cuántas faltan. */
function ajustarTV() {
  if (!TV.on) return;
  $$('#tv [data-total]').forEach(function (card) {
    var filas = Array.prototype.slice.call(card.querySelectorAll('.tv-row, .tv-mini'));
    var masEl = card.querySelector('.tv-more');
    filas.forEach(function (f) { f.hidden = false; });
    if (masEl) masEl.hidden = true;
    var total = Number(card.dataset.total) || filas.length;
    var visibles = filas.length;
    var actualizar = function () {
      if (!masEl) return;
      var faltan = total - visibles;
      masEl.hidden = faltan <= 0;
      masEl.textContent = 'y ' + faltan + ' más';
    };
    actualizar();
    if (getComputedStyle(card).overflow !== 'hidden') return; // celular: se desliza, no se recorta
    while (visibles > 1 && card.scrollHeight > card.clientHeight + 1) {
      filas[visibles - 1].hidden = true; visibles--; actualizar();
    }
  });
}
window.addEventListener('resize', function () { if (TV.on) requestAnimationFrame(ajustarTV); });

$('#tv').addEventListener('mousemove', moverTV);
$('#tv').addEventListener('touchstart', moverTV, { passive: true });
document.addEventListener('fullscreenchange', function () {
  if (document.fullscreenElement) TV.fs = true;
  else if (TV.on && TV.fs) cerrarTV(); // salió de pantalla completa con Esc o el botón del navegador
});
document.addEventListener('visibilitychange', function () {
  if (TV.on && document.visibilityState === 'visible') { pedirPantallaEncendida(); cargarTV(); }
});

/* =========================================================
   Módulo: Parrilla
   ========================================================= */
function puedeEditar(it) { return S.user.rol === 'admin' || (S.user.rol === 'capturista' && it.autorId === S.user.id); }

function mParrilla(seq) {
  if (!S.week) S.week = monday(today());
  if (S.day === null) { var di = Math.round((parse(today()) - parse(S.week)) / 864e5); S.day = di >= 0 && di < 7 ? di : 0; }
  return call('contenidos', { desde: S.week, hasta: addDays(S.week, 6) }).then(function (lista) {
    if (!vigente(seq)) return;
    S.items = {}; lista.forEach(function (x) { S.items[x.id] = x; });
    pintarParrilla(lista);
  });
}

function pintarParrilla(lista) {
  var u = S.user, hoy = today();
  var porDia = [0, 1, 2, 3, 4, 5, 6].map(function (i) {
    var f = addDays(S.week, i);
    return { f: f, items: lista.filter(function (x) { return x.fecha === f; }) };
  });
  var sel = S.items[S.sel];
  if (!sel) { sel = (porDia[S.day].items[0]) || lista[0] || null; S.sel = sel ? sel.id : null; }

  var semana = porDia.map(function (d, i) {
    var esHoy = d.f === hoy, pd = parse(d.f);
    return '<div class="day' + (esHoy ? ' today' : '') + (i === S.day ? ' on' : '') + '"><div class="day-h"><b>' + pd.getDate() + '</b><span>' + DIAS[pd.getDay()] + (esHoy ? ' · hoy' : '') + '</span></div>' +
      (d.items.length ? d.items.map(function (x) {
        return '<button class="ev" data-sel="' + x.id + '" aria-pressed="' + (sel && x.id === sel.id) + '"><span class="h"><span class="pg ' + pagesOf(x) + '"></span>' + esc(x.hora) + ' · ' + esc(x.tipo) + '</span><span class="t">' + esc(x.tema) + '</span>' + st(x.estado) + '</button>';
      }).join('') : '<span class="empty-day">Sin publicaciones</span>') + '</div>';
  }).join('');
  var picker = porDia.map(function (d, i) {
    var pd = parse(d.f);
    return '<button data-day="' + i + '" aria-pressed="' + (i === S.day) + '"><small>' + (d.f === hoy ? 'Hoy' : DIAS[pd.getDay()]) + '</small><b>' + pd.getDate() + '</b>' + (d.items.length ? '<span class="n"></span>' : '') + '</button>';
  }).join('');

  var detalle = '<div class="emptyst"><span class="round">' + ic('calendar') + '</span><b>Semana sin publicaciones</b>' +
    (u.rol !== 'aprobador' ? '<p>Sube el primer contenido de la semana.</p><button class="btn" data-go="contenidos">' + ic('plus') + 'Subir contenido</button>' : '<p>Cuando el equipo suba contenidos aparecerán aquí.</p>') + '</div>';
  if (sel) {
    var acts = [];
    if (S.confirmDel === sel.id) {
      acts = ['<div class="inline-confirm">¿Eliminar este contenido? El archivo se manda a la papelera de Drive. <button class="btn sm" id="delSi">Sí, eliminar</button><button class="btn sm ghost" id="delNo">Cancelar</button></div>'];
    } else {
      if (u.rol !== 'aprobador' && puedeEditar(sel) && sel.estado !== 'Publicado') acts.push('<button class="btn sm" id="bEdit">' + ic('edit') + 'Editar</button>');
      if (u.rol !== 'aprobador' && puedeEditar(sel)) acts.push('<button class="btn sm ghost" id="bDel">' + ic('trash') + 'Eliminar</button>');
      if (u.rol !== 'aprobador' && sel.estado === 'Programado') acts.push('<button class="btn sm ghost" id="bPub">' + ic('check') + 'Marcar publicado</button>');
      if (u.rol !== 'aprobador' && (sel.estado === 'Programado' || sel.estado === 'Publicado') && sel.fecha <= hoy) acts.push('<button class="btn sm dark" id="bLinks">' + ic('link') + 'Capturar links</button>');
      if (sel.estado === 'En revisión' && u.rol !== 'capturista') acts.push('<button class="btn sm dark" data-go="aprobaciones">' + ic('shield') + 'Ir a aprobar</button>');
      if (u.rol === 'capturista' && !puedeEditar(sel)) acts.push('<span class="meta">Solo puedes editar lo que tú subiste.</span>');
    }
    detalle = '<div class="detail">' + mediaHtml(sel.archivo, sel.tipo) +
      '<div class="info"><div>' + st(sel.estado) + '</div><h2>' + esc(sel.tema) + '</h2>' +
      '<dl class="kv"><dt>Fecha</dt><dd>' + fLarga(sel.fecha) + ' · ' + esc(sel.hora) + '</dd><dt>Dónde</dt><dd>' + nets(sel) + '</dd><dt>Subió</dt><dd>' + esc(sel.autorNombre) + '</dd><dt>Revisión</dt><dd>' + (sel.revisadoPor ? esc(revision(sel)) : sel.estado === 'En revisión' ? 'Esperando a un aprobador' : '—') + '</dd>' +
      (sel.archivo ? '<dt>Archivo</dt><dd><a target="_blank" rel="noopener" href="https://drive.google.com/file/d/' + encodeURIComponent(sel.archivo.id) + '/view">' + esc(sel.archivo.nombre || 'Abrir en Drive') + '</a></dd>' : '') + '</dl>' +
      (sel.estado === 'Rechazado' && sel.motivo ? '<div class="note"><b>Motivo del rechazo:</b> ' + esc(sel.motivo) + '</div>' : '') +
      (sel.copy ? '<div><span class="l">Texto de la publicación</span><div class="copytext">' + esc(sel.copy) + '</div></div>' : '') +
      '<div class="actions">' + acts.join('') + '</div></div></div>';
  }

  $('#view').innerHTML =
    '<div class="head"><div><h1>Parrilla</h1><p class="sub">' + rangoSemana(S.week) + '</p></div>' +
      '<div class="actions"><div class="weeknav"><button class="iconbtn" id="wPrev" aria-label="Semana anterior">' + ic('left') + '</button><button class="btn ghost sm" id="wHoy">Hoy</button><button class="iconbtn" id="wNext" aria-label="Semana siguiente">' + ic('right') + '</button></div>' +
      (u.rol !== 'aprobador' ? '<button class="btn" data-go="contenidos">' + ic('plus') + 'Nuevo</button>' : '') + '</div></div>' +
    '<div class="legend"><span><span class="pg del"></span>Delegación</span><span><span class="pg dto"></span>Delegado</span><span><span class="pg amb"></span>Ambas</span></div>' +
    '<section class="row2 wide"><div class="card"><div class="daypick" role="group" aria-label="Día">' + picker + '</div><div class="week">' + semana + '</div></div>' +
    '<div class="card" id="detalle">' + detalle + '</div></section>';

  bindGo();
  $('#wPrev').onclick = function () { S.week = addDays(S.week, -7); S.sel = null; go('parrilla'); };
  $('#wNext').onclick = function () { S.week = addDays(S.week, 7); S.sel = null; go('parrilla'); };
  $('#wHoy').onclick = function () { S.week = monday(today()); S.day = null; S.sel = null; go('parrilla'); };
  $$('[data-sel]').forEach(function (b) {
    b.onclick = function () {
      S.sel = b.dataset.sel; S.confirmDel = null;
      var it = S.items[S.sel]; S.day = Math.round((parse(it.fecha) - parse(S.week)) / 864e5);
      pintarParrilla(lista);
      if (isPhone()) { var dd = $('#detalle'); if (dd) dd.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    };
  });
  $$('[data-day]').forEach(function (b) {
    b.onclick = function () { S.day = Number(b.dataset.day); var f = porDia[S.day].items[0]; S.sel = f ? f.id : S.sel; pintarParrilla(lista); };
  });
  if (!sel) return;
  var on = function (id, fn) { var e = $('#' + id); if (e) e.onclick = fn; };
  on('bEdit', function () { S.editItem = sel; go('contenidos'); });
  on('bDel', function () { S.confirmDel = sel.id; pintarParrilla(lista); });
  on('delNo', function () { S.confirmDel = null; pintarParrilla(lista); });
  on('delSi', function () {
    this.disabled = true;
    call('eliminarContenido', { id: sel.id }).then(function () { toast('Contenido eliminado'); S.sel = null; S.confirmDel = null; go('parrilla'); })
      .catch(function (e) { toast(e.message); S.confirmDel = null; pintarParrilla(lista); });
  });
  on('bPub', function () {
    this.disabled = true;
    call('marcarPublicado', { id: sel.id }).then(function () { toast('Marcado como publicado'); go('parrilla'); }).catch(function (e) { toast(e.message); });
  });
  on('bLinks', function () { S.linkSel = sel.id; go('links'); });
}

/* =========================================================
   Módulo: Subir / editar contenido
   ========================================================= */
function destToggles(dest, prefijo) {
  return '<div class="toggles">' + ['Delegación', 'Delegado'].map(function (p) {
    return '<div class="tgroup"><b><span class="pg ' + (p === 'Delegación' ? 'del' : 'dto') + '"></span>' + p + '</b><div class="chips">' +
      CUENTAS.filter(function (a) { return a.pagina === p; }).map(function (a) {
        return '<label class="chk"><input type="checkbox" id="' + prefijo + '-' + a.k + '" data-dest="' + a.k + '"' + (dest && dest[a.k] ? ' checked' : '') + '>' + a.red + '</label>';
      }).join('') + '</div></div>';
  }).join('') + '</div>';
}
function leerDest(prefijo) {
  var d = {}; CUENTAS.forEach(function (a) { var c = $('#' + prefijo + '-' + a.k); d[a.k] = !!(c && c.checked); }); return d;
}

function aBase64(blob) {
  return new Promise(function (res, rej) {
    var r = new FileReader();
    r.onload = function () { res(String(r.result).split(',')[1] || ''); };
    r.onerror = function () { rej(new Error('No se pudo leer el archivo.')); };
    r.readAsDataURL(blob);
  });
}
/** Sube un archivo a Drive en partes; informa el avance con onAvance(0..1). */
function subirArchivo(file, onAvance) {
  return call('iniciarSubida', { nombre: file.name, mime: file.type, tamano: file.size }).then(function (r) {
    var inicio = 0;
    function siguiente(intentos) {
      var pedazo = file.slice(inicio, inicio + r.parte);
      return aBase64(pedazo).then(function (b64) {
        return call('subirParte', { subidaId: r.subidaId, datos: b64, inicio: inicio });
      }).then(function (res) {
        inicio += pedazo.size; onAvance(inicio / file.size);
        if (res.listo) return res.archivo;
        return siguiente(0);
      }, function (err) {
        if (intentos < 2) return new Promise(function (ok) { setTimeout(ok, 1500); }).then(function () { return siguiente(intentos + 1); });
        throw err;
      });
    }
    return siguiente(0);
  });
}

function mContenidos() {
  var it = S.editItem, u = S.user;
  var dest = it ? it.dest : {};
  $('#view').innerHTML =
    '<div class="head"><div><h1>' + (it ? 'Editar contenido' : 'Subir contenido') + '</h1><p class="sub">' +
      (it ? 'Al guardar vuelve a revisión y un aprobador lo revisa de nuevo.' : 'Se avisa por correo a los aprobadores; con que uno lo apruebe queda programado.') + '</p></div>' +
      (it ? '<button class="btn ghost" id="cancelEdit">Cancelar edición</button>' : '') + '</div>' +
    '<form class="row2 even" id="upForm" novalidate>' +
      '<div class="card"><h2>Datos de la publicación</h2><div class="form">' +
        '<div class="full"><label class="l" for="f-tema">Tema</label><input type="text" id="f-tema" maxlength="200" value="' + esc(it ? it.tema : '') + '" placeholder="Ej. Entrega de la Pensión Adultos Mayores en Teapa"></div>' +
        '<div><label class="l" for="f-tipo">Formato</label><select id="f-tipo">' + TIPOS.map(function (t) { return '<option' + (it && it.tipo === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></div>' +
        '<div><label class="l" for="f-fecha">Fecha</label><input type="date" id="f-fecha" value="' + esc(it ? it.fecha : today()) + '"></div>' +
        '<div><label class="l" for="f-hora">Hora</label><input type="time" id="f-hora" value="' + esc(it ? it.hora : '10:00') + '"></div>' +
        '<div><label class="l" for="f-autor">Subido por</label><input type="text" id="f-autor" value="' + esc(it ? it.autorNombre : u.nombre) + '" disabled></div>' +
        '<div class="full"><span class="l">¿Dónde se va a publicar?</span>' + destToggles(dest, 'f') + '</div>' +
        '<div class="full"><label class="l" for="f-copy">Texto de la publicación</label><textarea id="f-copy" placeholder="Texto que acompaña al video o imagen">' + esc(it ? it.copy : '') + '</textarea></div>' +
      '</div></div>' +
      '<div class="card"><h2>Video o imagen</h2>' +
        (it && it.archivo ? '<p class="meta">Archivo actual: <a target="_blank" rel="noopener" href="https://drive.google.com/file/d/' + encodeURIComponent(it.archivo.id) + '/view">' + esc(it.archivo.nombre) + '</a>. Elige otro solo si quieres reemplazarlo.</p>' : '') +
        '<label class="drop" for="f-file" id="drop"><span class="round">' + ic('upload') + '</span><b style="color:var(--ink)">Toca o arrastra el archivo aquí</b><span>Video o imagen de hasta 1 GB. Se guarda en Drive, en la carpeta del mes.</span><input type="file" id="f-file" accept="video/*,image/*"></label>' +
        '<div class="preview" id="f-prev"></div>' +
        '<div id="f-bar" hidden><div class="bar"><i id="f-bari"></i></div><p class="meta" id="f-bart">Subiendo…</p></div>' +
        '<p class="status err" id="f-status" aria-live="polite"></p>' +
        '<div class="actions"><button class="btn" type="submit" id="f-send">' + ic('send') + (it ? 'Guardar y enviar a revisión' : 'Enviar a revisión') + '</button>' +
        '<button class="btn ghost" type="button" id="f-draft">Guardar borrador</button></div>' +
      '</div>' +
    '</form>';

  S.file = null;
  var fi = $('#f-file'), drop = $('#drop');
  function elegir(file) {
    var pv = $('#f-prev'); pv.innerHTML = '';
    if (!file) return;
    if (!/^(video|image)\//.test(file.type)) { $('#f-status').textContent = 'Solo se pueden subir videos o imágenes.'; return; }
    if (file.size > 1024 * 1024 * 1024) { $('#f-status').textContent = 'El archivo pesa más de 1 GB.'; return; }
    $('#f-status').textContent = '';
    S.file = file;
    var url = URL.createObjectURL(file);
    var el = document.createElement(file.type.indexOf('video') === 0 ? 'video' : 'img');
    el.src = url; if (el.tagName === 'VIDEO') { el.controls = true; el.playsInline = true; } else el.alt = 'Vista previa';
    pv.appendChild(el);
    var cap = document.createElement('p'); cap.className = 'meta'; cap.textContent = file.name + ' · ' + (file.size / 1048576).toFixed(1) + ' MB'; pv.appendChild(cap);
  }
  fi.onchange = function () { elegir(fi.files[0]); };
  drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', function () { drop.classList.remove('over'); });
  drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('over'); elegir(e.dataTransfer.files[0]); });

  function enviar(borrador) {
    var msg = $('#f-status');
    var datos = {
      id: it ? it.id : null, tema: $('#f-tema').value.trim(), tipo: $('#f-tipo').value,
      fecha: $('#f-fecha').value, hora: $('#f-hora').value, dest: leerDest('f'), copy: $('#f-copy').value, borrador: borrador,
      archivo: it && it.archivo ? it.archivo : null
    };
    if (!datos.tema) { msg.textContent = 'Escribe el tema de la publicación.'; $('#f-tema').focus(); return; }
    if (!datos.fecha) { msg.textContent = 'Elige la fecha.'; return; }
    if (!datos.hora) { msg.textContent = 'Elige la hora.'; return; }
    if (!CUENTAS.some(function (a) { return datos.dest[a.k]; })) { msg.textContent = 'Marca al menos una página y red.'; return; }
    msg.textContent = '';
    var botones = [$('#f-send'), $('#f-draft')]; botones.forEach(function (b) { b.disabled = true; });
    var paso = Promise.resolve();
    if (S.file) {
      $('#f-bar').hidden = false;
      paso = subirArchivo(S.file, function (p) {
        $('#f-bari').style.width = Math.round(p * 100) + '%';
        $('#f-bart').textContent = 'Subiendo… ' + Math.round(p * 100) + '%';
      }).then(function (archivo) { datos.archivo = archivo; $('#f-bart').textContent = 'Archivo subido. Guardando…'; });
    }
    paso.then(function () { return call('guardarContenido', datos); }).then(function (c) {
      toast(borrador ? 'Borrador guardado' : 'Enviado a revisión');
      S.editItem = null; S.file = null; S.week = monday(c.fecha); S.sel = c.id;
      S.day = Math.round((parse(c.fecha) - parse(S.week)) / 864e5);
      go('parrilla');
    }).catch(function (e) {
      msg.textContent = e.message; botones.forEach(function (b) { b.disabled = false; });
    });
  }
  $('#upForm').onsubmit = function (e) { e.preventDefault(); enviar(false); };
  $('#f-draft').onclick = function () { enviar(true); };
  var ce = $('#cancelEdit'); if (ce) ce.onclick = function () { S.editItem = null; go('parrilla'); };
  return Promise.resolve();
}

/* =========================================================
   Módulo: Links y mensaje
   ========================================================= */
function mLinks(seq) {
  return call('publicadas').then(function (lista) {
    if (!vigente(seq)) return;
    pintarLinks(lista);
  });
}
function pintarLinks(lista) {
  if (!lista.length) {
    $('#view').innerHTML = '<div class="head"><div><h1>Links y mensaje</h1></div></div><div class="card"><div class="emptyst"><span class="round">' + ic('link') + '</span><b>No hay publicaciones recientes</b><p>Aquí aparecen los contenidos programados o publicados de los últimos 45 días cuya fecha ya llegó.</p></div></div>';
    return;
  }
  var it = lista.filter(function (x) { return x.id === S.linkSel; })[0] || lista[0];
  S.linkSel = it.id;
  var items = lista.map(function (p) {
    return '<button class="pitem" data-lsel="' + p.id + '" aria-current="' + (p.id === it.id) + '"><small>' + fCorta(p.fecha) + ' · ' + esc(p.hora) + ' · ' + PGNAME[pagesOf(p)] + '</small><b>' + esc(p.tema) + '</b><span class="row">' + linkTag(filled(p), active(p).length) + (p.estado === 'Programado' ? '<span class="tag">Programado</span>' : '') + '</span></button>';
  }).join('');

  $('#view').innerHTML =
    '<div class="head"><div><h1>Links y mensaje</h1><p class="sub">Marca dónde se publicó, pega los links y genera el mensaje con el tema y los links.</p></div></div>' +
    '<section class="row2 side"><div class="card"><div class="card-h"><h2>Publicaciones</h2><span class="tag">' + lista.length + '</span></div><div class="plist">' + items + '</div></div>' +
    '<div class="card" id="lform"><div><p class="meta">' + fLarga(it.fecha) + ' · ' + esc(it.hora) + ' · ' + esc(it.tipo) + '</p><h2 style="font-size:22px;margin-top:4px">' + esc(it.tema) + '</h2></div>' +
      '<div><span class="l">¿Dónde se publicó?</span>' + destToggles(it.dest, 'ld') + '</div>' +
      '<div class="linkgrid" id="lkgrid"></div>' +
      '<div class="actions"><button class="btn ghost" id="lSave">' + ic('save') + 'Guardar links</button><button class="btn" id="genAI">' + ic('spark') + 'Generar mensaje con IA</button><button class="btn ghost" id="genPlain">Armar sin IA</button></div>' +
      '<p class="status" id="lstatus" aria-live="polite"></p>' +
      '<div><label class="l" for="msg">Mensaje</label><textarea id="msg" class="msgbox" spellcheck="false" placeholder="Aquí aparece el mensaje con el tema y los links">' + esc(it.mensaje || '') + '</textarea></div>' +
      '<div class="actions"><button class="btn dark" id="copy">' + ic('copy') + 'Copiar mensaje</button></div>' +
    '</div></section>';

  var trabajo = { dest: Object.assign({}, it.dest), links: Object.assign({}, it.links) };
  function estado(m) { $('#lstatus').textContent = m; }
  function campos() {
    var acts = CUENTAS.filter(function (a) { return trabajo.dest[a.k]; });
    $('#lkgrid').innerHTML = acts.length ? acts.map(function (a) {
      return '<div><label class="l" for="lk-' + a.k + '"><span class="pg ' + (a.pagina === 'Delegación' ? 'del' : 'dto') + '"></span> ' + a.pagina + ' · ' + a.red + '</label>' +
        '<input type="url" id="lk-' + a.k + '" data-lk="' + a.k + '" value="' + esc(trabajo.links[a.k] || '') + '" placeholder="Pega el link de ' + a.red + '" inputmode="url"><div class="hint" id="h-' + a.k + '"></div></div>';
    }).join('') : '<p class="meta">Marca arriba en qué página y red se publicó.</p>';
    acts.forEach(function (a) {
      var i = $('#lk-' + a.k);
      var revisar = function () {
        var v = i.value.trim(), h = $('#h-' + a.k); trabajo.links[a.k] = v;
        if (!v) { h.className = 'hint'; h.textContent = 'Falta este link'; }
        else if (a.re.test(v)) { h.className = 'hint ok'; h.textContent = 'Link válido de ' + a.red; }
        else { h.className = 'hint bad'; h.textContent = 'No parece un link de ' + a.red; }
      };
      i.oninput = revisar; revisar();
    });
  }
  campos();
  CUENTAS.forEach(function (a) {
    var c = $('#ld-' + a.k); c.onchange = function () { trabajo.dest[a.k] = c.checked; campos(); };
  });

  function guardar() {
    var malos = CUENTAS.filter(function (a) { return trabajo.dest[a.k] && trabajo.links[a.k] && !a.re.test(trabajo.links[a.k]); });
    if (malos.length) return Promise.reject(new Error('Revisa el link de ' + malos[0].red + ' ' + malos[0].pagina + '.'));
    return call('guardarLinks', { id: it.id, dest: trabajo.dest, links: trabajo.links }).then(function (c) {
      lista = lista.map(function (x) { return x.id === c.id ? c : x; });
      var tag = document.querySelector('[data-lsel="' + c.id + '"] .tag');
      if (tag) tag.outerHTML = linkTag(filled(c), active(c).length);
      return c;
    });
  }
  function generar(conIA) {
    var b1 = $('#genAI'), b2 = $('#genPlain'); b1.disabled = b2.disabled = true;
    estado(conIA ? 'Guardando links y generando con IA…' : 'Guardando links…');
    guardar().then(function () { return call('generarMensaje', { id: it.id, conIA: conIA }); }).then(function (r) {
      $('#msg').value = r.mensaje;
      estado(r.ia ? 'Mensaje generado con IA. Revísalo antes de enviarlo.' : (r.aviso || 'Mensaje armado.'));
    }).catch(function (e) { estado(e.message); }).then(function () { b1.disabled = b2.disabled = false; });
  }
  $('#lSave').onclick = function () {
    var b = this; b.disabled = true; estado('Guardando…');
    guardar().then(function () { estado('Links guardados.'); toast('Links guardados'); }).catch(function (e) { estado(e.message); }).then(function () { b.disabled = false; });
  };
  $('#genAI').onclick = function () { generar(true); };
  $('#genPlain').onclick = function () { generar(false); };
  $('#copy').onclick = function () {
    var ta = $('#msg'); if (!ta.value) { estado('Primero genera el mensaje.'); return; }
    copiar(ta.value, ta, estado);
  };
  $$('[data-lsel]').forEach(function (b) {
    b.onclick = function () {
      S.linkSel = b.dataset.lsel; pintarLinks(lista);
      if (isPhone()) { var f = $('#lform'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    };
  });
}

/* =========================================================
   Módulo: Aprobaciones
   ========================================================= */
function mAprob(seq) {
  return call('pendientes').then(function (d) {
    if (!vigente(seq)) return;
    pintarAprob(d);
  });
}
function pintarAprob(d) {
  var tarjetas = d.pendientes.map(function (it) {
    var acts;
    if (S.rejecting === it.id) {
      acts = '<div class="stack"><div><label class="l" for="rj-' + it.id + '">Qué hay que corregir</label><textarea id="rj-' + it.id + '" placeholder="Ej. Falta subtitular el video"></textarea></div>' +
        '<div class="actions"><button class="btn sm" data-rjsend="' + it.id + '">Enviar rechazo</button><button class="btn sm ghost" data-rjcancel="1">Cancelar</button></div><p class="status err" id="rjs-' + it.id + '"></p></div>';
    } else {
      acts = '<div class="actions"><button class="btn sm" data-ok="' + it.id + '">' + ic('check') + 'Aprobar</button><button class="btn sm ghost" data-reject="' + it.id + '">' + ic('x') + 'Rechazar</button></div>';
    }
    return '<div class="card acard">' + mediaHtml(it.archivo, it.tipo, 'sm') +
      '<div class="info"><div class="meta">' + fCorta(it.fecha) + ' · ' + esc(it.hora) + ' · ' + esc(it.tipo) + ' · subió ' + esc(it.autorNombre) + '</div><h2>' + esc(it.tema) + '</h2><div class="meta">' + nets(it) + '</div>' +
      (it.copy ? '<div class="copytext">' + esc(it.copy) + '</div>' : '') + acts + '</div></div>';
  }).join('') || '<div class="card"><div class="emptyst"><span class="round">' + ic('shield') + '</span><b>Todo revisado</b><p>No hay contenidos esperando aprobación.</p></div></div>';

  $('#view').innerHTML =
    '<div class="head"><div><h1>Aprobaciones</h1><p class="sub">Con que un aprobador lo apruebe queda programado. Si lo rechaza, regresa a quien lo subió con el motivo.</p></div><span class="tag ' + (d.pendientes.length ? 'warn' : 'ok') + '">' + d.pendientes.length + ' pendientes</span></div>' +
    '<section class="row2"><div class="alist">' + tarjetas + '</div>' +
    '<div class="card"><h2>Revisados recientemente</h2>' + (d.recientes.length ? '<div class="feed">' + d.recientes.map(function (i) {
      return '<div><span class="avatar">' + initials(i.revisadoPor) + '</span><div><p>' + esc(i.tema) + '</p><small style="display:block"><b>' + (i.estado === 'Rechazado' ? 'Rechazó ' : 'Aprobó ') + esc(i.revisadoPor) + '</b> · ' + esc(i.revisadoEn) + '</small>' +
        (i.estado === 'Rechazado' && i.motivo ? '<small style="display:block">Motivo: ' + esc(i.motivo) + '</small>' : '') + '<small>' + st(i.estado) + '</small></div></div>';
    }).join('') + '</div>' : '<p class="meta">Aún no hay contenidos revisados.</p>') + '</div></section>';

  bindPreviews();
  var recargar = function () { go('aprobaciones'); };
  $$('[data-ok]').forEach(function (b) {
    b.onclick = function () {
      b.disabled = true;
      call('aprobar', { id: b.dataset.ok }).then(function () { toast('Aprobado y programado'); recargar(); })
        .catch(function (e) { toast(e.message); recargar(); });
    };
  });
  $$('[data-reject]').forEach(function (b) {
    b.onclick = function () { S.rejecting = b.dataset.reject; pintarAprob(d); var t = $('#rj-' + S.rejecting); if (t) t.focus(); };
  });
  $$('[data-rjcancel]').forEach(function (b) { b.onclick = function () { S.rejecting = null; pintarAprob(d); }; });
  $$('[data-rjsend]').forEach(function (b) {
    b.onclick = function () {
      var id = b.dataset.rjsend, m = $('#rj-' + id).value.trim();
      if (!m) { $('#rjs-' + id).textContent = 'Escribe qué hay que corregir.'; return; }
      b.disabled = true;
      call('rechazar', { id: id, motivo: m })
        .then(function () { S.rejecting = null; toast('Regresado a quien lo subió'); recargar(); })
        .catch(function (e) { $('#rjs-' + id).textContent = e.message; b.disabled = false; });
    };
  });
}

/* =========================================================
   Módulo: Resultados
   ========================================================= */
function mResultados(seq) {
  return call('resultados').then(function (d) {
    if (!vigente(seq)) return;
    pintarResultados(d);
  });
}
function pintarResultados(d) {
  if (!d.meses.length) {
    $('#view').innerHTML = '<div class="head"><div><h1>Resultados</h1><p class="sub">Facebook e Instagram de la Delegación y del Delegado</p></div></div>' +
      '<div class="card"><div class="emptyst"><span class="round">' + ic('chart') + '</span><b>Todavía no hay métricas</b><p>Se guardan solas el día 1 de cada mes cuando Meta está conectado. ' +
      (S.user.rol === 'admin' ? 'Puedes conectarlo o capturar las cifras a mano en Configuración.' : 'El administrador puede actualizarlas.') + '</p>' +
      (S.user.rol === 'admin' ? '<button class="btn" data-go="config">' + ic('gear') + 'Ir a Configuración</button>' : '') + '</div></div>';
    bindGo(); return;
  }
  var fila = function (m, k) { return d.filas.filter(function (f) { return f.mes === m && f.cuenta === k; })[0]; };
  var n = function (v) { return Number(v) || 0; };
  var suma = function (m, k, campo) {
    var ks = k === 'all' ? CUENTAS.map(function (a) { return a.k; }) : k === 'del' ? ['fbDel', 'igDel'] : k === 'dto' ? ['fbDto', 'igDto'] : [k];
    return ks.reduce(function (s, kk) { var f = fila(m, kk); return s + (f ? n(f[campo]) : 0); }, 0);
  };
  var meses = d.meses.slice(-6), ult = meses[meses.length - 1], prev = meses[meses.length - 2];
  var k = S.res, tot = suma(ult, k, 'interacciones') || 0;
  var opts = [['all', 'Todas'], ['fbDel', 'FB Delegación'], ['igDel', 'IG Delegación'], ['fbDto', 'FB Delegado'], ['igDto', 'IG Delegado']];
  var parte = function (campo) { return tot ? Math.round(suma(ult, k, campo) / tot * 100) + '% del total' : '—'; };
  var segs = CUENTAS.map(function (a) { var f = fila(ult, a.k); return [a.ab + ' ' + a.pagina, f && f.seguidoresNuevos !== '' ? n(f.seguidoresNuevos) : null, a.pagina === 'Delegación' ? 'var(--vino)' : 'var(--oro)', f ? n(f.seguidores) : null]; });
  var smax = Math.max.apply(null, segs.map(function (s) { return Math.abs(s[1] || 0); }).concat([1]));
  var totalNuevos = segs.reduce(function (s, x) { return s + (x[1] || 0); }, 0);

  $('#view').innerHTML =
    '<div class="head"><div><h1>Resultados</h1><p class="sub">' + mesLargo(ult) + ' · se actualiza el día 1 de cada mes</p></div></div>' +
    '<div class="seg" role="group" aria-label="Cuenta">' + opts.map(function (o) { return '<button data-res="' + o[0] + '" aria-pressed="' + (k === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>' +
    '<section class="kpis">' +
      '<div class="card kpi hero"><span class="lbl">Interacciones</span><div class="big">' + fmt(tot) + '</div><div class="meta">' + (prev ? dl(tot, suma(prev, k, 'interacciones')) + ' vs ' + mesCorto(prev).toLowerCase() : 'Primer mes registrado') + '</div></div>' +
      '<div class="card kpi"><span class="lbl">Reacciones</span><div class="big">' + fmt(suma(ult, k, 'reacciones')) + '</div><div class="meta">' + parte('reacciones') + '</div></div>' +
      '<div class="card kpi"><span class="lbl">Comentarios</span><div class="big">' + fmt(suma(ult, k, 'comentarios')) + '</div><div class="meta">' + parte('comentarios') + '</div></div>' +
      '<div class="card kpi"><span class="lbl">Compartidos</span><div class="big">' + fmt(suma(ult, k, 'compartidos')) + '</div><div class="meta">' + parte('compartidos') + '</div></div>' +
    '</section>' +
    '<section class="row2">' +
      '<div class="card chart"><div class="card-h"><div><h2>Evolución de la página</h2><p>Interacciones de los últimos ' + meses.length + ' meses</p></div></div>' + areaSVG(meses.map(function (m) { return suma(m, k, 'interacciones'); }), meses.map(mesCorto)) + '</div>' +
      '<div class="card"><div class="card-h"><div><h2>Seguidores nuevos</h2><p>' + mesLargo(ult) + ', por cuenta</p></div></div>' +
        '<div class="big">' + (totalNuevos >= 0 ? '+' : '') + fmt(totalNuevos) + '</div>' +
        '<div class="hbars">' + segs.map(function (s) {
          return '<div class="hb"><span>' + s[0] + '</span><div class="tr"><div class="fl" style="width:' + (s[1] === null ? 0 : Math.abs(s[1]) / smax * 100) + '%;background:' + s[2] + '"></div></div><span class="v">' + (s[1] === null ? '—' : (s[1] >= 0 ? '+' : '') + fmt(s[1])) + '</span></div>';
        }).join('') + '</div><p class="meta">Se calcula contra el mes anterior; el primer mes aparece como —.</p></div>' +
    '</section>' +
    '<section class="row2 even">' +
      '<div class="card"><div class="card-h"><div><h2>Delegación contra Delegado</h2><p>Facebook + Instagram de cada página</p></div></div>' +
        '<div class="tbl"><table class="rt"><thead><tr><th>Página</th><th class="num">' + mesCorto(ult) + '</th>' + (prev ? '<th class="num">' + mesCorto(prev) + '</th><th>Cambio</th>' : '') + '</tr></thead><tbody>' +
        [['del', 'Delegación'], ['dto', 'Delegado']].map(function (p) {
          var a = suma(ult, p[0], 'interacciones'), b = prev ? suma(prev, p[0], 'interacciones') : 0;
          return '<tr><td class="first"><div class="tcell" style="min-width:120px"><span class="pg ' + p[0] + '"></span><b>' + p[1] + '</b></div></td><td data-label="' + mesCorto(ult) + '" class="num">' + fmt(a) + '</td>' +
            (prev ? '<td data-label="' + mesCorto(prev) + '" class="num">' + fmt(b) + '</td><td data-label="Cambio">' + (dl(a, b) || '—') + '</td>' : '') + '</tr>';
        }).join('') + '</tbody></table></div></div>' +
      '<div class="card"><div class="card-h"><div><h2>Detalle por cuenta</h2><p>' + mesLargo(ult) + '</p></div></div>' +
        '<div class="tbl"><table class="rt"><thead><tr><th>Cuenta</th><th class="num">Public.</th><th class="num">Interacc.</th><th class="num">Seguidores</th><th>Fuente</th></tr></thead><tbody>' +
        CUENTAS.map(function (a) {
          var f = fila(ult, a.k);
          return '<tr><td class="first"><div class="tcell" style="min-width:140px"><span class="pg ' + (a.pagina === 'Delegación' ? 'del' : 'dto') + '"></span><b>' + a.red + ' ' + a.pagina + '</b></div></td>' +
            '<td data-label="Publicaciones" class="num">' + (f && f.publicaciones !== '' ? fmt(f.publicaciones) : '—') + '</td><td data-label="Interacciones" class="num">' + (f ? fmt(f.interacciones) : '—') + '</td>' +
            '<td data-label="Seguidores" class="num">' + (f && f.seguidores !== '' ? fmt(f.seguidores) : '—') + '</td><td data-label="Fuente">' + (f ? (f.fuente === 'meta' ? 'Meta' : 'Manual') : 'Sin datos') + '</td></tr>';
        }).join('') + '</tbody></table></div></div>' +
    '</section>';
  $$('[data-res]').forEach(function (b) { b.onclick = function () { S.res = b.dataset.res; pintarResultados(d); }; });
}

/* =========================================================
   Módulo: Equipo (administrador)
   ========================================================= */
function mEquipo(seq) {
  return Promise.all([call('usuarios'), call('bitacora', { limite: 60 })]).then(function (r) {
    if (!vigente(seq)) return;
    pintarEquipo(r[0], r[1]);
  });
}
function mostrarTemporal(titulo, nombre, email, temporal) {
  abrirModal(titulo,
    '<p>Comparte estos datos con <b>' + esc(nombre) + '</b>. La contraseña es temporal: al entrar, el sistema le pedirá crear la suya.</p>' +
    '<dl class="kv"><dt>Correo</dt><dd>' + esc(email) + '</dd></dl><div class="secret" id="tmpPass">' + esc(temporal) + '</div>' +
    '<button class="btn" id="tmpCopy">' + ic('copy') + 'Copiar acceso</button><p class="meta">Esta contraseña no se volverá a mostrar.</p>');
  $('#tmpCopy').onclick = function () {
    var url = linkApp();
    copiar('Bienestar Conecta\n' + (url ? url + '\n' : '') + 'Correo: ' + email + '\nContraseña temporal: ' + temporal, null, null);
  };
}
function pintarEquipo(usuarios, bit) {
  var rc = { admin: 'bad', capturista: 'warn', aprobador: 'ok' };
  $('#view').innerHTML =
    '<div class="head"><div><h1>Equipo</h1><p class="sub">Usuarios, roles y bitácora</p></div><button class="btn" id="nuevoU">' + ic('plus') + 'Agregar persona</button></div>' +
    '<section class="row2"><div class="card"><div class="card-h"><div><h2>Usuarios</h2><p>Cada persona entra con su correo y ve solo los módulos de su rol</p></div><span class="tag">' + usuarios.length + '</span></div>' +
      '<div class="tbl"><table class="rt"><thead><tr><th>Persona</th><th>Rol</th><th>Estado</th><th>Último acceso</th><th></th></tr></thead><tbody>' +
      usuarios.map(function (x) {
        return '<tr><td class="first"><div class="tcell" style="min-width:200px"><span class="avatar" style="width:34px;height:34px;font-size:12px">' + initials(x.nombre) + '</span><div><b>' + esc(x.nombre) + '</b><small>' + esc(x.email) + '</small></div></div></td>' +
          '<td data-label="Rol"><select data-rol="' + x.id + '" aria-label="Rol de ' + esc(x.nombre) + '" style="min-height:38px;padding:6px 10px;font-size:14px;width:auto">' +
            ['admin', 'capturista', 'aprobador'].map(function (r) { return '<option value="' + r + '"' + (x.rol === r ? ' selected' : '') + '>' + ROL_TXT[r] + '</option>'; }).join('') + '</select></td>' +
          '<td data-label="Estado"><label class="chk" style="min-height:34px"><input type="checkbox" data-act="' + x.id + '"' + (x.activo ? ' checked' : '') + '>' + (x.activo ? 'Activo' : 'Inactivo') + '</label></td>' +
          '<td data-label="Último acceso" style="white-space:nowrap">' + (x.ultimoAcceso ? esc(x.ultimoAcceso) : '<span class="tag warn">Nunca</span>') + '</td>' +
          '<td data-label=""><button class="btn sm ghost" data-reset="' + x.id + '" data-n="' + esc(x.nombre) + '" data-e="' + esc(x.email) + '">Restablecer contraseña</button></td></tr>';
      }).join('') + '</tbody></table></div><p class="status" id="uMsg" aria-live="polite"></p></div>' +
    '<div class="card"><h2>Bitácora</h2>' + (bit.length ? '<div class="feed">' + bit.map(function (l) {
      return '<div><span class="avatar">' + initials(l.usuario) + '</span><div><p><b>' + esc(l.usuario) + '</b> · ' + esc(l.accion).toLowerCase() + (l.detalle ? ': ' + esc(l.detalle) : '') + '</p><small>' + esc(l.fecha) + '</small></div></div>';
    }).join('') + '</div>' : '<p class="meta">Sin movimientos todavía.</p>') + '</div></section>';

  var msg = function (m) { $('#uMsg').textContent = m; };
  $('#nuevoU').onclick = function () {
    abrirModal('Agregar persona',
      '<form id="fU" class="stack" novalidate><div><label class="l" for="uN">Nombre</label><input type="text" id="uN" autocomplete="off"></div>' +
      '<div><label class="l" for="uE">Correo</label><input type="email" id="uE" autocomplete="off" inputmode="email"></div>' +
      '<div><label class="l" for="uR">Rol</label><select id="uR"><option value="capturista">Capturista: sube y edita contenidos</option><option value="aprobador">Aprobador: revisa, aprueba y ve resultados</option><option value="admin">Administrador: acceso total</option></select></div>' +
      '<button class="btn" type="submit">' + ic('plus') + 'Crear acceso</button><p class="status err" id="uErr"></p></form>');
    $('#fU').onsubmit = function (e) {
      e.preventDefault();
      call('crearUsuario', { nombre: $('#uN').value, email: $('#uE').value, rol: $('#uR').value }).then(function (r) {
        mostrarTemporal('Acceso creado', r.usuario.nombre, r.usuario.email, r.temporal);
        go('equipo');
      }).catch(function (err) { $('#uErr').textContent = err.message; });
    };
  };
  $$('[data-rol]').forEach(function (s) {
    s.onchange = function () {
      call('actualizarUsuario', { id: s.dataset.rol, rol: s.value }).then(function () { toast('Rol actualizado'); })
        .catch(function (e) { msg(e.message); go('equipo'); });
    };
  });
  $$('[data-act]').forEach(function (c) {
    c.onchange = function () {
      call('actualizarUsuario', { id: c.dataset.act, activo: c.checked }).then(function () { toast(c.checked ? 'Usuario activado' : 'Usuario desactivado'); go('equipo'); })
        .catch(function (e) { msg(e.message); go('equipo'); });
    };
  });
  $$('[data-reset]').forEach(function (b) {
    b.onclick = function () {
      b.disabled = true;
      call('resetPass', { id: b.dataset.reset }).then(function (r) { mostrarTemporal('Contraseña restablecida', b.dataset.n, b.dataset.e, r.temporal); })
        .catch(function (e) { msg(e.message); }).then(function () { b.disabled = false; });
    };
  });
}

/* =========================================================
   Módulo: Configuración (administrador)
   ========================================================= */
function linkApp() { return location.origin + location.pathname.replace(/index\.html$/, ''); }
function mConfig(seq) {
  return call('config').then(function (c) {
    if (!vigente(seq)) return;
    // Guarda el link de GitHub Pages para que los correos de aviso lleven a la app.
    if (!c.appUrl && /^https:/.test(location.href)) {
      return call('guardarConfig', { appUrl: linkApp() }).then(function (nc) { if (vigente(seq)) pintarConfig(nc); });
    }
    pintarConfig(c);
  });
}
function pintarConfig(c) {
  var mesActual = today().slice(0, 7);
  var nombreCuenta = function (k) { var a = CUENTAS.filter(function (x) { return x.k === k; })[0]; return a.red + ' ' + a.pagina; };
  $('#view').innerHTML =
    '<div class="head"><div><h1>Configuración</h1><p class="sub">Avisos, conexión con Meta, inteligencia artificial y datos del sistema</p></div></div>' +
    '<section class="cfg">' +
      '<div class="card"><h2>Avisos por correo</h2><p class="meta">Los aprobadores reciben un correo cuando hay algo por revisar, y quien lo subió recibe otro cuando se aprueba o se rechaza (con el nombre de quien lo revisó).</p>' +
        '<label class="chk" style="width:fit-content"><input type="checkbox" id="cNot"' + (c.notificar ? ' checked' : '') + '>Enviar avisos por correo</label></div>' +

      '<div class="card"><h2>Inteligencia artificial</h2><p class="meta">Opcional. Con una clave de Gemini (Google AI Studio) la IA redacta la línea del tema. Sin clave, el mensaje se arma con el tema tal cual.</p>' +
        '<div><label class="l" for="gKey">Clave de Gemini</label><input type="password" id="gKey" autocomplete="off" placeholder="' + (c.gemini.tieneClave ? 'Guardada · escribe otra para reemplazarla' : 'Pega la clave aquí') + '"></div>' +
        '<div><label class="l" for="gMod">Modelo</label><input type="text" id="gMod" value="' + esc(c.gemini.modelo) + '"></div>' +
        '<div class="actions"><button class="btn" id="gSave">' + ic('save') + 'Guardar</button>' + (c.gemini.tieneClave ? '<button class="btn ghost" id="gDel">Quitar clave</button>' : '') + '</div></div>' +

      '<div class="card"><h2>Conexión con Meta</h2><p class="meta">IDs numéricos de cada página de Facebook y de su cuenta de Instagram profesional, y el token de cada página. El token de la página también sirve para su Instagram.</p>' +
        '<div class="form">' +
          CUENTAS.map(function (a) { return '<div><label class="l" for="mid-' + a.k + '">ID ' + a.red + ' ' + a.pagina + '</label><input type="text" inputmode="numeric" id="mid-' + a.k + '" value="' + esc(c.meta.cuentas[a.k]) + '"></div>'; }).join('') +
          '<div><label class="l" for="tDel">Token página Delegación</label><input type="password" id="tDel" autocomplete="off" placeholder="' + (c.meta.tokenDel ? 'Guardado' : 'Pega el token') + '"></div>' +
          '<div><label class="l" for="tDto">Token página Delegado</label><input type="password" id="tDto" autocomplete="off" placeholder="' + (c.meta.tokenDto ? 'Guardado' : 'Pega el token') + '"></div>' +
          '<div><label class="l" for="mVer">Versión de la API</label><input type="text" id="mVer" value="' + esc(c.meta.version) + '"></div>' +
        '</div>' +
        '<div class="actions"><button class="btn" id="mSave">' + ic('save') + 'Guardar</button><button class="btn ghost" id="mTest">Probar conexión</button></div>' +
        '<div class="reslist" id="mRes"></div>' +
        '<div style="border-top:1px solid var(--line);padding-top:14px" class="stack"><h3>Actualizar métricas ahora</h3><div class="actions"><input type="month" id="mMes" value="' + mesActual + '" style="width:auto"><button class="btn dark" id="mRun">' + ic('refresh') + 'Actualizar</button></div><div class="reslist" id="mRun2"></div></div></div>' +

      '<div class="card"><h2>Capturar métricas a mano</h2><p class="meta">Para meses sin conexión con Meta. Si ya existe ese mes y cuenta, se reemplaza.</p>' +
        '<form class="form" id="fMan" novalidate>' +
          '<div><label class="l" for="manMes">Mes</label><input type="month" id="manMes" value="' + mesActual + '"></div>' +
          '<div><label class="l" for="manCta">Cuenta</label><select id="manCta">' + CUENTAS.map(function (a) { return '<option value="' + a.k + '">' + nombreCuenta(a.k) + '</option>'; }).join('') + '</select></div>' +
          ['reacciones', 'comentarios', 'compartidos', 'publicaciones', 'seguidores'].map(function (f) {
            return '<div><label class="l" for="man-' + f + '">' + f.charAt(0).toUpperCase() + f.slice(1) + (f === 'seguidores' ? ' (total al cierre)' : '') + '</label><input type="number" min="0" inputmode="numeric" id="man-' + f + '"></div>';
          }).join('') +
          '<div class="full"><button class="btn" type="submit">' + ic('save') + 'Guardar cifras</button><p class="status" id="manMsg"></p></div></form></div>' +

      '<div class="card"><h2>Sistema</h2><dl class="kv">' +
        '<dt>Link de la app</dt><dd><a target="_blank" rel="noopener" href="' + esc(c.appUrl || linkApp()) + '">' + esc(c.appUrl || linkApp()) + '</a></dd>' +
        '<dt>Servidor</dt><dd style="font-size:12px">' + esc(c.apiUrl || API_URL) + '</dd>' +
        '<dt>Base de datos</dt><dd><a target="_blank" rel="noopener" href="' + esc(c.hojaUrl) + '">Abrir hoja de cálculo</a></dd>' +
        (c.carpetaUrl ? '<dt>Archivos</dt><dd><a target="_blank" rel="noopener" href="' + esc(c.carpetaUrl) + '">Abrir carpeta en Drive</a></dd>' : '') +
        '<dt>Métricas automáticas</dt><dd>' + (c.tareaMensual ? '<span class="tag ok">Programadas · día 1, 6:00</span>' : '<span class="tag warn">Sin programar</span>') + '</dd>' +
        '<dt>Versión</dt><dd>' + esc(c.version) + '</dd></dl>' +
        '<div class="actions"><button class="btn ghost" id="sCopy">' + ic('copy') + 'Copiar link de la app</button>' + (c.appUrl && c.appUrl !== linkApp() ? '<button class="btn ghost" id="sFix">Usar este link para los avisos</button>' : '') + '<button class="btn ghost" id="sTask">' + ic('refresh') + 'Reprogramar tarea mensual</button></div></div>' +
    '</section>';

  var guardarCfg = function (datos, ok) {
    return call('guardarConfig', datos).then(function (nc) { toast(ok || 'Guardado'); pintarConfig(nc); })
      .catch(function (e) { toast(e.message); });
  };
  $('#cNot').onchange = function () { guardarCfg({ notificar: this.checked }, this.checked ? 'Avisos activados' : 'Avisos desactivados'); };
  $('#gSave').onclick = function () { guardarCfg({ geminiKey: $('#gKey').value.trim(), geminiModelo: $('#gMod').value.trim() }); };
  var gd = $('#gDel'); if (gd) gd.onclick = function () { guardarCfg({ geminiKey: 'BORRAR' }, 'Clave eliminada'); };
  $('#mSave').onclick = function () {
    var cuentas = {}; CUENTAS.forEach(function (a) { cuentas[a.k] = $('#mid-' + a.k).value.trim(); });
    guardarCfg({ cuentas: cuentas, tokenDel: $('#tDel').value.trim(), tokenDto: $('#tDto').value.trim(), metaVersion: $('#mVer').value.trim() });
  };
  var lista = function (el, res, campo) {
    el.innerHTML = res.map(function (r) {
      return '<div><span class="tag ' + (r.ok ? 'ok' : 'bad') + '">' + (r.ok ? 'Bien' : 'Error') + '</span><span><b>' + nombreCuenta(r.cuenta) + '</b>' + (r[campo] ? ' · ' + esc(r[campo]) : '') + '</span></div>';
    }).join('');
  };
  $('#mTest').onclick = function () {
    var b = this; b.disabled = true; $('#mRes').innerHTML = '<p class="meta">Probando…</p>';
    call('probarMeta').then(function (r) { lista($('#mRes'), r, 'mensaje'); }).catch(function (e) { $('#mRes').textContent = e.message; }).then(function () { b.disabled = false; });
  };
  $('#mRun').onclick = function () {
    var b = this; b.disabled = true; $('#mRun2').innerHTML = '<p class="meta">Consultando a Meta… puede tardar un minuto.</p>';
    call('actualizarMetricas', { mes: $('#mMes').value }).then(function (r) { lista($('#mRun2'), r.cuentas, 'error'); toast('Métricas de ' + mesLargo(r.mes)); })
      .catch(function (e) { $('#mRun2').textContent = e.message; }).then(function () { b.disabled = false; });
  };
  $('#fMan').onsubmit = function (e) {
    e.preventDefault();
    var d = { mes: $('#manMes').value, cuenta: $('#manCta').value };
    ['reacciones', 'comentarios', 'compartidos', 'publicaciones', 'seguidores'].forEach(function (f) { d[f] = $('#man-' + f).value; });
    call('guardarMetricaManual', d).then(function () {
      $('#manMsg').textContent = 'Guardado: ' + nombreCuenta(d.cuenta) + ' · ' + mesLargo(d.mes) + '.'; toast('Cifras guardadas');
      ['reacciones', 'comentarios', 'compartidos', 'publicaciones', 'seguidores'].forEach(function (f) { $('#man-' + f).value = ''; });
    }).catch(function (err) { $('#manMsg').textContent = err.message; });
  };
  $('#sCopy').onclick = function () { copiar(c.appUrl || linkApp(), null, null); };
  var sf = $('#sFix'); if (sf) sf.onclick = function () { guardarCfg({ appUrl: linkApp() }, 'Link de avisos actualizado'); };
  $('#sTask').onclick = function () { call('instalarTareas').then(function () { toast('Tarea mensual programada'); go('config'); }).catch(function (e) { toast(e.message); }); };
}

/* =========================================================
   Eventos generales e inicio
   ========================================================= */
$('#menuBtn').onclick = abrirMenu;
$('#drawerClose').onclick = function () { cerrarMenu(); $('#menuBtn').focus(); };
$('#drawerBack').onclick = cerrarMenu;
$('#dSalir').onclick = function () { cerrarMenu(); salir(); };
$('#dPass').onclick = function () { cerrarMenu(); ventanaCuenta(); };
$('#dTV').onclick = function () { cerrarMenu(); abrirTV(); };
/* Menú de usuario (arriba a la derecha) */
function abrirUMenu() { $('#umenu').hidden = false; $('#meBtn').setAttribute('aria-expanded', 'true'); $('#uCuenta').focus(); }
function cerrarUMenu() { if ($('#umenu').hidden) return; $('#umenu').hidden = true; $('#meBtn').setAttribute('aria-expanded', 'false'); }
$('#meBtn').onclick = function (e) { e.stopPropagation(); if ($('#umenu').hidden) abrirUMenu(); else cerrarUMenu(); };
document.addEventListener('click', function (e) { if (!e.target.closest('.me')) cerrarUMenu(); });
$('#uCuenta').onclick = function () { cerrarUMenu(); ventanaCuenta(); };
$('#uTV').onclick = function () { cerrarUMenu(); abrirTV(); };
$('#uSalir').onclick = function () { cerrarUMenu(); salir(); };
$('#mClose').onclick = cerrarModal;
$('#modalBack').onclick = cerrarModal;
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (TV.on) { cerrarTV(); return; }
  if (!$('#umenu').hidden) { cerrarUMenu(); $('#meBtn').focus(); return; }
  if (!$('#modal').hidden) cerrarModal();
  else if (!$('#drawer').hidden) { cerrarMenu(); $('#menuBtn').focus(); }
});
window.matchMedia('(max-width:720px)').addEventListener('change', function () {
  if (!isPhone()) cerrarMenu();
  if (S.user && ['inicio', 'resultados'].indexOf(S.mod) > -1) go(S.mod);
});

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}

(function arrancar() {
  if (!apiLista()) { mostrarAcceso('Falta configurar el servidor: pega la URL de Apps Script en config.js.'); $('#lBtn').disabled = true; return; }
  S.token = leerSesion();
  if (!S.token) { mostrarAcceso(''); return; }
  $('#acceso').hidden = true;
  call('yo').then(function (u) { S.user = u; entrar(); }).catch(function () { if (!S.user) mostrarAcceso(''); });
})();

})();
