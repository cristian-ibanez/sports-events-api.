const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  tipoDeporte: {
    type: String,
    required: true
  },
  organizador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
