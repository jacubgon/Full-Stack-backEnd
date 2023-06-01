const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const Company = require("../models/company");
const Offer = require("../models/offer");
const Candidate = require("../models/candidate");

// VER TODAS LAS EMPRESAS (FUNCIONALITY)
router.get("/", async (req, res) => {
  try {
    console.log("estoy entrando en empresas");
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN Company (FUNCIONA)
router.post('/signin', async (req, res) => {
  const { email, password: passwordPlainText } = req.body
  
  try {
    const company = await Company.findOne({ email })
    if (!company) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta' })
    }
    const isCompany = await bcrypt.compare(passwordPlainText, company.password)
    if (!isCompany) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta' })
    }
    const token = company.generateJWT()
    res.setHeader('access-control-expose-headers', 'x-auth-token')
    res.setHeader('x-auth-token', token).json({ message: 'Inicio de sesión exitoso' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el inicio de sesión' })
  }
})


//CREAR NUEVA EMPRESA (FUNCIONA)
router.post("/signup", async (req, res) => {
  const { email, password: passwordPlainText } = req.body

  try {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(passwordPlainText, salt)
    const newCompany = await Company.create({...req.body, password, role: "company" })
    const token = newCompany.generateJWT()
    res.setHeader('access-control-expose-headers', 'x-auth-token')
    res.setHeader('x-auth-token', token).json(newCompany)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al registrar el usuario' })
  }
});

// OBTENER EMPRESA POR ID (FUNCIONA)
router.get("/:id", getCompany, (req, res) => {
  res.json(res.company);
});

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
 
//DAR LIKE A UN CANDIDATO (FUNCIONA)

router.post("/:companyId/like/:candidateId", async (req, res) => {
  try {
    const { companyId, candidateId } = req.params;

    const empresa = await Company.findById(companyId);
    const candidato = await Candidate.findById(candidateId);
    if (!empresa || !candidato) {
      return res.status(404).json({ message: "Empresa o candidato no encontrado" });
    }

    const empresaLiked = empresa.likes.some(like => like.candidato.toString() === candidateId);
    if (empresaLiked) {
      return res.status(400).json({ message: "La empresa ya ha dado like a este candidato" });
    }

    candidato.likes.push({ empresa: companyId });
    await candidato.save();
    empresa.likes.push({ candidato: candidateId });
    await empresa.save();
    res.json({ message: "Like de empresa agregado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
