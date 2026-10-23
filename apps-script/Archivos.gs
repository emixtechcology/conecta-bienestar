/**
 * Subida de videos e imágenes a Drive por partes.
 * El navegador corta el archivo en pedazos de 4 MB y los manda uno por uno;
 * el servidor los va pasando a una "subida reanudable" de Drive.
 * Así se pueden subir videos pesados sin el límite de una sola llamada.
 */

const MB = 1024 * 1024;
const TAMANO_MAX = 1024 * MB; // 1 GB por archivo
const TIPOS_PERMITIDOS = /^(video|image)\//;

/** Carpeta raíz del sistema en Drive (se crea en instalar()). */
function carpetaRaiz_() {
  const id = props_().getProperty('CARPETA_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) { /* se borró: se crea otra */ }
  }
  const c = DriveApp.createFolder(APP.nombre + ' · Contenidos');
  props_().setProperty('CARPETA_ID', c.getId());
  return c;
}

/** Subcarpeta del mes (ej. 2026-10) para mantener orden. */
function carpetaMes_() {
  const raiz = carpetaRaiz_();
  const nombre = Utilities.formatDate(new Date(), zona_(), 'yyyy-MM');
  const it = raiz.getFoldersByName(nombre);
  return it.hasNext() ? it.next() : raiz.createFolder(nombre);
}

function iniciarSubida_(d, u) {
  const nombre = String(d.nombre || 'archivo').replace(/[\\/:*?"<>|]/g, '_').slice(0, 150);
  const mime = String(d.mime || '');
  const tamano = Number(d.tamano || 0);
  if (!TIPOS_PERMITIDOS.test(mime)) throw new Error('Solo se pueden subir videos o imágenes.');
  if (!tamano || tamano > TAMANO_MAX) throw new Error('El archivo pesa más de 1 GB.');

  const carpeta = carpetaMes_();
  const resp = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true', {
    method: 'post',
    contentType: 'application/json; charset=UTF-8',
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
      'X-Upload-Content-Type': mime,
      'X-Upload-Content-Length': String(tamano)
    },
    payload: JSON.stringify({ name: nombre, parents: [carpeta.getId()] }),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) {
    throw new Error('Drive no aceptó la subida (' + resp.getResponseCode() + '). Intenta de nuevo.');
  }
  const h = resp.getAllHeaders();
  const sesion = h.Location || h.location;
  if (!sesion) throw new Error('Drive no devolvió la sesión de subida.');

  const subidaId = Utilities.getUuid();
  CacheService.getScriptCache().put('up_' + subidaId,
    JSON.stringify({ sesion: sesion, tamano: tamano, usuario: u.id, nombre: nombre, mime: mime }), 21600);
  return { subidaId: subidaId, parte: 4 * MB }; // múltiplo de 256 KB, como pide Drive
}

function subirParte_(d, u) {
  const cache = CacheService.getScriptCache();
  const raw = cache.get('up_' + d.subidaId);
  if (!raw) throw new Error('La subida expiró. Vuelve a elegir el archivo.');
  const info = JSON.parse(raw);
  if (info.usuario !== u.id) throw new Error('Esta subida no es tuya.');

  const bytes = Utilities.base64Decode(String(d.datos || ''));
  const inicio = Number(d.inicio);
  const fin = inicio + bytes.length - 1;
  if (!bytes.length || fin >= info.tamano) throw new Error('La parte del archivo no es válida.');

  const resp = UrlFetchApp.fetch(info.sesion, {
    method: 'put',
    contentType: info.mime,
    headers: { 'Content-Range': 'bytes ' + inicio + '-' + fin + '/' + info.tamano },
    payload: bytes,
    followRedirects: false, // Drive responde 308 para "sigue mandando"
    muteHttpExceptions: true
  });
  const code = resp.getResponseCode();

  if (code === 308) return { listo: false, recibido: fin + 1 };
  if (code === 200 || code === 201) {
    const archivo = JSON.parse(resp.getContentText());
    cache.remove('up_' + d.subidaId);
    try {
      // Permite verlo en la vista previa del sistema con el link (solo lectura).
      DriveApp.getFileById(archivo.id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) { /* algunas cuentas no permiten compartir por link: se verá con la cuenta de Google */ }
    log_(u, 'Subió archivo', info.nombre);
    return { listo: true, archivo: { id: archivo.id, nombre: info.nombre, mime: info.mime } };
  }
  throw new Error('Falló una parte de la subida (' + code + '). Intenta de nuevo.');
}

/** Manda un archivo a la papelera de Drive (se puede recuperar 30 días). */
function papelera_(archivoId) {
  try { DriveApp.getFileById(archivoId).setTrashed(true); } catch (e) { /* ya no existe */ }
}
