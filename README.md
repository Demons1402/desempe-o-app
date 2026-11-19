# SHD - Aplicación Web Angular (MiniTwitter)

Proyecto académico desarrollado con Angular standalone, Angular Router, Guards, Forms, HttpClient y Bootstrap.

## Requisitos
- Node.js LTS instalado.
- Visual Studio Code (recomendado).
- Conexión a internet para consumir JSONPlaceholder.

## Instalar y ejecutar
1. Descomprime el proyecto.
2. Abre la carpeta `angular-twitter-crud` en Visual Studio Code.
3. Abre la terminal integrada.
4. Ejecuta:

```bash
npm install
npm start
```

5. Abre la dirección que muestra Angular CLI, normalmente `http://localhost:4200`.

## Credenciales de prueba
- Usuario: `admin`
- Contraseña: `12345`

## Rutas
- `/login`: pantalla pública de inicio de sesión.
- `/posts`: muro protegido por `authGuard`.

Si no existe un token en `localStorage`, el guard redirige al login. Al iniciar sesión se guarda un token simulado en `localStorage`.

## Operaciones CRUD
El servicio `PostsService` consume `https://jsonplaceholder.typicode.com/posts` mediante `HttpClient`:
- GET `/posts`: listar.
- POST `/posts`: crear.
- PUT `/posts/:id`: actualizar.
- DELETE `/posts/:id`: eliminar.

**Importante sobre JSONPlaceholder:** es una API de demostración. Acepta las peticiones POST, PUT y DELETE y devuelve respuestas simuladas, pero no conserva permanentemente esos cambios en su servidor. Por eso la interfaz actualiza la lista local para mostrar el resultado durante la sesión.

## Estructura
```text
src/
  app/
    core/
      auth.service.ts
      auth.guard.ts
      post.model.ts
      posts.service.ts
    pages/
      login/
        login.component.ts
      feed/
        feed.component.ts
    app.component.ts
    app.config.ts
    app.routes.ts
  index.html
  main.ts
  styles.css
```

## Generar compilación de producción
```bash
npm run build
```
La salida se genera en `dist/angular-twitter-crud/browser`.

## Publicar en Vercel
1. Sube el proyecto a un repositorio de GitHub.
2. Entra a Vercel e importa ese repositorio.
3. Framework preset: Angular (o Other si no lo detecta).
4. Build command: `npm run build`.
5. Output directory: `dist/angular-twitter-crud/browser`.
6. Despliega y copia la URL pública.

Para una entrega académica, agrega también el enlace de GitHub, el enlace desplegado y evidencia de las pruebas.
