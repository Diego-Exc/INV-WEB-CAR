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

No necesitas configurar ninguna clave de API ni variables de entorno el proyecto ya se conecta directo a APIs públicas gratuitas (NHTSA vPIC para el catálogo, imagin.studio para imágenes).
