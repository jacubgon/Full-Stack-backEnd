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
