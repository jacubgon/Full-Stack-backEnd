const express = require("express");
const router = express.Router();

const Company = require("../models/company");
const Offer = require("../models/offer");

// VER TODAS LAS EMPRESAS
router.get("/", async (req, res) => {
  try {
    console.log("estoy entrando en empresas");
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    console.log("estoy dando un error en empresas");
    res.status(500).json({ message: error.message });
  }
});

//CREAR NUEVA EMPRESA
router.post("/", async (req, res) => {
  const company = new Company(req.body);
  console.log(req.body);

  try {
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (error) {
    console.log("estoy dando un error en el POST empresas");
    res.status(400).json({ message: error.message });
  }
});

// OBTENER EMPRESA POR ID
router.get("/:id", getCompany, (req, res) => {
  res.json(res.company);
});

// Middleware para obtener una empresa por su ID
async function getCompany(req, res, next) {
  let company;
  try {
    company = await Company.findById(req.params.id);
    if (company == null) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.company = company;
  next();
}

// OBTENER OFERTAS DE UNA EMPRESA
router.get("/:companyId/offers", async (req, res) => {
  try {
    const { companyId } = req.params;
    const offers = await Company.findById(companyId).populate("ofertas");
    res.json(offers.ofertas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
