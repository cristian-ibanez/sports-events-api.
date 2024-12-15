//Importar express y poder trabajar router
const express = require('express');
// Importar la función body de express-validator para validar los datos del cuerpo de las peticiones
const { body } = require('express-validator');
// Importar el middleware de autenticación para proteger las rutas
const auth = require('../middleware/auth.middleware');
//importamos controladores
const { register, login, getProfile } = require('../controllers/auth.controller');
// Crear una instancia del router de Express
const router = express.Router();

//ENDPOINT REGISTRAR USUARIO MÉTODO POST
router.post('/register',
  [
    // Validamos que el campo 'username' no esté vacío y tenga un mínimo de 3 caracteres  
    body('username').trim().isLength({ min: 3 }),
    // Validamos que el campo 'password' tenga un mínimo de 6 caracteres
    body('password').isLength({ min: 6 })
  ],
   // Ejecutamos el controlador 'register' si las validaciones son correctas
  register
);

//ENDPOINT LOGIN DE USUARIO MÉTODO POST
router.post('/login', login);

//ENDPOINT PERFIL DE USUARIOS
router.get('/profile', auth, getProfile);


module.exports = router;

