# Bienestar Conecta

Sistema de Comunicación Social para la Delegación de Programas para el Bienestar en Tabasco.
Parrilla de contenidos, subida de videos, aprobaciones, links de publicación con mensaje por IA y
resultados mensuales de Facebook e Instagram.

**Todo se instala y se actualiza desde el navegador.** No hay que instalar programas en la computadora.

## Cómo está armado

```
 Equipo (PC o celular)
        │  abre
        ▼
 GitHub Pages ─ la app: pantallas, diseño, menú         (carpeta docs)
        │  manda cada acción por internet
        ▼
 Apps Script ─ el servidor: permisos, reglas, cálculos   (carpeta apps-script)
        │
        ├── Google Sheets: la base de datos
        └── Google Drive: videos e imágenes
```

- **El link que usa el equipo es el de GitHub Pages**, por ejemplo
  `https://tuusuario.github.io/bienestar-conecta/`. Se puede instalar en el celular como app.
- **Apps Script** no se abre directamente: solo recibe y responde las peticiones de la app.
- Todo es gratis, no depende de una computadora encendida y no necesita Google Cloud Console.

## Qué hace cada rol

| Rol | Módulos | Puede |
|---|---|---|
| **Administrador** | Todos | Usuarios, configuración, conexión con Meta, aprobar o rechazar, todo lo demás |
| **Capturista** | Inicio, Parrilla, Agenda, Subir contenido, Links | Subir y editar lo suyo, eliminar lo suyo, capturar links, generar el mensaje, agendar eventos |
| **Aprobador** | Inicio, Parrilla, Agenda, Aprobaciones, Resultados | Aprobar o rechazar (con motivo), ver resultados, agendar eventos |

Todos entran por el mismo link con su correo y contraseña, y cada quien ve solo lo de su rol.

**Flujo de un contenido:** Borrador → En revisión → Programado → Publicado.

- **Con que un aprobador lo apruebe, queda programado.** El sistema guarda quién lo aprobó y cuándo,
  y lo muestra en la Parrilla, en Aprobaciones, en Inicio y en el correo que recibe quien lo subió.
- Si lo rechaza, pasa a *Rechazado* y regresa a quien lo subió con el motivo y el nombre de quien lo rechazó.
- Si otro aprobador intenta revisarlo después, el sistema le avisa quién ya lo revisó.
- Al guardar el primer link de una publicación programada, pasa a *Publicado*.

## Agenda de eventos y coberturas

Para los eventos del delegado o de la Delegación donde hay que ir a recoger contenido.

- **Cualquier usuario** agenda un evento: nombre, tipo, fecha, hora de inicio y término, municipio, lugar,
  qué hay que recoger (fotos, video, entrevista, transmisión en vivo, testimonios, dron), contacto y notas.
- Se **asigna a una o varias personas**. A cada una le llega un correo y lo ve en su Inicio con la etiqueta *Te toca*.
- **Recordatorio diario a las 7:00**: cada persona recibe por correo sus coberturas del día.
- Desde el evento, **Crear publicación** abre *Subir contenido* con el tema, la fecha y las páginas ya llenos.
  Al enviarla, la publicación queda ligada al evento y este se marca como *Cubierto*.
- Estados: *Pendiente → Cubierto · No se cubrió · Cancelado* (los dos últimos piden el motivo).
- Editar, cancelar o eliminar: quien lo agendó o el administrador. Marcar cubierto: también las personas asignadas.
- Filtros: *Todos*, *Mis coberturas* y *Sin asignar*. Aparece también en **Inicio** y en la **Vista completa TV** (*Eventos de hoy*).

---

## Instalación

### Parte 1 · El servidor (Apps Script + Sheets)

1. Con la cuenta que será dueña del sistema, **crea una hoja de cálculo nueva** en Google Drive.
   Llámala, por ejemplo, *Bienestar Conecta – Base de datos*.
2. En la hoja abre **Extensiones → Apps Script**.
3. En el editor crea un archivo de **Script** por cada archivo de la carpeta `apps-script`
   (botón ＋ → Script) con estos nombres, y pega su contenido:
   `Codigo`, `Datos`, `Auth`, `Contenidos`, `Agenda`, `Archivos`, `Meta`, `IA`, `Config`.
   Borra el `Código.gs` que viene de ejemplo.
4. Ve a ⚙️ **Configuración del proyecto** → activa *Mostrar el archivo de manifiesto "appsscript.json"*.
   Regresa al editor, abre `appsscript.json` y reemplaza su contenido con el de `apps-script/appsscript.json`.
5. Arriba elige la función **`instalar`** y presiona **Ejecutar**. Acepta los permisos
   (hojas, Drive, correo, conexiones externas y tareas programadas).
6. En el **Registro de ejecución** aparecen tu **correo de administrador y una contraseña temporal**. Guárdalos.
7. Publica el servidor: **Implementar → Nueva implementación → ⚙️ Tipo: Aplicación web**.
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier persona**
   - Presiona *Implementar* y **copia la URL**. Termina en `/exec`.

> "Cualquier persona" es necesario para que la app de GitHub Pages pueda hablar con el servidor.
> Nadie puede ver ni cambiar datos sin iniciar sesión: cada acción exige una sesión válida y revisa el rol.
> Si abres esa URL en el navegador solo verás un mensaje de "Servidor en línea".

### Parte 2 · La app (GitHub Pages)

1. Entra a <https://github.com> (crea una cuenta gratis si no tienes) y presiona **New** para crear un repositorio.
   - *Repository name:* `bienestar-conecta`
   - Déjalo **Public** (GitHub Pages gratis lo requiere; ahí solo van pantallas y código,
     nunca datos, contraseñas ni tokens).
   - Presiona **Create repository**.
2. En el repositorio nuevo presiona **uploading an existing file** (o **Add file → Upload files**).
3. Desde tu computadora **arrastra las carpetas `docs` y `apps-script` y el archivo `README.md`**
   (descomprime el zip primero). Abajo presiona **Commit changes**.
4. Pega la URL del servidor: abre `docs/config.js` en GitHub → ✏️ **Edit** → reemplaza
   `PEGA_AQUI_LA_URL_DE_APPS_SCRIPT/exec` por la URL de la Parte 1, paso 7:
   ```js
   API_URL: 'https://script.google.com/macros/s/XXXXXXXX/exec'
   ```
   Presiona **Commit changes**.
5. Activa la página: **Settings → Pages → Build and deployment**
   - *Source:* **Deploy from a branch**
   - *Branch:* **main** y carpeta **/docs** → **Save**
6. En uno o dos minutos GitHub muestra arriba el link:
   `https://TU-USUARIO.github.io/bienestar-conecta/`. **Ese es el link del sistema.**
7. Ábrelo, entra con tu correo y la contraseña temporal, y crea tu contraseña definitiva.
8. Entra una vez a **Configuración**: el sistema guarda el link de GitHub Pages para que
   los correos de aviso lleven a la app.

### Dar de alta al equipo

En **Equipo → Agregar persona** registra a los 3 capturistas y los 3 aprobadores.
Al crear a cada uno, el sistema muestra una contraseña temporal y un botón que copia
el acceso completo (link, correo y contraseña) para mandárselo por WhatsApp.
Cada quien la cambia en su primer ingreso.
Si alguien olvida su contraseña: **Equipo → Restablecer contraseña**.

### Vista completa TV

Para dejar el tablero en una TV o monitor de la oficina: en **Inicio → Vista completa TV**
(en el celular está en el menú ☰).

- Ocupa toda la pantalla y **se actualiza sola cada 2 minutos**; el reloj corre en vivo.
- Muestra lo que sale **hoy** (con la publicación **siguiente** resaltada y avisos de lo que ya debió salir),
  lo **por aprobar**, los **próximos días**, la gráfica de **interacciones por mes** y el avance de **links capturados**.
- Todo cabe en una sola pantalla, sin desplazarse; si hay más filas de las que caben, indica "y N más".
- Mantiene la pantalla encendida (en navegadores que lo permiten) y esconde el cursor si no se mueve el mouse.
- Para salir: botón **Salir** o tecla **Esc**.
- Conviene abrirla con un usuario **Aprobador** o **Administrador** en la computadora conectada a la TV.
  La sesión se mantiene mientras la vista siga abierta.

### Instalar en el celular

- **Android (Chrome):** abre el link → menú ⋮ → **Instalar app** o **Agregar a pantalla principal**.
- **iPhone (Safari):** abre el link → botón **Compartir** → **Agregar a inicio**.

Queda como ícono y se abre a pantalla completa, sin barra del navegador.

---

## Cómo publicar cambios

| Cambias… | Qué hacer |
|---|---|
| Pantallas o diseño (carpeta `docs`) | En GitHub abre el archivo → ✏️ **Edit** → pega el cambio → **Commit changes**. O usa **Add file → Upload files** y sube el archivo nuevo con el mismo nombre. La app se actualiza sola en 1 o 2 minutos. |
| Servidor (carpeta `apps-script`) | En el editor de Apps Script pega el cambio y guarda. Luego **Implementar → Administrar implementaciones → ✏️ Editar → Versión: Nueva versión → Implementar**. Así la URL `/exec` no cambia. Sube también el archivo a GitHub para que quede el respaldo. |

Si alguna vez creas una implementación **nueva** en lugar de editar la existente, la URL cambia:
pégala otra vez en `docs/config.js`.

---

## Conectar Facebook e Instagram (métricas)

Las métricas se guardan solas **el día 1 de cada mes a las 6:00** (el mes que terminó).
También se pueden actualizar desde **Configuración → Actualizar métricas ahora**,
o capturar a mano en **Configuración → Capturar métricas a mano**.

Para la conexión automática necesitas, de cada página (Delegación y Delegado):

- **ID de la página de Facebook**
- **ID de la cuenta de Instagram profesional** vinculada a esa página
- **Token de acceso de la página** (sirve para Facebook y para su Instagram)

Cómo obtenerlos (se hace en Meta, no en Google):

1. Entra a <https://developers.facebook.com> y crea una app de tipo **Empresa** con la cuenta que administra las páginas.
2. Abre el **Explorador de la API Graph**, elige tu app y pide un token de usuario con los permisos
   `pages_show_list`, `pages_read_engagement`, `read_insights`, `instagram_basic` e `instagram_manage_insights`.
3. Cambia ese token por uno de **larga duración** (Herramientas → Depurador de tokens de acceso → *Extender*).
4. Con el token largo consulta `me/accounts`: ahí aparece cada página con su **id** y su **access_token**.
   Ese token de página no caduca mientras sigas siendo administrador de la página.
5. Para el Instagram de cada página consulta `ID_DE_LA_PAGINA?fields=instagram_business_account`.
6. Pega los IDs y los tokens en **Configuración → Conexión con Meta**, guarda y usa **Probar conexión**.

Los tokens se guardan en el servidor, nunca en GitHub ni en la app.

Qué se mide por cuenta y por mes: publicaciones, reacciones (en Instagram, "me gusta"),
comentarios, compartidos, interacciones (la suma), seguidores al cierre y seguidores nuevos
(comparado con el mes anterior). En Instagram, los compartidos solo se cuentan si Meta los da
para esa publicación.

## Inteligencia artificial (opcional)

El mensaje siempre lleva **solo el tema y los links donde se publicó**. Los links los pone el
sistema tal como se capturaron; la IA solo redacta la línea del tema.

- **Con IA:** crea una clave gratuita en <https://aistudio.google.com/apikey> y pégala en
  **Configuración → Inteligencia artificial**.
- **Sin IA:** el botón *Armar sin IA* (o la IA sin clave) usa el tema tal cual se escribió.

Formato del mensaje:
```
*Tema:* Entrega de la Pensión para Adultos Mayores en Centla

Facebook Delegación: https://www.facebook.com/...
Instagram Delegación: https://www.instagram.com/...
```

---

## Dónde queda cada cosa

**Hoja de cálculo** (no editar a mano salvo para revisar):

| Hoja | Contenido |
|---|---|
| Usuarios | Personas, rol, si está activa (las contraseñas van cifradas) |
| Contenidos | Cada publicación: tema, fecha, hora, dónde se publica, archivo, estado, quién lo revisó, links y mensaje |
| Agenda | Eventos, quién los cubre, qué se necesita y su estado |
| Metricas | Una fila por mes y cuenta |
| Bitacora | Quién hizo qué y cuándo |

**Drive:** carpeta *Bienestar Conecta · Contenidos*, con una subcarpeta por mes.
Los archivos se comparten como "cualquiera con el link puede ver" para que la vista previa
funcione dentro de la app. Al eliminar un contenido, su archivo va a la papelera de Drive
(se recupera durante 30 días).

## Límites a considerar

- **Espacio:** los videos ocupan el Drive de la cuenta dueña (15 GB en cuentas gratuitas).
  Conviene usar una cuenta con más espacio o limpiar meses viejos.
- **Tamaño por archivo:** hasta 1 GB. Se sube en partes de 4 MB con barra de avance; con
  internet lento un video grande puede tardar varios minutos. No cierres la pantalla mientras sube.
- **Correos de aviso:** Google permite unos 100 al día en cuentas gratuitas. Se pueden apagar en Configuración.
- **Sesión:** dura 6 horas sin uso; después hay que volver a entrar.

## Archivos del proyecto

```
docs/                  La app (GitHub Pages)
  index.html           Estructura de la página
  estilos.css          Diseño (PC y teléfono, modo claro y oscuro)
  app.js               Lógica de las pantallas
  config.js            URL del servidor  ← lo único que se edita al instalar
  manifest.webmanifest Datos para instalarla como app
  sw.js                Permite instalarla y abrirla con red lenta
  iconos/              Ícono de la app

apps-script/           El servidor (se copia al editor de Apps Script)
  appsscript.json      Zona horaria, permisos y modo de publicación
  Codigo.gs            Recibe las peticiones y revisa permisos por rol
  Datos.gs             Lectura y escritura en las hojas, bitácora
  Auth.gs              Inicio de sesión, contraseñas y usuarios
  Contenidos.gs        Parrilla, aprobaciones, links y avisos por correo
  Agenda.gs            Agenda de eventos, coberturas y recordatorio diario
  Archivos.gs          Subida por partes a Drive
  Meta.gs              Métricas de Facebook e Instagram
  IA.gs                Mensaje con tema y links
  Config.gs            instalar(), tarea mensual y configuración
```
