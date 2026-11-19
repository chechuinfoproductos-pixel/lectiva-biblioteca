# Lectiva 1.1 — Biblioteca comunitaria con panel editorial

## Qué se entrega
Sitio estático Lectiva con logotipo original y un **panel externo Pages CMS** preparado para gestionar fichas, portadas y PDF mediante GitHub. Sin Supabase, sin claves en navegador y sin registro de lectores.

**No basta subir el ZIP a Netlify Drop para activar el panel.** El panel requiere GitHub + Pages CMS + despliegue Netlify conectado al repositorio. El enlace «Administrar» abre Pages CMS, donde debes iniciar sesión y seleccionar tu repositorio.

## Activar la administración (una sola vez)
1. Crea un repositorio en GitHub (puede ser privado) y sube el **contenido de esta carpeta**, incluida `.pages.yml`, `content`, `media` y `scripts`. No subas el ZIP como un único archivo.
2. En Netlify, crea o vincula el sitio a ese repositorio: **Build command:** `node scripts/build.mjs`; **Publish directory:** `dist`. Node 20. Netlify construirá automáticamente cuando haya cambios en GitHub.
3. Abre https://app.pagescms.org/, inicia sesión con GitHub y autoriza Pages CMS para ese repositorio. Selecciona el repositorio y la rama que usa Netlify.
4. En «Libros de Lectiva», crea una ficha: título, autor, descripción, categoría, portada, PDF, idioma, páginas y fecha.
5. Sube la portada y el PDF desde los campos correspondientes del editor. Marca «Confirmo que puedo distribuir esta obra». Mantén «Publicado» desactivado hasta revisar todo.
6. Activa «Publicado» y guarda. Pages CMS escribe los cambios en GitHub y Netlify reconstruye el catálogo. Comprueba el deploy antes de compartir.
7. Para retirar un libro, desmarca «Publicado» y guarda. Se eliminará del siguiente despliegue, pero podrían permanecer copias/cachés externas.

## Importante
- El acceso editorial lo controlan GitHub y Pages CMS; **no es un panel autenticado alojado dentro de Lectiva**. No compartas acceso de escritura al repositorio con lectores. Pages CMS aún no ofrece permisos granulares de contenido.
- PDF públicos: aunque no se ofrezca botón de descarga, cualquier visitante podría guardar una copia. No hay DRM.
- Archivos PDF máximo 40 MB y portadas máximo 8 MB en el compilador; repositorios GitHub y el CMS pueden imponer límites inferiores o distintos. Para bibliotecas grandes conviene almacenamiento dedicado.
- Los archivos de borradores no se publican en `dist`, pero **si el repositorio es público, los originales sí pueden ser visibles en GitHub**. Usa repositorio privado y no subas material sensible o sin derechos.
- No se comprueban virus ni seguridad profunda de PDFs: revisar los archivos antes de publicarlos.
- No se han conectado cuentas de GitHub, Pages CMS o Netlify ni verificado un flujo real de subida.

## Pruebas locales
Requiere Node.js 20 o posterior:
```
node scripts/build.mjs
node --test scripts/test.mjs
```
Para ver el sitio generado, sirve la carpeta `dist` mediante un servidor HTTP local, por ejemplo `python -m http.server 8000 -d dist`, y visita `http://localhost:8000`.
No abras `index.html` directamente como archivo porque la carga del catálogo usa `fetch`.

## Publicación manual temporal
La carpeta `dist` generada se puede subir a Netlify Drop para ver la biblioteca, **pero los cambios desde Pages CMS no se publicarán automáticamente** hasta conectar Netlify al repositorio.

## Estructura
- `.pages.yml`: campos y subida de archivos del CMS.
- `content/books/*.json`: fichas individuales.
- `media/covers`, `media/pdfs`: archivos originales.
- `scripts/build.mjs`: valida y publica solo libros aprobados.
- `dist`: resultado público, generado; no debe editarse a mano.
- `index.html`, `app.js`, `styles.css`: interfaz.
- `assets/logo-lectiva-oficial.png`: logotipo recibido, copiado sin editar.

## Etapa futura
Para miembros privados, habrá que añadir autenticación y almacenamiento protegido, migrando los PDF públicos. No se puede recuperar lo ya descargado mientras era público.
