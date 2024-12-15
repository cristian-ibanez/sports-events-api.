const express = require('express');// Importar Express
const { body } = require('express-validator');// Importar validadores
const auth = require('../middleware/auth.middleware');// Middleware de autenticación
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    getEventsByType,
    getEventsByDateRange
} = require('../controllers/event.controller');// Importar controladores

const router = express.Router();

//ENDPOINT OBTENER TODOS LOS EVENTOS METODO GET
router.get('/', getAllEvents);

//ENDPOINT  EVENTOS PROXIMOS METODO GET
router.get('/upcoming', getUpcomingEvents);

//ENDPOINT  EVENTOS POR TIPO METODO GET
router.get('/type/:tipoDeporte', getEventsByType);

//ENDPOINT  EVENTOS POR FECHA METODO GET
router.get('/date', getEventsByDateRange);

//ENDPOINT OBTENER EVENTO POR ID METODO GET
router.get('/:eventId', getEventById);

//ENDPOINT CREAR EVENTO MÉTODO POST
// Crear un evento (requiere autenticación y validación)
router.post('/', 
    auth,// Middleware que verifica el token JWT
    [
        body('nombre').trim().notEmpty(),
        body('descripcion').trim().notEmpty(),
        body('fecha').isISO8601(),
        body('ubicacion').trim().notEmpty(),
        body('tipoDeporte').trim().notEmpty()
    ],
    createEvent
);

//ENDPOINT ACTUALIZAR EVENTO MÉTODO PUT
// (requiere autenticación)
router.put('/:eventId', auth, updateEvent);

//ENDPOINT ELIMINAR EVENTO MÉTODO DELETE
// (requiere autenticación)
router.delete('/:eventId', auth, deleteEvent);

module.exports = router;
