# API de Eventos Deportivos

API RESTful para la gestión de eventos deportivos desarrollada con Node.js, Express y MongoDB.

## Requisitos

- Node.js
- MongoDB
- npm

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```
3. Crea un archivo .env con las siguientes variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sports-events
JWT_SECRET=admin
```

## Uso

Para iniciar el servidor:
```bash
npm start
```

Para desarrollo (con nodemon):
```bash
npm run dev
```

## Endpoints

### Autenticación

- POST /api/users/register - Registrar nuevo usuario
- POST /api/users/login - Iniciar sesión
- GET /api/users/profile - Ver perfil (requiere autenticación)

### Eventos

- GET /api/events - Obtener todos los eventos
- GET /api/events/:eventId - Obtener evento por ID
- POST /api/events - Crear nuevo evento (requiere autenticación)
- PUT /api/events/:eventId - Actualizar evento (requiere autenticación)
- DELETE /api/events/:eventId - Eliminar evento (requiere autenticación)
- GET /api/events/upcoming - Obtener próximos eventos
- GET /api/events/type/:tipoDeporte - Filtrar eventos por tipo de deporte
- GET /api/events/date?from=YYYY-MM-DD&to=YYYY-MM-DD - Eventos por rango de fechas

## Autenticación

Para las rutas protegidas, incluir el token JWT en el header:
```
Authorization: Bearer <token>
```
## Arquitectura

sports-events-api/
│
├── node_modules/          # Dependencias instaladas
├── src/                   # Carpeta principal del código fuente
│   ├── controllers/       # Controladores: lógica de negocio de cada recurso
│   │   ├── auth.controller.js    # Controlador para autenticación de usuarios
│   │   └── event.controller.js   # Controlador para la gestión de eventos
│   │
│   ├── middleware/        # Middlewares: funciones intermedias
│   │   └── auth.middleware.js    # Middleware para verificar tokens JWT
│   │
│   ├── models/            # Modelos: estructura de datos
│   │   ├── user.model.js         # Modelo para la estructura de usuarios
│   │   └── event.model.js        # Modelo para la estructura de eventos
│   │
│   ├── routes/            # Rutas: define las endpoints de la API
│   │   ├── auth.routes.js        # Rutas relacionadas con usuarios/autenticación
│   │   ├── event.routes.js       # Rutas relacionadas con eventos
│   │   └── index.js              # Archivo que centraliza todas las rutas
│   │
│   └── index.js           # Archivo principal: arranca el servidor
│
├── .env                   # Variables de entorno (configuración sensible)
├── package.json           # Dependencias y scripts del proyecto
├── package-lock.json      # Bloqueo de versiones de dependencias
└── README.md              # Documentación básica del proyecto
