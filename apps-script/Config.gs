/**
 * Instalación y configuración.
 *
 * PRIMER USO: desde el editor de Apps Script ejecuta la función instalar().
 * Crea las hojas, la carpeta de Drive y tu usuario administrador, y en el
 * registro de ejecución muestra tu contraseña temporal.
 */

/**
 * Hoja de cálculo del sistema:
 *  1) la que ya se usó antes (si existe),
 *  2) la hoja desde la que se abrió Apps Script (Extensiones > Apps Script),
 *  3) si el proyecto se creó suelto en script.google.com, crea una nueva en tu Drive.
 */
function libroParaInstalar_() {
  const p = props_();
  const guardado = p.getProperty('SS_ID');
  if (guardado) {
    try { return { libro: SpreadsheetApp.openById(guardado), nuevo: false }; } catch (e) { /* se borró: se busca o crea otra */ }
  }
  const activo = SpreadsheetApp.getActiveSpreadsheet();
  if (activo) return { libro: activo, nuevo: false };
  return { libro: SpreadsheetApp.create('Bienestar Conecta – Base de datos'), nuevo: true };
}

function instalar() {
  const r = libroParaInstalar_();
  const libro = r.libro;
  const p = props_();
  p.setProperty('SS_ID', libro.getId());
  libro.setSpreadsheetTimeZone(Session.getScriptTimeZone() || 'America/Mexico_City');

  Object.keys(ESQUEMA).forEach(function (nombre) {
    let h = libro.getSheetByName(nombre);
    if (!h) h = libro.insertSheet(nombre);
    const enc = ESQUEMA[nombre];
    h.getRange(1, 1, 1, enc.length).setValues([enc])
      .setFontWeight('bold').setBackground('#7B1E3A').setFontColor('#FFFFFF');
    h.setFrozenRows(1);
    (COLUMNAS_TEXTO[nombre] || []).forEach(function (col) {
      const i = enc.indexOf(col) + 1;
      h.getRange(1, i, h.getMaxRows(), 1).setNumberFormat('@');
    });
  });
  const hoja1 = libro.getSheetByName('Hoja 1') || libro.getSheetByName('Sheet1');
  if (hoja1 && libro.getSheets().length > 1 && hoja1.getLastRow() === 0) libro.deleteSheet(hoja1);

  carpetaRaiz_();
  if (!p.getProperty('NOTIFICAR')) p.setProperty('NOTIFICAR', 'si');

  let mensaje = 'Instalación lista.\nHoja de cálculo' + (r.nuevo ? ' (creada en tu Drive)' : '') + ': ' + libro.getUrl();
  if (!adminsActivos_().length) {
    const email = Session.getEffectiveUser().getEmail();
    const temporal = passTemporal_();
    const salt = Utilities.getUuid();
    insertar_('Usuarios', {
      id: nuevoId_('U'), nombre: 'Administrador', email: email.toLowerCase(), rol: ROLES.ADMIN,
      hash: hash_(temporal, salt), salt: salt, activo: true, cambiar: true, creado: ahora_(), ultimoAcceso: '',
      passTemporal: temporal, passCambiada: ''
    });
    mensaje += '\nUsuario administrador: ' + email + '\nContraseña temporal: ' + temporal +
      '\n(También está en la hoja Usuarios, columna passTemporal. Al entrar por primera vez el sistema te pedirá cambiarla.)';
  } else {
    // Si ya se había instalado antes y alguien no ha entrado nunca, su temporal se muestra en la hoja.
    leer_('Usuarios').forEach(function (u) {
      if (bool_(u.cambiar) && !u.passTemporal) {
        const temporal = passTemporal_();
        const salt = Utilities.getUuid();
        actualizar_('Usuarios', u.id, { hash: hash_(temporal, salt), salt: salt, passTemporal: temporal, passCambiada: '' });
        mensaje += '\nNueva contraseña temporal para ' + u.email + ': ' + temporal + ' (también en la hoja Usuarios).';
      }
    });
  }
  ordenarHojaUsuarios_(libro);
  mensaje += '\n\nSiguiente paso: Implementar → Nueva implementación → Aplicación web ' +
    '(Ejecutar como: Yo · Acceso: Cualquier persona) y pega la URL /exec en docs/config.js.';
  instalarTareas_();
  Logger.log(mensaje);
  return mensaje;
}

/** Deja la hoja Usuarios fácil de leer: esconde las columnas cifradas y resalta la contraseña temporal. */
function ordenarHojaUsuarios_(libro) {
  const h = libro.getSheetByName('Usuarios');
  const enc = ESQUEMA.Usuarios;
  ['hash', 'salt'].forEach(function (c) { h.hideColumns(enc.indexOf(c) + 1); });
  const col = enc.indexOf('passTemporal') + 1;
  h.getRange(1, col).setNote('Contraseña temporal para entregar a la persona. Se borra sola cuando crea la suya.');
  h.getRange(2, col, Math.max(h.getMaxRows() - 1, 1), 1).setBackground('#FBEFD9').setFontWeight('bold');
  h.getRange(1, enc.indexOf('passCambiada') + 1).setNote('Fecha y hora en que la persona creó su propia contraseña.');
}

/** Programa la actualización mensual de métricas (día 1, 6:00 a. m.). */
function instalarTareas_() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'tareaMensual'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('tareaMensual').timeBased().onMonthDay(1).atHour(6).create();
  return true;
}

function obtenerConfig_() {
  const p = props_();
  const cuentas = {};
  CUENTAS.forEach(function (a) { cuentas[a.k] = p.getProperty('META_' + a.k + '_ID') || ''; });
  let carpetaUrl = '';
  try { carpetaUrl = carpetaRaiz_().getUrl(); } catch (e) { /* sin acceso */ }
  return {
    notificar: p.getProperty('NOTIFICAR') !== 'no',
    hojaUrl: libro_().getUrl(),
    carpetaUrl: carpetaUrl,
    appUrl: p.getProperty('APP_URL') || '',
    apiUrl: ScriptApp.getService().getUrl() || '',
    meta: {
      version: metaVersion_(),
      cuentas: cuentas,
      tokenDel: !!p.getProperty('META_fbDel_TOKEN'),
      tokenDto: !!p.getProperty('META_fbDto_TOKEN')
    },
    gemini: { tieneClave: !!p.getProperty('GEMINI_KEY'), modelo: p.getProperty('GEMINI_MODELO') || 'gemini-2.5-flash' },
    tareaMensual: ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'tareaMensual'; }),
    version: APP.version
  };
}

/**
 * Guarda la configuración. Los campos secretos (tokens y claves) solo se
 * reemplazan si llegan con texto; para borrarlos se manda "BORRAR".
 */
function guardarConfig_(d, u) {
  const p = props_();
  if (d.notificar !== undefined) p.setProperty('NOTIFICAR', d.notificar ? 'si' : 'no');
  if (d.appUrl !== undefined) {
    const url = String(d.appUrl).trim();
    if (url && !/^https:\/\/[^\s]+$/.test(url)) throw new Error('El link de la app debe empezar con https://');
    p.setProperty('APP_URL', url);
  }
  if (d.metaVersion) {
    if (!/^v\d{2}\.\d$/.test(d.metaVersion)) throw new Error('La versión de Meta debe verse como v23.0');
    p.setProperty('META_VERSION', d.metaVersion);
  }
  if (d.cuentas) {
    CUENTAS.forEach(function (a) {
      if (d.cuentas[a.k] === undefined) return;
      const v = String(d.cuentas[a.k]).trim();
      if (v && !/^\d+$/.test(v)) throw new Error('El ID de ' + a.red + ' ' + a.pagina + ' debe ser solo números.');
      p.setProperty('META_' + a.k + '_ID', v);
    });
  }
  const secreto = function (clave, valor) {
    if (valor === undefined || valor === null || valor === '') return;
    if (valor === 'BORRAR') p.deleteProperty(clave); else p.setProperty(clave, String(valor).trim());
  };
  secreto('META_fbDel_TOKEN', d.tokenDel);
  secreto('META_fbDto_TOKEN', d.tokenDto);
  secreto('GEMINI_KEY', d.geminiKey);
  if (d.geminiModelo) p.setProperty('GEMINI_MODELO', String(d.geminiModelo).trim());
  log_(u, 'Cambió la configuración', '');
  return obtenerConfig_();
}
