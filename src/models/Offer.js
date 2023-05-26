const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  requisitos: {
    type: String,
    required: true
  },
  fechaPublicacion: {
    type: Date,
    default: Date.now
  },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  candidatos: [{
    candidato: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate'
    },
    estado: {
      type: String,
      state: ['aplicado', 'interesado'],
      default: 'aplicado'
    }, 
    descartes:{
      
    }
  }]
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
