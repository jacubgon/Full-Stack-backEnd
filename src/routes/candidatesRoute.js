const express = require('express');
const router = express.Router();
const Candidate = require ('../models/candidate')


// Obtener todos los candidatos
router.get('/', async (req, res) => {
  try {
    console.log('estoy entrando en candidatos')
    const candidates = await Candidate.find();
    res.json(candidates);
    console.log(candidates)
  } catch (error) {
    console.log('estoy dando un error')
    res.status(500).json({ message: error.message });
  }
});

// Crear un nuevo candidato
router.post('/', async (req, res) => {

 const candidate = new Candidate(req.body);
 console.log(req.body)
  try { 
    const newCandidate = await candidate.save();
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;














// // Obtener un candidato por su ID
// router.get('/candidates/:id', getCandidate, (req, res) => {
//   res.json(res.candidate);
// });


// async function getCandidate(req, res, next) {
//   let candidate;
//   try {
//     candidate = await Candidate.findById(req.params.id);
//     if (candidate == null) {
//       return res.status(404).json({ message: 'Candidato no encontrado' });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }

//   res.candidate = candidate;
//   next();
// }


