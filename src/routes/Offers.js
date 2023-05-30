const express = require("express");
const router = express.Router();

const Offer = require("../models/offer");
const Company = require("../models/company");
const Candidate = require("../models/candidate");

// Obtener todas las ofertas (FUNCIONA)
router.get("/", async (req, res) => {
  try {
    console.log("estoy entrando en ofertas");
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    console.log("estoy dando un error en ofertas");
    res.status(500).json({ message: error.message });
  }
});

// Crear una nueva oferta  (FUNCIONA)
router.post("/", async (req, res) => {
  const { empresaId, titulo, descripcion, requisitos } = req.body;
  try {
    const company = await Company.findById(empresaId);
    if (!company) {
      return res.status(404).json({ message: "Compañía no encontrada" });
    }
    const newOffer = new Offer({
      empresa: empresaId,
      titulo,
      descripcion,
      requisitos,
    });

    const savedOffer = await newOffer.save();

    company.ofertas.push(savedOffer);
    await company.save();
    res.status(200).json(savedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar una oferta (FUNCIONA)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, requisitos } = req.body;

  try {
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    offer.titulo = titulo;
    offer.descripcion = descripcion;
    offer.requisitos = requisitos;

    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Ver los candidatos de una oferta (FUNCIONA)
router.get("/:offerId/candidates", async (req, res) => {
  try {
    const { offerId } = req.params;
    const candidatesByOffer = await Offer.findById(offerId)
    .populate("candidatos");

    res.json(candidatesByOffer.candidatos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Eliminar una oferta (FUNCIONA)
router.delete("/:offerId", async (req, res) => {
  try {
    const { offerId } = req.params;
    const deletedOffer = await Offer.findByIdAndRemove(offerId);
    if (!deletedOffer) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }
    res.json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//MATCH!!!!
// Comprobar si hay un match entre empresa y candidato
router.post("/check-match", async (req, res) => {
  try {
    const { candidateId, offerId } = req.body;

    // Verificar si el candidato y la oferta existen
    const candidato = await Candidate.findById(candidateId);
    const oferta = await Offer.findById(offerId);
    if (!candidato || !oferta) {
      return res.status(404).json({ message: "Candidato u oferta no encontrados" });
    }

    // Verificar si el candidato ha dado like a la oferta y la empresa ha dado like al candidato
    const candidatoLiked = candidato.likes.some(like => like.oferta === offerId);
    const empresaLiked = oferta.likes.some(like => like.candidato=== candidateId);

    if (candidatoLiked && empresaLiked) {
      candidato.matches.push({ oferta: offerId });
      oferta.matches.push({ candidato: candidateId });

      await candidato.save();
      await oferta.save();

      return res.json({ message: "Match establecido" });
    }

    res.json({ message: "No hay match" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// // MATCH entre empresa y candidato
// router.post("/match", async (req, res) => {
//   try {
//     const { candidateId, offerId } = req.body;

//     // Comprobar si el candidato y la oferta existen
//     const candidato = await Candidate.findById(candidateId);
//     const oferta = await Offer.findById(offerId);
//     console.log(oferta)
//     if (!candidato || !oferta) {
//       return res.status(404).json({ message: "Candidato u oferta no encontrados" });
//     }

//     // Comprobar si el candidato ya ha dado like a la oferta
//     const candidatoLiked = candidato.likes.some(like => like.oferta.toString() === offerId);
//     if (candidatoLiked) {
//       return res.status(400).json({ message: "El candidato ya ha dado like a esta oferta" });
//     }

//     // Verificar si la empresa ya ha dado like al candidato
//     const empresaLiked = oferta.likes.some(like => like.candidato.toString() === candidateId);
//     if (empresaLiked) {
//       // Establecer el match
//       candidato.matches.push({ oferta: offerId });
//       oferta.matches.push({ candidato: candidateId });
//       await candidato.save();
//       await oferta.save();
//       return res.json({ message: "Match establecido" });
//     }

//     // Si no se ha establecido el match, simplemente agregar el like del candidato a la oferta
//     oferta.likes.push({ candidato: candidateId });
//     await oferta.save();
//     res.json({ message: "Like agregado correctamente" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });



module.exports = router;
