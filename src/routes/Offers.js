const express = require("express");
const router = express.Router();

const Offer = require("../models/offer");
const Company = require("../models/company");

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


// Crear una nueva oferta
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

// Actualizar una oferta
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, requisitos } = req.body;

  try {
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: 'Oferta no encontrada' });
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

module.exports = router;
