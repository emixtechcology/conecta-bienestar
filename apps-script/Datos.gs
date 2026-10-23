/**
 * Capa de datos sobre Google Sheets.
 * Cada hoja es una tabla; la primera fila son los encabezados
 * y la columna "id" identifica cada registro.
 */

const ESQUEMA = {
  Usuarios: ['id', 'nombre', 'email', 'rol', 'hash', 'salt', 'activo', 'cambiar', 'creado', 'ultimoAcceso',
    'passTemporal', 'passCambiada'],
  Contenidos: ['id', 'tema', 'tipo', 'fecha', 'hora',
    'dest_fbDel', 'dest_igDel', 'dest_fbDto', 'dest_igDto',
    'copy', 'archivoId', 'archivoNombre', 'archivoMime',
    'estado', 'autorId', 'autorNombre', 'motivo',
    'link_fbDel', 'link_igDel', 'link_fbDto', 'link_igDto', 'mensaje',
    'creado', 'actualizado', 'revisadoPor', 'revisadoEn'],
  Metricas: ['id', 'mes', 'cuenta', 'interacciones', 'reacciones', 'comentarios', 'compartidos',
    'publicaciones', 'seguidores', 'seguidoresNuevos', 'fuente', 'capturado'],
  Bitacora: ['id', 'fecha', 'usuario', 'rol', 'accion', 'detalle']
};

/** Columnas que deben guardarse como texto para que Sheets no las convierta. */
const COLUMNAS_TEXTO = {
  Usuarios: ['creado', 'ultimoAcceso', 'passTemporal', 'passCambiada'],
  Contenidos: ['fecha', 'hora', 'creado', 'actualizado', 'revisadoEn'],
  Metricas: ['mes', 'capturado'],
  Bitacora: ['fecha']
};

const CUENTAS = [
  { k: 'fbDel', pagina: 'Delegación', red: 'Facebook' },
  { k: 'igDel', pagina: 'Delegación', red: 'Instagram' },
  { k: 'fbDto', pagina: 'Delegado',   red: 'Facebook' },
  { k: 'igDto', pagina: 'Delegado',   red: 'Instagram' }
];

const ESTADOS = {
  BORRADOR: 'Borrador', REVISION: 'En revisión', PROGRAMADO: 'Programado',
  PUBLICADO: 'Publicado', RECHAZADO: 'Rechazado'
};

function props_() { return PropertiesService.getScriptProperties(); }

function libro_() {
  const id = props_().getProperty('SS_ID');
  if (id) return SpreadsheetApp.openById(id);
  const activo = SpreadsheetApp.getActiveSpreadsheet();
  if (!activo) throw new Error('El sistema no está instalado. Ejecuta la función instalar() desde el editor.');
  return activo;
}

function hoja_(nombre) {
  const h = libro_().getSheetByName(nombre);
  if (!h) throw new Error('Falta la hoja "' + nombre + '". Ejecuta instalar() otra vez.');
  return h;
}

function zona_() { return Session.getScriptTimeZone() || 'America/Mexico_City'; }
function ahora_() { return Utilities.formatDate(new Date(), zona_(), 'yyyy-MM-dd HH:mm'); }
function hoy_() { return Utilities.formatDate(new Date(), zona_(), 'yyyy-MM-dd'); }
function nuevoId_(prefijo) {
  return (prefijo || '') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Convierte una celda a valor simple (las fechas pasan a texto). */
function celda_(v, columna) {
  if (v instanceof Date) {
    if (columna === 'hora') return Utilities.formatDate(v, zona_(), 'HH:mm');
    if (columna === 'fecha') return Utilities.formatDate(v, zona_(), 'yyyy-MM-dd');
    if (columna === 'mes') return Utilities.formatDate(v, zona_(), 'yyyy-MM');
    return Utilities.formatDate(v, zona_(), 'yyyy-MM-dd HH:mm');
  }
  return v;
}

/** Lee toda la hoja como lista de objetos. Cada objeto trae _fila (número de fila). */
function leer_(nombre) {
  const h = hoja_(nombre);
  const valores = h.getDataRange().getValues();
  if (valores.length < 2) return [];
  const enc = valores[0];
  const lista = [];
  for (let i = 1; i < valores.length; i++) {
    const fila = valores[i];
    if (fila[0] === '' || fila[0] === null) continue;
    const o = { _fila: i + 1 };
    enc.forEach(function (c, j) { o[c] = celda_(fila[j], c); });
    lista.push(o);
  }
  return lista;
}

function buscar_(nombre, id) {
  const r = leer_(nombre).filter(function (o) { return String(o.id) === String(id); })[0];
  return r || null;
}

function filaDesde_(nombre, obj) {
  return ESQUEMA[nombre].map(function (c) { return obj[c] === undefined ? '' : obj[c]; });
}

/** Marca como texto las columnas de fecha/hora de una fila antes de escribirla. */
function formatoTexto_(h, nombre, fila) {
  const enc = ESQUEMA[nombre];
  (COLUMNAS_TEXTO[nombre] || []).forEach(function (col) {
    h.getRange(fila, enc.indexOf(col) + 1).setNumberFormat('@');
  });
}

function insertar_(nombre, obj) {
  if (!obj.id) obj.id = nuevoId_();
  const h = hoja_(nombre);
  const fila = h.getLastRow() + 1;
  formatoTexto_(h, nombre, fila);
  h.getRange(fila, 1, 1, ESQUEMA[nombre].length).setValues([filaDesde_(nombre, obj)]);
  return obj;
}

/** Actualiza solo las columnas indicadas en "cambios". */
function actualizar_(nombre, id, cambios) {
  const actual = buscar_(nombre, id);
  if (!actual) throw new Error('No se encontró el registro.');
  const h = hoja_(nombre);
  const enc = ESQUEMA[nombre];
  const fila = enc.map(function (c) {
    if (Object.prototype.hasOwnProperty.call(cambios, c)) return cambios[c];
    return actual[c] === undefined ? '' : actual[c];
  });
  formatoTexto_(h, nombre, actual._fila);
  h.getRange(actual._fila, 1, 1, enc.length).setValues([fila]);
  return Object.assign({}, actual, cambios);
}

function eliminarFila_(nombre, id) {
  const actual = buscar_(nombre, id);
  if (actual) hoja_(nombre).deleteRow(actual._fila);
}

/** Borra varias filas de abajo hacia arriba (para no mover los índices). */
function eliminarDonde_(nombre, condicion) {
  const h = hoja_(nombre);
  const filas = leer_(nombre).filter(condicion).map(function (o) { return o._fila; });
  filas.sort(function (a, b) { return b - a; }).forEach(function (f) { h.deleteRow(f); });
}

/** Registra en la bitácora quién hizo qué. */
function log_(usuario, accion, detalle) {
  try {
    insertar_('Bitacora', {
      id: nuevoId_('B'),
      fecha: ahora_(),
      usuario: usuario ? usuario.nombre : 'Sistema',
      rol: usuario ? usuario.rol : '',
      accion: accion,
      detalle: detalle || ''
    });
  } catch (e) { /* la bitácora nunca debe frenar una operación */ }
}

function listarBitacora_(d) {
  const n = Math.min(Number(d.limite) || 60, 300);
  return leer_('Bitacora').slice(-n).reverse().map(limpio_);
}

/** Quita campos internos antes de mandar al navegador. */
function limpio_(o) {
  const c = Object.assign({}, o);
  delete c._fila; delete c.hash; delete c.salt; delete c.passTemporal;
  return c;
}

function bool_(v) { return v === true || v === 'TRUE' || v === 'true' || v === 1; }
