const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contraseña: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  matches: [
    {
      oferta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
      fecha: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  descripcion: {
    type: String
  },
  
  ofertas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  }]
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
