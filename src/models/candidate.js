const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const pick = require("lodash/pick");
const config = require("config");

const candidateSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  habilidades: {
    type: String,
    required: true,
  },
  ubicacion: {
    type: String,
    required: true,
  },
  educacion: {
    type: String,
  },
  experiencia: {
    type: String,
  },
  likes: [
    {
      oferta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
    },
  ],
  role: String,

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
  procesosPendientes: [
    {
      oferta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
      estado: {
        type: String,
        state: ["pendiente", "entrevista", "rechazado", "aceptado"],
      },
    },
  ],
});

candidateSchema.methods.generateJWT = function () {
  return jwt.sign(
    pick(this, ['email','role']),
    config.get("private_key")
  )
}

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
