const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const pick = require("lodash/pick");
const config = require("config");

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
  password: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  role: String,
  likes: [
    {
      oferta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
    },
  ],
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
  }],
  descartes: []
});

companySchema.methods.generateJWT = function () {
  return jwt.sign(
    pick(this, ['email','role', '_id']),
    config.get("private_key")
  )
}

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
