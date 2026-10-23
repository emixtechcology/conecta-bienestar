/**
 * Contenidos: parrilla, aprobaciones y links de publicación.
 * Flujo: Borrador → En revisión → Programado → Publicado
 *                     ↘ Rechazado (regresa a quien lo subió con el motivo)
 * Basta con que UN aprobador (o el administrador) lo apruebe o lo rechace;
 * queda registrado quién lo revisó y cuándo.
 */

const TIPOS = ['Video', 'Reel', 'Arte', 'Carrusel', 'Historia', 'En vivo'];
const PATRONES_LINK = {
  fbDel: /^https?:\/\/(www\.|m\.|web\.)?(facebook\.com|fb\.watch|fb\.com)\//i,
  igDel: /^https?:\/\/(www\.)?instagram\.com\//i,
  fbDto: /^https?:\/\/(www\.|m\.|web\.)?(facebook\.com|fb\.watch|fb\.com)\//i,
  igDto: /^https?:\/\/(www\.)?instagram\.com\//i
};

/* ---------- Fechas como texto yyyy-MM-dd (sin problemas de zona horaria) ---------- */
function partes_(ymd) { return String(ymd).split('-').map(Number); }
function sumarDias_(ymd, n) {
  const p = partes_(ymd);
  return new Date(Date.UTC(p[0], p[1] - 1, p[2] + n)).toISOString().slice(0, 10);
}
function lunes_(ymd) {
  const p = partes_(ymd);
  const dia = new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay(); // 0 domingo
  return sumarDias_(ymd, dia === 0 ? -6 : 1 - dia);
}
function validarFecha_(f) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f))) throw new Error('La fecha no es válida.');
}

/* ---------- Serialización ---------- */
function contenidoPublico_(c) {
  const dest = {}, links = {};
  CUENTAS.forEach(function (a) { dest[a.k] = bool_(c['dest_' + a.k]); links[a.k] = c['link_' + a.k] || ''; });
  return {
    id: c.id, tema: c.tema, tipo: c.tipo, fecha: c.fecha, hora: c.hora,
    dest: dest, copy: c.copy, estado: c.estado,
    archivo: c.archivoId ? { id: c.archivoId, nombre: c.archivoNombre, mime: c.archivoMime } : null,
    autorId: c.autorId, autorNombre: c.autorNombre, motivo: c.motivo,
    revisadoPor: c.revisadoPor || '', revisadoEn: c.revisadoEn || '',
    links: links, mensaje: c.mensaje, creado: c.creado, actualizado: c.actualizado
  };
}

function ordenar_(lista) {
  return lista.sort(function (a, b) { return (a.fecha + a.hora).localeCompare(b.fecha + b.hora); });
}

/* ---------- Inicio ---------- */
function inicio_() {
  const hoy = hoy_();
  const ini = lunes_(hoy), fin = sumarDias_(ini, 6);
  const todos = leer_('Contenidos');

  const semana = todos.filter(function (c) { return c.fecha >= ini && c.fecha <= fin; });
  const proximas = ordenar_(todos.filter(function (c) {
    return c.fecha >= hoy && c.fecha <= sumarDias_(hoy, 7) && c.estado !== ESTADOS.RECHAZADO;
  })).slice(0, 8).map(contenidoPublico_);

  const recientes = todos.filter(function (c) {
    return c.estado === ESTADOS.PUBLICADO && c.fecha >= sumarDias_(hoy, -14) && c.fecha <= hoy;
  });
  let esperados = 0, capturados = 0;
  const faltantes = [];
  recientes.forEach(function (c) {
    let e = 0, k = 0;
    CUENTAS.forEach(function (a) { if (bool_(c['dest_' + a.k])) { e++; if (c['link_' + a.k]) k++; } });
    esperados += e; capturados += k;
    faltantes.push({ id: c.id, tema: c.tema, tienen: k, total: e });
  });

  return {
    hoy: hoy, semanaIni: ini, semanaFin: fin,
    kpis: {
      publicadasSemana: semana.filter(function (c) { return c.estado === ESTADOS.PUBLICADO; }).length,
      totalSemana: semana.length,
      enRevision: todos.filter(function (c) { return c.estado === ESTADOS.REVISION; }).length,
      programadas: todos.filter(function (c) { return c.estado === ESTADOS.PROGRAMADO && c.fecha >= hoy; }).length,
      atrasadas: todos.filter(function (c) { return c.estado === ESTADOS.PROGRAMADO && c.fecha < hoy; }).length
    },
    links: { esperados: esperados, capturados: capturados, detalle: faltantes.slice(0, 6) },
    proximas: proximas,
    meses: totalesPorMes_(6),
    actividad: leer_('Bitacora').slice(-6).reverse().map(limpio_)
  };
}

/* ---------- Vista completa TV ---------- */
/** Todo lo que muestra el tablero de TV en una sola consulta. */
function tv_() {
  const d = inicio_();
  const hoy = d.hoy, limite = sumarDias_(hoy, 7);
  const todos = leer_('Contenidos');
  const visible = function (c) { return c.estado !== ESTADOS.RECHAZADO && c.estado !== ESTADOS.BORRADOR; };
  d.hoyLista = ordenar_(todos.filter(function (c) { return c.fecha === hoy && visible(c); })).map(contenidoPublico_);
  d.pendientes = ordenar_(todos.filter(function (c) { return c.estado === ESTADOS.REVISION; })).slice(0, 8).map(contenidoPublico_);
  d.proximas = ordenar_(todos.filter(function (c) { return c.fecha > hoy && c.fecha <= limite && visible(c); })).slice(0, 6).map(contenidoPublico_);
  d.hora = Utilities.formatDate(new Date(), zona_(), 'HH:mm');
  return d;
}

/* ---------- Parrilla ---------- */
function listarContenidos_(d) {
  const desde = d.desde || lunes_(hoy_());
  const hasta = d.hasta || sumarDias_(desde, 6);
  validarFecha_(desde); validarFecha_(hasta);
  return ordenar_(leer_('Contenidos').filter(function (c) { return c.fecha >= desde && c.fecha <= hasta; }))
    .map(contenidoPublico_);
}

function puedeEditar_(c, u) {
  return u.rol === ROLES.ADMIN || (u.rol === ROLES.CAPTURISTA && c.autorId === u.id);
}

function guardarContenido_(d, u) {
  const tema = String(d.tema || '').trim();
  if (!tema) throw new Error('Escribe el tema de la publicación.');
  if (tema.length > 200) throw new Error('El tema es demasiado largo (máximo 200 caracteres).');
  if (TIPOS.indexOf(d.tipo) === -1) throw new Error('Elige un formato válido.');
  validarFecha_(d.fecha);
  if (!/^\d{2}:\d{2}$/.test(String(d.hora || ''))) throw new Error('La hora no es válida.');
  const dest = d.dest || {};
  if (!CUENTAS.some(function (a) { return dest[a.k]; })) throw new Error('Marca al menos una página y red.');

  const estado = d.borrador ? ESTADOS.BORRADOR : ESTADOS.REVISION;
  const datos = {
    tema: tema, tipo: d.tipo, fecha: d.fecha, hora: d.hora,
    copy: String(d.copy || '').slice(0, 5000), estado: estado,
    motivo: '', revisadoPor: '', revisadoEn: '', actualizado: ahora_()
  };
  CUENTAS.forEach(function (a) { datos['dest_' + a.k] = !!dest[a.k]; });
  if (d.archivo && d.archivo.id) {
    datos.archivoId = d.archivo.id; datos.archivoNombre = d.archivo.nombre || ''; datos.archivoMime = d.archivo.mime || '';
  }

  let c;
  if (d.id) {
    const actual = buscar_('Contenidos', d.id);
    if (!actual) throw new Error('No se encontró el contenido.');
    if (!puedeEditar_(actual, u)) throw new Error('Solo puedes editar lo que tú subiste.');
    if (actual.estado === ESTADOS.PUBLICADO) throw new Error('Ya está publicado; no se puede editar.');
    if (datos.archivoId && actual.archivoId && datos.archivoId !== actual.archivoId) papelera_(actual.archivoId);
    c = actualizar_('Contenidos', actual.id, datos);
    log_(u, estado === ESTADOS.BORRADOR ? 'Editó borrador' : 'Editó y envió a revisión', tema);
  } else {
    c = insertar_('Contenidos', Object.assign({
      id: nuevoId_('C'), autorId: u.id, autorNombre: u.nombre, creado: ahora_(),
      archivoId: '', archivoNombre: '', archivoMime: '',
      link_fbDel: '', link_igDel: '', link_fbDto: '', link_igDto: '', mensaje: ''
    }, datos));
    log_(u, estado === ESTADOS.BORRADOR ? 'Guardó borrador' : 'Subió contenido', tema);
  }

  if (estado === ESTADOS.REVISION) {
    notificar_(correosPorRol_(ROLES.APROBADOR),
      'Nuevo contenido por aprobar: ' + tema,
      '<p><b>' + esc_(u.nombre) + '</b> envió a revisión:</p><p style="font-size:16px"><b>' + esc_(tema) + '</b><br>' +
      esc_(d.tipo) + ' · ' + esc_(d.fecha) + ' ' + esc_(d.hora) + '</p>');
  }
  return contenidoPublico_(buscar_('Contenidos', c.id));
}

function eliminarContenido_(d, u) {
  const c = buscar_('Contenidos', d.id);
  if (!c) throw new Error('No se encontró el contenido.');
  if (!puedeEditar_(c, u)) throw new Error('Solo puedes eliminar lo que tú subiste.');
  if (c.archivoId) papelera_(c.archivoId);
  eliminarFila_('Contenidos', c.id);
  log_(u, 'Eliminó contenido', c.tema);
  return true;
}

function marcarPublicado_(d, u) {
  const c = buscar_('Contenidos', d.id);
  if (!c) throw new Error('No se encontró el contenido.');
  if (c.estado !== ESTADOS.PROGRAMADO) throw new Error('Solo se puede marcar como publicado lo que está programado.');
  actualizar_('Contenidos', c.id, { estado: ESTADOS.PUBLICADO, actualizado: ahora_() });
  log_(u, 'Marcó como publicado', c.tema);
  return contenidoPublico_(buscar_('Contenidos', c.id));
}

/* ---------- Links ---------- */
function listarPublicadas_() {
  const hoy = hoy_(), desde = sumarDias_(hoy, -45);
  return leer_('Contenidos')
    .filter(function (c) {
      return (c.estado === ESTADOS.PUBLICADO || c.estado === ESTADOS.PROGRAMADO) && c.fecha >= desde && c.fecha <= hoy;
    })
    .sort(function (a, b) { return (b.fecha + b.hora).localeCompare(a.fecha + a.hora); })
    .map(contenidoPublico_);
}

function guardarLinks_(d, u) {
  const c = buscar_('Contenidos', d.id);
  if (!c) throw new Error('No se encontró el contenido.');
  const dest = d.dest || {}, links = d.links || {};
  const cambios = { actualizado: ahora_() };
  let alguno = false;
  CUENTAS.forEach(function (a) {
    cambios['dest_' + a.k] = !!dest[a.k];
    const v = String(links[a.k] || '').trim();
    if (v && !PATRONES_LINK[a.k].test(v)) {
      throw new Error('El link de ' + a.red + ' ' + a.pagina + ' no parece de ' + a.red + '.');
    }
    cambios['link_' + a.k] = dest[a.k] ? v : '';
    if (dest[a.k] && v) alguno = true;
  });
  if (alguno && c.estado === ESTADOS.PROGRAMADO) cambios.estado = ESTADOS.PUBLICADO;
  actualizar_('Contenidos', c.id, cambios);
  log_(u, 'Capturó links', c.tema);
  return contenidoPublico_(buscar_('Contenidos', c.id));
}

/* ---------- Aprobaciones ---------- */
function listarPendientes_() {
  const todos = leer_('Contenidos');
  const pendientes = ordenar_(todos.filter(function (c) { return c.estado === ESTADOS.REVISION; }));
  const recientes = todos
    .filter(function (c) { return c.revisadoPor && [ESTADOS.PROGRAMADO, ESTADOS.RECHAZADO, ESTADOS.PUBLICADO].indexOf(c.estado) > -1; })
    .sort(function (a, b) { return String(b.revisadoEn).localeCompare(String(a.revisadoEn)); })
    .slice(0, 15);
  return { pendientes: pendientes.map(contenidoPublico_), recientes: recientes.map(contenidoPublico_) };
}

/** Un aprobador (o el administrador) aprueba: queda programado de inmediato. */
function aprobar_(d, u) {
  const c = buscar_('Contenidos', d.id);
  if (!c) throw new Error('No se encontró el contenido.');
  if (c.estado !== ESTADOS.REVISION) {
    throw new Error(c.revisadoPor ? 'Ya lo revisó ' + c.revisadoPor + '.' : 'Este contenido ya no está en revisión.');
  }
  actualizar_('Contenidos', c.id, {
    estado: ESTADOS.PROGRAMADO, motivo: '', revisadoPor: u.nombre, revisadoEn: ahora_(), actualizado: ahora_()
  });
  log_(u, 'Aprobó', c.tema);
  avisarAutor_(c, 'Aprobado: ' + c.tema,
    '<p><b>' + esc_(u.nombre) + '</b> aprobó tu contenido <b>' + esc_(c.tema) + '</b> y quedó programado.</p>');
  return contenidoPublico_(buscar_('Contenidos', c.id));
}

/** Un aprobador (o el administrador) rechaza con motivo: regresa a quien lo subió. */
function rechazar_(d, u) {
  const c = buscar_('Contenidos', d.id);
  if (!c) throw new Error('No se encontró el contenido.');
  if (c.estado !== ESTADOS.REVISION) {
    throw new Error(c.revisadoPor ? 'Ya lo revisó ' + c.revisadoPor + '.' : 'Este contenido ya no está en revisión.');
  }
  const motivo = String(d.motivo || '').trim();
  if (!motivo) throw new Error('Escribe qué hay que corregir.');
  actualizar_('Contenidos', c.id, {
    estado: ESTADOS.RECHAZADO, motivo: motivo, revisadoPor: u.nombre, revisadoEn: ahora_(), actualizado: ahora_()
  });
  log_(u, 'Rechazó', c.tema);
  avisarAutor_(c, 'Rechazado: ' + c.tema,
    '<p><b>' + esc_(u.nombre) + '</b> rechazó tu contenido <b>' + esc_(c.tema) + '</b>.</p><p>Motivo: ' + esc_(motivo) + '</p>');
  return contenidoPublico_(buscar_('Contenidos', c.id));
}

/* ---------- Avisos por correo ---------- */
function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function notificar_(correos, asunto, cuerpo) {
  if (props_().getProperty('NOTIFICAR') === 'no' || !correos || !correos.length) return;
  try {
    const url = props_().getProperty('APP_URL') || '';
    MailApp.sendEmail({
      to: correos.join(','),
      subject: '[Bienestar Conecta] ' + asunto,
      htmlBody: '<div style="font-family:Arial,sans-serif;color:#1D1418">' + cuerpo +
        (url ? '<p><a href="' + url + '" style="color:#7B1E3A">Abrir Bienestar Conecta</a></p>' : '') + '</div>',
      name: APP.nombre
    });
  } catch (e) { /* sin cuota de correo: el sistema sigue funcionando */ }
}

function avisarAutor_(c, asunto, cuerpo) {
  const a = buscar_('Usuarios', c.autorId);
  if (a && a.email) notificar_([a.email], asunto, cuerpo);
}
