/**
 * Mensaje con IA: "Tema" + solo los links donde se publicó.
 * La IA (Gemini) solo redacta la línea del tema; los links los pone el sistema
 * tal cual se capturaron, para que nunca se cambie o invente uno.
 * Si no hay clave de Gemini o falla, se arma el mensaje con el tema escrito.
 */

function lineasLinks_(c) {
  return CUENTAS
    .filter(function (a) { return bool_(c['dest_' + a.k]) && c['link_' + a.k]; })
    .map(function (a) { return a.red + ' ' + a.pagina + ': ' + c['link_' + a.k]; });
}

function armarMensaje_(tema, lineas) {
  return '*Tema:* ' + String(tema).trim() + '\n\n' + lineas.join('\n');
}

function temaConIA_(tema) {
  const clave = props_().getProperty('GEMINI_KEY');
  if (!clave) return null;
  const modelo = props_().getProperty('GEMINI_MODELO') || 'gemini-2.5-flash';
  const prompt =
    'Eres del área de Comunicación Social de la Delegación de Programas para el Bienestar en Tabasco. ' +
    'Reescribe este tema de publicación en una sola línea clara e institucional, de máximo 15 palabras, ' +
    'sin emojis, sin hashtags, sin comillas y sin punto final. Conserva nombres de programas y municipios. ' +
    'Responde solo con la línea.\n\nTema: ' + tema;
  const r = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + modelo + ':generateContent', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': clave },
    payload: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 120 }
    }),
    muteHttpExceptions: true
  });
  if (r.getResponseCode() !== 200) return null;
  const j = JSON.parse(r.getContentText());
  const txt = j.candidates && j.candidates[0] && j.candidates[0].content &&
    j.candidates[0].content.parts && j.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('');
  if (!txt) return null;
  const linea = txt.split('\n').map(function (s) { return s.trim(); }).filter(Boolean)[0] || '';
  const limpia = linea.replace(/^\*?tema:?\*?\s*/i, '').replace(/^["'«]|["'»]$/g, '').trim();
  return limpia && limpia.length <= 160 ? limpia : null;
}

function generarMensaje_(d, u) {
  const c = buscar_('Contenidos', d.id);
  if (!c) throw new Error('No se encontró el contenido.');
  const lineas = lineasLinks_(c);
  if (!lineas.length) throw new Error('Guarda al menos un link antes de generar el mensaje.');

  let tema = c.tema, ia = false, aviso = '';
  if (d.conIA) {
    try {
      const t = temaConIA_(c.tema);
      if (t) { tema = t; ia = true; }
      else aviso = props_().getProperty('GEMINI_KEY')
        ? 'La IA no respondió; se usó el tema tal cual.'
        : 'No hay clave de IA configurada; se usó el tema tal cual.';
    } catch (e) { aviso = 'La IA no respondió; se usó el tema tal cual.'; }
  }
  const mensaje = armarMensaje_(tema, lineas);
  actualizar_('Contenidos', c.id, { mensaje: mensaje, actualizado: ahora_() });
  log_(u, 'Generó mensaje', c.tema);
  return { mensaje: mensaje, ia: ia, aviso: aviso };
}
