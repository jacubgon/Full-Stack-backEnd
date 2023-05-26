const mongoose = require("mongoose");

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

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
