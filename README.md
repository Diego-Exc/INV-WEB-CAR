# ESCOR — Marketplace de vehículos con asistente IA

Marketplace digital de compra y venta de vehículos usados, con catálogo real (NHTSA), buscador en lenguaje natural, comparador y un asistente conversacional integrado.

## Requisitos

- [Node.js](https://nodejs.org/) versión 18 o superior (incluye `npm`).

## Cómo arrancarlo

1. Clona el repositorio y entra a la carpeta:
   git clone <URL-DEL-REPO>
   cd <NOMBRE-DE-LA-CARPETA>

2. Instala las dependencias:
   **npm install**

3. Levanta el servidor de desarrollo:
   **npm run dev**

4. Abre en el navegador la URL que aparece en la terminal (normalmente `http://localhost:5173`).

### Catálogo PostgreSQL

El catálogo ahora se consulta desde PostgreSQL mediante el API local. Requiere Docker Desktop.

1. Levanta la base de datos: `docker compose up -d db`
2. El primer arranque ejecuta `schema.sql` y crea el Nissan Sentra de ejemplo.
3. Arranca el API en otra terminal: `npm run dev:api`
4. Arranca Vite: `npm run dev`

El API queda disponible en `http://localhost:3001`. La interfaz usa el proxy de Vite para consultar `/api/vehicles`.

Las credenciales locales están en `.env` y el formato está documentado en `.env.example`. No deben publicarse ni llevarse al frontend.

### Acceso inicial

Al ejecutar `npm run server` se crean automáticamente estas cuentas si todavía no existen:

- Admin: `admin@escor.com` / `admin123`
- Usuario: `usuario@escor.com` / `usuario123`

El admin verá el botón `Nuevo vehículo` y podrá crear tarjetas que quedan guardadas en PostgreSQL. Las contraseñas se guardan usando `scrypt`; las sesiones duran mientras el servidor permanezca activo.
