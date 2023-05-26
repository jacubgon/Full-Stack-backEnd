const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const Offer = require("../models/offer");

// Obtener todos los candidatos (FUNCIONA)
router.get("/", async (req, res) => {
  try {
    console.log("estoy entrando en candidatos");
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    console.log("estoy dando un error");
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo candidato (FUNCIONA)
router.post("/", async (req, res) => {
  const candidate = new Candidate(req.body);
  console.log(req.body);
  try {
    const newCandidate = await candidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener un candidato por su ID (FUNCIONA)
router.get("/:id", getCandidate, (req, res) => {
  res.json(res.candidate);
});

async function getCandidate(req, res, next) {
  let candidate;
  try {
    candidate = await Candidate.findById(req.params.id);
    if (candidate == null) {
      return res.status(404).json({ message: "Candidato no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.candidate = candidate;
  next();
}

// Guardar una oferta en el array de likes del candidato (FUNCIONA)
router.post("/:candidateId/likes/:offerId", async (req, res) => {
  const { candidateId, offerId } = req.params;
  try {
    // Verificar si el candidato existe
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidato no encontrado" });
    }
    // Verificar si la oferta existe
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }
    // Verificar si el candidato ya ha aplicado a la oferta
    const alreadyLiked = candidate.likes.includes(offerId);
    if (alreadyLiked) {
      return res
        .status(400)
        .json({ message: "El candidato ya ha aplicado a esta oferta" });
    }
    // Guardar oferta en array de likes del candidato, y candidato en array de candidatos de la oferta
    candidate.likes.push(offerId);
    await candidate.save();
    offer.candidatos.push(candidateId);
    await offer.save();

    res.json({ message: "Oferta aplicada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener las ofertas aplicadas por un candidato
router.get("/:candidateId/offers", async (req, res) => {
  const { candidateId } = req.params;

  try {
    // Verificar si el candidato existe
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidato no encontrado" });
    }

    // Obtener las ofertas aplicadas por el candidato
    const appliedOffers = await Offer.find({ candidatos: candidateId });

    res.json(appliedOffers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
