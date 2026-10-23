/**
 * Bienestar Conecta — Sistema de Comunicación Social
 * Punto de entrada de la aplicación web y enrutador de acciones.
 *
 * Toda llamada del navegador pasa por api(token, accion, datos).
 * Cada acción declara qué roles pueden usarla; el permiso se revisa
 * aquí en el servidor, nunca solo en la pantalla.
 */

const APP = { nombre: 'Bienestar Conecta', version: '1.0.0' };

const ROLES = { ADMIN: 'admin', CAPTURISTA: 'capturista', APROBADOR: 'aprobador' };
const TODOS = [ROLES.ADMIN, ROLES.CAPTURISTA, ROLES.APROBADOR];
const EDITORES = [ROLES.ADMIN, ROLES.CAPTURISTA];

/**
 * La app (pantallas) vive en GitHub Pages; este proyecto es su servidor.
 * La página manda cada petición por POST con { token, accion, datos }
 * y recibe JSON. Se envía como text/plain para que el navegador no
 * haga la verificación previa de CORS que Apps Script no contesta.
 */
function doPost(e) {
  let peticion = {};
  try {
    peticion = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_(JSON.stringify({ ok: false, error: 'Petición no válida.' }));
  }
  return json_(api(peticion.token, peticion.accion, peticion.datos));
}

/** Abrir el link del servidor en el navegador solo confirma que está en línea. */
function doGet() {
  return json_(JSON.stringify({ ok: true, app: APP.nombre, version: APP.version, mensaje: 'Servidor en línea. La app se abre desde GitHub Pages.' }));
}

function json_(texto) {
  return ContentService.createTextOutput(texto).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Catálogo de acciones.
 *  fn: nombre de la función que la atiende (se busca al momento de usarla,
 *      así no importa en qué orden cargue Apps Script los archivos)
 *  en: archivo donde vive esa función (para avisar si falta)
 *  roles: quién puede llamarla (vacío = pública, solo login)
 *  escribe: si modifica datos (se ejecuta con candado para evitar choques)
 */
const ACCIONES = {
  // Sesión
  login:               { fn: 'login_', en: 'Auth', roles: [] },
  logout:              { fn: 'logout_', en: 'Auth', roles: TODOS },
  yo:                  { fn: 'yo_', en: 'Auth', roles: TODOS },
  cambiarPass:         { fn: 'cambiarPass_', en: 'Auth', roles: TODOS, escribe: true },

  // Inicio y parrilla
  inicio:              { fn: 'inicio_', en: 'Contenidos', roles: TODOS },
  tv:                  { fn: 'tv_', en: 'Contenidos', roles: TODOS },
  contenidos:          { fn: 'listarContenidos_', en: 'Contenidos', roles: TODOS },
  guardarContenido:    { fn: 'guardarContenido_', en: 'Contenidos', roles: EDITORES, escribe: true },
  eliminarContenido:   { fn: 'eliminarContenido_', en: 'Contenidos', roles: EDITORES, escribe: true },
  marcarPublicado:     { fn: 'marcarPublicado_', en: 'Contenidos', roles: EDITORES, escribe: true },

  // Archivos (subida por partes a Drive)
  iniciarSubida:       { fn: 'iniciarSubida_', en: 'Archivos', roles: EDITORES },
  subirParte:          { fn: 'subirParte_', en: 'Archivos', roles: EDITORES },

  // Links y mensaje
  publicadas:          { fn: 'listarPublicadas_', en: 'Contenidos', roles: EDITORES },
  guardarLinks:        { fn: 'guardarLinks_', en: 'Contenidos', roles: EDITORES, escribe: true },
  generarMensaje:      { fn: 'generarMensaje_', en: 'IA', roles: EDITORES, escribe: true },

  // Aprobaciones
  pendientes:          { fn: 'listarPendientes_', en: 'Contenidos', roles: [ROLES.ADMIN, ROLES.APROBADOR] },
  aprobar:             { fn: 'aprobar_', en: 'Contenidos', roles: [ROLES.ADMIN, ROLES.APROBADOR], escribe: true },
  rechazar:            { fn: 'rechazar_', en: 'Contenidos', roles: [ROLES.ADMIN, ROLES.APROBADOR], escribe: true },

  // Resultados
  resultados:          { fn: 'resultados_', en: 'Meta', roles: [ROLES.ADMIN, ROLES.APROBADOR] },

  // Administración
  usuarios:            { fn: 'listarUsuarios_', en: 'Auth', roles: [ROLES.ADMIN] },
  crearUsuario:        { fn: 'crearUsuario_', en: 'Auth', roles: [ROLES.ADMIN], escribe: true },
  actualizarUsuario:   { fn: 'actualizarUsuario_', en: 'Auth', roles: [ROLES.ADMIN], escribe: true },
  resetPass:           { fn: 'resetPass_', en: 'Auth', roles: [ROLES.ADMIN], escribe: true },
  bitacora:            { fn: 'listarBitacora_', en: 'Datos', roles: [ROLES.ADMIN] },
  config:              { fn: 'obtenerConfig_', en: 'Config', roles: [ROLES.ADMIN] },
  guardarConfig:       { fn: 'guardarConfig_', en: 'Config', roles: [ROLES.ADMIN], escribe: true },
  probarMeta:          { fn: 'probarMeta_', en: 'Meta', roles: [ROLES.ADMIN] },
  actualizarMetricas:  { fn: 'actualizarMetricas_', en: 'Meta', roles: [ROLES.ADMIN], escribe: true },
  guardarMetricaManual:{ fn: 'guardarMetricaManual_', en: 'Meta', roles: [ROLES.ADMIN], escribe: true },
  instalarTareas:      { fn: 'instalarTareas_', en: 'Config', roles: [ROLES.ADMIN], escribe: true }
};

/**
 * Única puerta de entrada desde el navegador.
 * Devuelve siempre un texto JSON: { ok: true, data } o { ok: false, error }.
 */
function api(token, accion, datos) {
  let candado = null;
  try {
    const a = ACCIONES[accion];
    if (!a) throw new Error('Acción no válida.');

    let usuario = null;
    if (a.roles.length) {
      usuario = sesion_(token);
      if (a.roles.indexOf(usuario.rol) === -1) {
        throw new Error('No tienes permiso para hacer esto.');
      }
    }

    if (a.escribe) {
      candado = LockService.getScriptLock();
      candado.waitLock(20000);
    }

    const resultado = funcion_(a)(datos || {}, usuario, token);
    return JSON.stringify({ ok: true, data: resultado === undefined ? null : resultado });
  } catch (err) {
    return JSON.stringify({ ok: false, error: (err && err.message) || String(err) });
  } finally {
    if (candado) candado.releaseLock();
  }
}

/** Busca la función de una acción; si falta, dice qué archivo hay que volver a pegar. */
function funcion_(a) {
  const f = globalThis[a.fn];
  if (typeof f !== 'function') {
    throw new Error('Falta la función ' + a.fn + '. Vuelve a pegar completo el archivo ' + a.en + '.gs y guarda.');
  }
  return f;
}

/**
 * REVISIÓN: ejecuta esta función desde el editor (elígela arriba y presiona Ejecutar).
 * Revisa que todos los archivos estén pegados completos y dice cuál falta.
 */
function verificar() {
  const faltan = {};
  Object.keys(ACCIONES).forEach(function (k) {
    const a = ACCIONES[k];
    if (typeof globalThis[a.fn] !== 'function') (faltan[a.en] = faltan[a.en] || []).push(a.fn);
  });
  ['instalar', 'tareaMensual', 'doPost', 'doGet'].forEach(function (f) {
    if (typeof globalThis[f] !== 'function') (faltan.Config = faltan.Config || []).push(f);
  });
  const archivos = Object.keys(faltan);
  const msg = archivos.length
    ? 'Faltan funciones. Vuelve a pegar completos estos archivos:\n' +
      archivos.map(function (f) { return '  • ' + f + '.gs  (' + faltan[f].join(', ') + ')'; }).join('\n')
    : 'Todo bien: los 8 archivos están completos. Ya puedes ejecutar instalar().';
  Logger.log(msg);
  return msg;
}
