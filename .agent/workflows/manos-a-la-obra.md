---
description: Importar, configurar y lanzar un proyecto exportado de Stitch con flujo de navegación completo.
---

Este workflow automatiza la preparación de un proyecto exportado de Stitch, asegurando que las dependencias estén instaladas, las rutas sean correctas y exista una navegación fluida entre pantallas.

### Pasos de ejecución:

1. **Normalización de archivos**:
   // turbo
   Renombrar todos los archivos `code.html` a `index.html` en las subcarpetas para permitir URLs limpias y compatibles con servidores web.
   `powershell -Command "Get-ChildItem -Filter code.html -Recurse | Rename-Item -NewName index.html"`

2. **Configuración del entorno**:
   Crear un archivo `package.json` básico si no existe e instalar Vite:
   ```json
   {
     "scripts": { "dev": "vite" },
     "devDependencies": { "vite": "^5.0.0" }
   }
   ```
   // turbo
   `npm install`

3. **Creación del Portal de Inicio**:
   Generar un archivo `index.html` en la raíz que actúe como "Dashboard" o "Portal", listando todas las pantallas detectadas en el proyecto.

4. **Lógica de Navegación**:
   Crear un archivo `navigation.js` que gestione los eventos de los botones comunes (`Continuar`, `Siguiente`, `Animar`) y permita navegar entre carpetas.

5. **Inyección de Scripts**:
   // turbo
   Inyectar automáticamente la referencia al script de navegación en todos los archivos HTML encontrados.
   `node -e "const fs=require('fs'); const path=require('path'); function walk(d){fs.readdirSync(d).forEach(f=>{let p=path.join(d,f); if(fs.statSync(p).isDirectory()) walk(p); else if(f==='index.html'){let c=fs.readFileSync(p,'utf8'); if(!c.includes('navigation.js')) fs.writeFileSync(p,c.replace('</body>','<script src=\"/navigation.js\"></script></body>'));}})} walk('.')"`

6. **Lanzamiento**:
   // turbo
   Ejecutar el servidor local y mostrar el enlace al usuario.
   `npm run dev`

7. **Verificación**:
   Comprobar manualmente o mediante subagente que el flujo ("Manos a la obra") funciona desde la bienvenida hasta la despedida.
