const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const Offer = require("../models/offer");
const bcrypt = require("bcrypt");
const isAuth = require("../middlewares/isAuth");
const isCandidate = require("../middlewares/isCandidate");
const isCompany = require("../middlewares/isCompany");

// Obtener todos los candidatos (FUNCIONA)
router.get("/", async (req, res) => {
  try {
    console.log("estoy entrando en candidatos");
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    console.log("estoy dando un error al obtener los candidatos");
    res.status(500).json({ message: error.message });
  }
});

// LOGIN Candidate
router.post('/signin', async (req, res) => {
  const { email, password: passwordPlainText } = req.body

  try {
    const candidate = await Candidate.findOne({ email })
    if (!candidate) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta' })
    }
    const isCandidate = await bcrypt.compare(passwordPlainText, candidate.password)
    if (!isCandidate) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta' })
    }
    const token = candidate.generateJWT()
    res.setHeader('x-auth-token', token).json({ message: 'Inicio de sesión exitoso' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el inicio de sesión' })
  }
})

// Crear un nuevo candidato (FUNCIONA)
router.post("/", async (req, res) => {
  const { email, password: passwordPlainText } = req.body

  try {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(passwordPlainText, salt)
    const newCandidate = await Candidate.create({...req.body, password, role: "candidate" })
    const token = newCandidate.generateJWT()
    res.setHeader('x-auth-token', token).json(newCandidate)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al registrar el usuario' })
  }
});

// Obtener un candidato por su ID (FUNCIONA)
router.get("/:id", isAuth,isCompany, getCandidate, (req, res) => {
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

// Dar likes a una oferta del candidato (FUNCIONA)
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

// Obtener las ofertas aplicadas por un candidato (NO FUCIONA)
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
