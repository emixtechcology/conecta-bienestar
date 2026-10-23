/**
 * Métricas de Facebook e Instagram (Meta Graph API).
 * Se configuran desde el módulo Configuración:
 *   - ID de la página de Facebook y su token de página (Delegación y Delegado)
 *   - ID de la cuenta de Instagram profesional vinculada a cada página
 * El día 1 de cada mes una tarea automática guarda el mes anterior.
 * Si no hay acceso a Meta, el administrador puede capturar las cifras a mano.
 */

function metaVersion_() { return props_().getProperty('META_VERSION') || 'v23.0'; }

function metaCuenta_(k) {
  const p = props_();
  const pagina = k === 'fbDel' || k === 'igDel' ? 'fbDel' : 'fbDto';
  return { id: p.getProperty('META_' + k + '_ID') || '', token: p.getProperty('META_' + pagina + '_TOKEN') || '' };
}

function graph_(ruta, params, token) {
  const q = Object.keys(params || {}).map(function (k) { return k + '=' + encodeURIComponent(params[k]); });
  q.push('access_token=' + encodeURIComponent(token));
  return graphUrl_('https://graph.facebook.com/' + metaVersion_() + '/' + ruta + '?' + q.join('&'));
}

function graphUrl_(url) {
  const r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const j = JSON.parse(r.getContentText() || '{}');
  if (j.error) throw new Error('Meta: ' + (j.error.message || 'error desconocido'));
  return j;
}

/** Inicio y fin del mes en segundos Unix (hora de México). */
function rangoMes_(mes) {
  const ini = Utilities.parseDate(mes + '-01 00:00', zona_(), 'yyyy-MM-dd HH:mm');
  const p = mes.split('-').map(Number);
  const sig = p[1] === 12 ? (p[0] + 1) + '-01' : p[0] + '-' + ('0' + (p[1] + 1)).slice(-2);
  const fin = Utilities.parseDate(sig + '-01 00:00', zona_(), 'yyyy-MM-dd HH:mm');
  return { ini: Math.floor(ini.getTime() / 1000), fin: Math.floor(fin.getTime() / 1000), siguiente: sig };
}

function mesAnterior_(mes) {
  const p = mes.split('-').map(Number);
  return p[1] === 1 ? (p[0] - 1) + '-12' : p[0] + '-' + ('0' + (p[1] - 1)).slice(-2);
}

function metricasFacebook_(k, mes) {
  const c = metaCuenta_(k);
  const r = rangoMes_(mes);
  let j = graph_(c.id + '/posts', {
    since: r.ini, until: r.fin, limit: 50,
    fields: 'id,created_time,shares,reactions.summary(total_count).limit(0),comments.summary(total_count).limit(0)'
  }, c.token);
  const t = { reacciones: 0, comentarios: 0, compartidos: 0, publicaciones: 0 };
  let vueltas = 0;
  while (j && vueltas < 40) {
    (j.data || []).forEach(function (p) {
      t.publicaciones++;
      t.reacciones += (p.reactions && p.reactions.summary && p.reactions.summary.total_count) || 0;
      t.comentarios += (p.comments && p.comments.summary && p.comments.summary.total_count) || 0;
      t.compartidos += (p.shares && p.shares.count) || 0;
    });
    j = j.paging && j.paging.next ? graphUrl_(j.paging.next) : null;
    vueltas++;
  }
  const info = graph_(c.id, { fields: 'followers_count,fan_count' }, c.token);
  t.seguidores = info.followers_count || info.fan_count || 0;
  return t;
}

function metricasInstagram_(k, mes) {
  const c = metaCuenta_(k);
  const r = rangoMes_(mes);
  let j = graph_(c.id + '/media', { fields: 'id,timestamp,like_count,comments_count', limit: 50 }, c.token);
  const t = { reacciones: 0, comentarios: 0, compartidos: 0, publicaciones: 0 };
  const delMes = [];
  let vueltas = 0, seguir = true;
  while (j && seguir && vueltas < 40) {
    (j.data || []).forEach(function (m) {
      const ts = Math.floor(new Date(m.timestamp).getTime() / 1000);
      if (ts < r.ini) { seguir = false; return; }
      if (ts >= r.fin) return;
      t.publicaciones++;
      t.reacciones += m.like_count || 0;
      t.comentarios += m.comments_count || 0;
      delMes.push(m.id);
    });
    j = seguir && j.paging && j.paging.next ? graphUrl_(j.paging.next) : null;
    vueltas++;
  }
  // Compartidos: Instagram solo los da por publicación en "insights". Si no está disponible, se omite.
  for (let i = 0; i < delMes.length; i++) {
    try {
      const ins = graph_(delMes[i] + '/insights', { metric: 'shares' }, c.token);
      const v = ins.data && ins.data[0] && ins.data[0].values && ins.data[0].values[0];
      t.compartidos += (v && v.value) || (ins.data && ins.data[0] && ins.data[0].total_value && ins.data[0].total_value.value) || 0;
    } catch (e) { if (i === 0) break; }
  }
  const info = graph_(c.id, { fields: 'followers_count' }, c.token);
  t.seguidores = info.followers_count || 0;
  return t;
}

/** Guarda (o reemplaza) la fila de un mes y una cuenta. */
function guardarFilaMetrica_(mes, cuenta, t, fuente) {
  const previo = leer_('Metricas').filter(function (m) { return m.mes === mesAnterior_(mes) && m.cuenta === cuenta; })[0];
  const nuevos = previo && previo.seguidores !== '' && t.seguidores !== '' ? Number(t.seguidores) - Number(previo.seguidores) : '';
  eliminarDonde_('Metricas', function (m) { return m.mes === mes && m.cuenta === cuenta; });
  insertar_('Metricas', {
    id: nuevoId_('M'), mes: mes, cuenta: cuenta,
    interacciones: Number(t.reacciones || 0) + Number(t.comentarios || 0) + Number(t.compartidos || 0),
    reacciones: Number(t.reacciones || 0), comentarios: Number(t.comentarios || 0), compartidos: Number(t.compartidos || 0),
    publicaciones: t.publicaciones === '' ? '' : Number(t.publicaciones || 0),
    seguidores: t.seguidores === '' ? '' : Number(t.seguidores || 0),
    seguidoresNuevos: nuevos, fuente: fuente, capturado: ahora_()
  });
}

function actualizarMes_(mes, usuario) {
  const res = [];
  CUENTAS.forEach(function (a) {
    const c = metaCuenta_(a.k);
    if (!c.id || !c.token) { res.push({ cuenta: a.k, ok: false, error: 'Sin configurar' }); return; }
    try {
      const t = a.k.indexOf('fb') === 0 ? metricasFacebook_(a.k, mes) : metricasInstagram_(a.k, mes);
      guardarFilaMetrica_(mes, a.k, t, 'meta');
      res.push({ cuenta: a.k, ok: true });
    } catch (e) {
      res.push({ cuenta: a.k, ok: false, error: e.message });
    }
  });
  log_(usuario, 'Actualizó métricas', mes + ' · ' + res.filter(function (r) { return r.ok; }).length + ' de 4 cuentas');
  return res;
}

/** Botón "Actualizar ahora" del administrador. */
function actualizarMetricas_(d, u) {
  const mes = /^\d{4}-\d{2}$/.test(String(d.mes || '')) ? d.mes : Utilities.formatDate(new Date(), zona_(), 'yyyy-MM');
  return { mes: mes, cuentas: actualizarMes_(mes, u) };
}

/** Tarea automática: el día 1 guarda el mes que terminó. */
function tareaMensual() {
  const mes = mesAnterior_(Utilities.formatDate(new Date(), zona_(), 'yyyy-MM'));
  actualizarMes_(mes, null);
}

function guardarMetricaManual_(d, u) {
  if (!/^\d{4}-\d{2}$/.test(String(d.mes || ''))) throw new Error('Elige el mes.');
  if (!CUENTAS.some(function (a) { return a.k === d.cuenta; })) throw new Error('Elige la cuenta.');
  const num = function (v) { const n = Number(v); if (v === '' || v === null || v === undefined) return 0; if (!isFinite(n) || n < 0) throw new Error('Las cifras deben ser números positivos.'); return Math.round(n); };
  guardarFilaMetrica_(d.mes, d.cuenta, {
    reacciones: num(d.reacciones), comentarios: num(d.comentarios), compartidos: num(d.compartidos),
    publicaciones: d.publicaciones === '' ? '' : num(d.publicaciones),
    seguidores: d.seguidores === '' ? '' : num(d.seguidores)
  }, 'manual');
  log_(u, 'Capturó métricas a mano', d.mes + ' · ' + d.cuenta);
  return true;
}

function probarMeta_() {
  return CUENTAS.map(function (a) {
    const c = metaCuenta_(a.k);
    if (!c.id || !c.token) return { cuenta: a.k, ok: false, mensaje: 'Sin configurar' };
    try {
      const f = a.k.indexOf('fb') === 0 ? 'name,followers_count' : 'username,followers_count';
      const j = graph_(c.id, { fields: f }, c.token);
      return { cuenta: a.k, ok: true, mensaje: (j.name || '@' + j.username) + ' · ' + (j.followers_count || 0) + ' seguidores' };
    } catch (e) {
      return { cuenta: a.k, ok: false, mensaje: e.message };
    }
  });
}

/* ---------- Lectura para pantallas ---------- */
function resultados_() {
  const filas = leer_('Metricas').map(limpio_);
  const meses = filas.map(function (f) { return f.mes; })
    .filter(function (m, i, arr) { return arr.indexOf(m) === i; }).sort();
  return { meses: meses.slice(-12), filas: filas };
}

function totalesPorMes_(n) {
  const filas = leer_('Metricas');
  const meses = filas.map(function (f) { return f.mes; })
    .filter(function (m, i, arr) { return arr.indexOf(m) === i; }).sort().slice(-n);
  return meses.map(function (m) {
    return {
      mes: m,
      interacciones: filas.filter(function (f) { return f.mes === m; })
        .reduce(function (s, f) { return s + Number(f.interacciones || 0); }, 0)
    };
  });
}
