// Importar validación de datos
const { validationResult } = require('express-validator');
// Importar el modelo de evento
const Event = require('../models/event.model');

// 1 CONTROLADOR OBTENER TODOS LOS EVENTOS
// 1 CHECK llamar modelo de datos Event OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT OBTENER TODOS LOS EVENTOS MÉTODO GET) OK
const getAllEvents = async (req, res) => {
    try {
        // 1 Buscar todos los eventos por find y populate
        const events = await Event.find().populate('organizador', 'username');
        // 2 RESPUESTA listado de eventos
        res.json(events);
    } catch (error) {
        // 3 Mensaje error
        res.status(500).json({ message: 'Error al recuperar eventos' });
    }
};

// 2 CONTROLADOR OBTENER EVENTO POR ID
// 1 CHECK llamar modelo de datos Event OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT OBTENER EVENTO POR ID MÉTODO GET) OK
const getEventById = async (req, res) => {
    try {
        // 1 BUSCAR un evento específico por ID con params y populate.
        const event = await Event.findById(req.params.eventId).populate('organizador', 'username');
        if (!event) {
            // Si no existe el evento
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        // 2 RESPUESTA evento encontrado
        res.json(event);
    } catch (error) {
        // 3 Mensaje error
        res.status(500).json({ message: 'Error al recuperar evento' });
    }
};
// 3 CONTROLADOR CREAR EVENTO
// 1 CHECK llamar modelo de datos Event OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT CREAR EVENTO MÉTODO POST) OK
const createEvent = async (req, res) => {
    try {
        // 1 VALIDAR DATOS
        // Captura y valida errores de la validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // 2 Crear un evento con los datos del cuerpo y asignar el organizador (usuario autenticado)
        const event = new Event({
            ...req.body,
            organizador: req.user._id
        });
        // 3 Guardar el evento en la base de datos
        await event.save();
        // 4 Responder con el evento creado
        res.status(201).json(event);
    } catch (error) {
        // 5 Mensaje error
        res.status(500).json({ message: 'Error crear evento' });
    }   
};

// 4 CONTROLADOR ACTUALIZAR EVENTO
// 1 CHECK llamar modelo de datos Event OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT ACTUALIZAR EVENTO MÉTODO PUT) OK
const updateEvent = async (req, res) => {
    try {
        // 1 Buscar el evento por ID con params.
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        // 2 Verificar si el usuario autenticado es el organizador del evento
        if (event.organizador.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        // 3 Actualizar el evento con los datos del cuerpo.
        // Actualizar los campos del evento con los datos del cuerpo
        Object.assign(event, req.body);
        await event.save();
        // 4 Responder con el evento actualizado
        res.json(event);
    } catch (error) {
        // 5 Mensaje error
        res.status(500).json({ message: 'Error actualizando evento' });
    }
};

// 5 CONTROLADOR BORRAR EVENTO
// 1 CHECK llamar modelo de datos Event OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT BORRAR EVENTO MÉTODO DELETE) OK
const deleteEvent = async (req, res) => {
    try {
        // 1 Buscar el evento por ID con params.
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        // 2 Verificar si el usuario autenticado es el organizador del evento
        if (event.organizador.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        // 3 Borrar el evento
        await event.deleteOne();
        // 4 Responder con un mensaje de confirmación
        res.json({ message: 'Evento eliminado' });
    } catch (error) {
        // 5 Mensaje error
        res.status(500).json({ message: 'Error al eliminar evento' });
    }
};

// 6 CONTROLADOR OBTENER EVENTOS PROXIMOS
// 1 CHECK llamar modelo de datos Event OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT OBTENER EVENTOS PROXIMOS MÉTODO GET) OK
const getUpcomingEvents = async (req, res) => {
    try {
        // 1 Buscar eventos cuya fecha sea mayor o igual a la fecha actual
        const events = await Event.find({
            // Filtrar eventos con fecha futura
            fecha: { $gte: new Date() }
            // Ordenar los eventos por fecha ascendente
        }).sort('fecha').populate('organizador', 'username');
        // 2 Responder con la lista de eventos próximos
        res.json(events);
    } catch (error) {
        // 3 Respuesta en caso de error en la base de datos o consulta
        res.status(500).json({ message: ' Error al recuperar eventos' });
    }
};

// 7 CONTROLADOR OBTENER EVENTOS POR TIPO
// 1 CHECK llamar modelo de datos Event OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT OBTENER EVENTOS POR TIPO MÉTODO GET) OK
const getEventsByType = async (req, res) => {
    try {
        const events = await Event.find({
            tipoDeporte: req.params.tipoDeporte
        }).populate('organizador', 'username');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events by type' });
    }
};

// 8 CONTROLADOR OBTENER EVENTOS POR FECHA
// 1 CHECK llamar modelo de datos Event OK
// 2 CHECK Exportar controlador al final OK
// 3 CHECK Configurarla en endpoint (ENDPOINT OBTENER EVENTOS POR FECHA MÉTODO GET) OK  
const getEventsByDateRange = async (req, res) => {
    try {
        // 1 Buscar eventos que coincidan con el tipo de deporte recibido en el parámetro de la ruta
        const { from, to } = req.query;
        const events = await Event.find({
            fecha: {
                $gte: new Date(from),// Fecha mayor o igual a 'from'
                $lte: new Date(to) // Fecha menor o igual a 'to'
            }
        }).sort('fecha').populate('organizador', 'username');
        // 2 Responder con la lista de eventos filtrados
        res.json(events);
    } catch (error) {
        // 3 Respuesta en caso de error en la base de datos o consulta
        res.status(500).json({ message: ' Error al recuperar eventos por fecha'});
    }
};

// Exportamos controladores para utilizar en rutas
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    getEventsByType,
    getEventsByDateRange
};
