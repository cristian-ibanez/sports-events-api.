const jwt = require('jsonwebtoken');// Importamos la librería jsonwebtoken para manejar tokens JWT.
const { validationResult } = require('express-validator');// Importamos validationResult para manejar los errores de validación.
const User = require('../models/user.model');// Importamos el modelo de usuario.

// 1 CONTROLADOR REGISTRO DE USUARIOS
// 1 CHECK llamar modelo de datos User OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT REGISTRAR USUARIO MÉTODO POST) OK
const register = async (req, res) => {
    // 1 Validación datos OK
    try {
        // Captura y valida erroes de la validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores, responde con un código 400 y los errores
            return res.status(400).json({ errors: errors.array() });
        }
        // 1 Enviar datos nuevo usuario al servidor por el body
        // Recibo datos, aplicamos destructuring
        const { username, password } = req.body;
        // 2 Valido si el usuario ya existe, buscar BD
        // Buscamos en User con función findOne si existe datos usuario.
        // newUser busca propiedad email que viene del objeto del req.body
        const existingUser = await User.findOne({ username });
        // 3 Si existe-> envío error de respuesta
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario existe' });
        }
        // 4 Si no existe-> encriptar contraseña y lo añado.
        // Encriptar contraseña es un proceso asincrona
        const user = new User({ username, password });
        // 5 Siguiente paso, guardar usuario con funcion save
        await user.save();
        // 6 Genera un token JWT usando el `user._id` como identificador
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        // 7 Responde con un código 201 y el token
        res.status(201).json({ token });
    } catch (error) {
        // 8 Manejo de errores internos del servidor.
        res.status(500).json({ message: 'Error registro usuario' });
    }
};

// 2 CONTROLADOR LOGIN DE USUARIOS
// 1 CHECK llamar modelo de datos User OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT LOGIN USUARIO MÉTODO POST) OK
const login = async (req, res) => {
    try {
        // 1 RECIBIR DATOS
        // Enviamos por body porque son datos ocultos, hacemos destructuring
        const { username, password } = req.body;
        // 2 VERIFICAR usuario existen funcion findOne, buscamos  dentro de colección User
        const user = await User.findOne({ username });
        // findOne si no encuentra devuelve null, como lo hace creamos mensaje si no existe usuario
        // 3 Si no existe-> envío error de respuesta
        if (!user) { // si userBD no existe (!)
            return res.status(401).json({ message: 'el usuario no existe' });
        }
        // 3 COMPARAR CONTRASEÑA del usuario vs BD que está en encriptada con funcion-> comparePassword
        const isMatch = await user.comparePassword(password);
        // Devuelve true o false.
        // Si no coincide-> message error
        if (!isMatch) {
            return res.status(401).json({ message: 'contraseña incorrecta' });
        }
        // 4 Si coincide ->creo token
        // IMPORTAMOS FUNCION PARA CREAR TOKEN ARRIBA-> const jwt = require('jsonwebtoken');        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        // 5 Devuelve el token JWT al cliente.
        res.json({ token });
        // 6 Error de servidor
    } catch (error) {        
        res.status(500).json({ message: 'Error login de usuario' });
    }
};

// 3 CONTROLADOR PERFIL DE USUARIOS
// 1 CHECK llamar modelo de datos User OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT PERFIL USUARIO MÉTODO GET) OK
const getProfile = async (req, res) => {
    try {
        // 1 RECIBIR DATOS
        // Busca al usuario por su ID, excluyendo el campo `password`.
        const user = await User.findById(req.user._id).select('-password');
        // 2 Devuelve el perfil del usuario.
        res.json(user);
    } catch (error) {
        // 3 Manejo de errores internos del servidor.
        res.status(500).json({ message: 'Error perfil de usuario' });
    }
};
// Exportamos controladores para utilizar en rutas
module.exports = {
    register,
    login,
    getProfile
};
