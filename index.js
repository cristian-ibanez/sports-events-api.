// 1. Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

// 2. Importar módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 3. Importar las rutas definidas para autenticación y eventos
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');

// 4. Inicializar la aplicación Express
const app = express();

// 5. Middleware: Configurar CORS para permitir solicitudes desde otros dominios
app.use(cors());
// 6. Middleware: Habilitar el parseo de datos JSON en las solicitudes
app.use(express.json());

// 7. Ruta de prueba para verificar si la API está funcionando
app.get('/test', (req, res) => {
  res.json({ message: 'Test ok!' });
});

// 8. Rutas principales de la API
// Rutas de autenticación de usuarios (registro, login, perfil)
app.use('/api/users', authRoutes);
// Rutas de gestión de eventos (crear, obtener, actualizar, eliminar)
app.use('/api/events', eventRoutes);

// 9. Middleware de manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Responder con un error 500
  res.status(500).json({ message: 'Error!' });
});

// 10. Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');// Confirmar conexión exitosa
    // 11. Iniciar el servidor una vez establecida la conexión a la base de datos
    // Usar el puerto de .env o el puerto 3000 por defecto
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    // 12. Capturar errores si la conexión a la base de datos falla
    console.error('Error al conectar a MongoDB:', err);
  });
