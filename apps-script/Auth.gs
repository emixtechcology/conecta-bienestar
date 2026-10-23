/**
 * Usuarios y sesiones.
 * Cada persona entra con su correo y su contraseña; el rol guardado en la
 * hoja Usuarios decide qué módulos ve y qué acciones puede hacer.
 * Las contraseñas se guardan cifradas (hash con sal), nunca en texto plano.
 */

const SESION_SEGUNDOS = 21600; // 6 horas (máximo que permite CacheService)
const INTENTOS_MAX = 5;

function hash_(pass, salt) {
  let h = salt + '|' + pass;
  for (let i = 0; i < 300; i++) {
    h = Utilities.base64Encode(
      Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + salt, Utilities.Charset.UTF_8));
  }
  return h;
}

function passTemporal_() {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let p = '';
  for (let i = 0; i < 10; i++) p += letras.charAt(Math.floor(Math.random() * letras.length));
  return p;
}

function usuarioPublico_(u) {
  return { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, cambiar: bool_(u.cambiar) };
}

function login_(d) {
  const email = String(d.email || '').trim().toLowerCase();
  const pass = String(d.pass || '');
  if (!email || !pass) throw new Error('Escribe tu correo y tu contraseña.');

  const cache = CacheService.getScriptCache();
  const claveIntentos = 'int_' + email;
  const intentos = Number(cache.get(claveIntentos) || 0);
  if (intentos >= INTENTOS_MAX) throw new Error('Demasiados intentos. Espera 10 minutos y vuelve a intentar.');

  const u = leer_('Usuarios').filter(function (x) { return String(x.email).toLowerCase() === email; })[0];
  if (!u || !bool_(u.activo) || hash_(pass, u.salt) !== u.hash) {
    cache.put(claveIntentos, String(intentos + 1), 600);
    throw new Error('Correo o contraseña incorrectos.');
  }
  cache.remove(claveIntentos);

  const token = Utilities.getUuid() + Utilities.getUuid().slice(0, 8);
  cache.put('s_' + token, u.id, SESION_SEGUNDOS);
  actualizar_('Usuarios', u.id, { ultimoAcceso: ahora_() });
  log_(u, 'Inició sesión', '');
  return { token: token, usuario: usuarioPublico_(u) };
}

/** Devuelve el usuario dueño del token o lanza error si la sesión venció. */
function sesion_(token) {
  if (!token) throw new Error('SESION: Inicia sesión para continuar.');
  const cache = CacheService.getScriptCache();
  const id = cache.get('s_' + token);
  if (!id) throw new Error('SESION: Tu sesión terminó. Vuelve a entrar.');
  const u = buscar_('Usuarios', id);
  if (!u || !bool_(u.activo)) throw new Error('SESION: Tu usuario está desactivado.');
  cache.put('s_' + token, id, SESION_SEGUNDOS); // renueva mientras se usa
  return u;
}

function logout_(d, u, token) {
  CacheService.getScriptCache().remove('s_' + token);
  return true;
}

function yo_(d, u) { return usuarioPublico_(u); }

function cambiarPass_(d, u) {
  const nueva = String(d.nueva || '');
  if (!bool_(u.cambiar) && hash_(String(d.actual || ''), u.salt) !== u.hash) {
    throw new Error('La contraseña actual no es correcta.');
  }
  if (nueva.length < 8) throw new Error('La contraseña nueva debe tener al menos 8 caracteres.');
  const salt = Utilities.getUuid();
  actualizar_('Usuarios', u.id, {
    hash: hash_(nueva, salt), salt: salt, cambiar: false, passTemporal: '', passCambiada: ahora_()
  });
  log_(u, 'Cambió su contraseña', '');
  return true;
}

/* ---------- Administración de usuarios ---------- */

function listarUsuarios_() {
  return leer_('Usuarios').map(function (u) {
    const c = limpio_(u);
    c.activo = bool_(u.activo); c.cambiar = bool_(u.cambiar);
    return c;
  });
}

function validarRol_(rol) {
  if ([ROLES.ADMIN, ROLES.CAPTURISTA, ROLES.APROBADOR].indexOf(rol) === -1) throw new Error('Rol no válido.');
}

function crearUsuario_(d, admin) {
  const nombre = String(d.nombre || '').trim();
  const email = String(d.email || '').trim().toLowerCase();
  validarRol_(d.rol);
  if (!nombre) throw new Error('Escribe el nombre.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('El correo no es válido.');
  if (leer_('Usuarios').some(function (x) { return String(x.email).toLowerCase() === email; })) {
    throw new Error('Ya existe un usuario con ese correo.');
  }
  const temporal = passTemporal_();
  const salt = Utilities.getUuid();
  const u = insertar_('Usuarios', {
    id: nuevoId_('U'), nombre: nombre, email: email, rol: d.rol,
    hash: hash_(temporal, salt), salt: salt, activo: true, cambiar: true, creado: ahora_(), ultimoAcceso: '',
    passTemporal: temporal, passCambiada: ''
  });
  log_(admin, 'Creó usuario', nombre + ' (' + d.rol + ')');
  return { usuario: usuarioPublico_(u), temporal: temporal };
}

function adminsActivos_() {
  return leer_('Usuarios').filter(function (x) { return x.rol === ROLES.ADMIN && bool_(x.activo); });
}

function actualizarUsuario_(d, admin) {
  const u = buscar_('Usuarios', d.id);
  if (!u) throw new Error('No se encontró el usuario.');
  const cambios = {};
  if (d.nombre !== undefined) cambios.nombre = String(d.nombre).trim();
  if (d.rol !== undefined) { validarRol_(d.rol); cambios.rol = d.rol; }
  if (d.activo !== undefined) cambios.activo = !!d.activo;

  const dejaDeSerAdmin = u.rol === ROLES.ADMIN && bool_(u.activo) &&
    ((cambios.rol && cambios.rol !== ROLES.ADMIN) || cambios.activo === false);
  if (dejaDeSerAdmin && adminsActivos_().length <= 1) {
    throw new Error('Debe quedar al menos un administrador activo.');
  }
  actualizar_('Usuarios', u.id, cambios);
  log_(admin, 'Actualizó usuario', u.nombre);
  return true;
}

function resetPass_(d, admin) {
  const u = buscar_('Usuarios', d.id);
  if (!u) throw new Error('No se encontró el usuario.');
  const temporal = passTemporal_();
  const salt = Utilities.getUuid();
  actualizar_('Usuarios', u.id, { hash: hash_(temporal, salt), salt: salt, cambiar: true, passTemporal: temporal, passCambiada: '' });
  log_(admin, 'Restableció contraseña', u.nombre);
  return { temporal: temporal };
}

function correosPorRol_(rol) {
  return leer_('Usuarios')
    .filter(function (x) { return x.rol === rol && bool_(x.activo) && x.email; })
    .map(function (x) { return x.email; });
}
