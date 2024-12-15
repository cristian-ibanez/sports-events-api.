const jwt = require('jsonwebtoken');// Importamos la librería jsonwebtoken para manejar tokens JWT.
const User = require('../models/user.model'); // Importamos el modelo de usuario.

const auth = async (req, res, next) => {// Middleware de autenticación
  try {
    // 1. Obtenemos el token del encabezado 'Authorization' y eliminar el prefijo 'Bearer '
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // Si no se encuentra un token, devolver un error de "No autorizado"
    if (!token) {
      return res.status(401).json({ message: 'No token autenticado' });
    }

    // 2. Verificamos y decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Buscamos el usuario correspondiente al ID decodificado
    const user = await User.findById(decoded.userId);

    if (!user) {
      // Si no se encuentra el usuario, devolver un error de "Usuario no encontrado"
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // 3. Agregamos el usuario autenticado al objeto de solicitud
    req.user = user;

    // 4. Pasamos al siguiente middleware
    next();
  } catch (error) {
    // En caso de error, devolver un error de "Autenticación fallida"
    res.status(401).json({ message: 'Autenticación fallida' });
  }
};
// Exportar el middleware para usarlo en las rutas protegidas
module.exports = auth;
