// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");

const candidates = require("./routes/candidates");
const companies = require('./routes/companies');
const offers = require('./routes/offers');

const app = express();

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use("/candidates", candidates);
app.use("/companies", companies);
app.use("/offers", offers);


const port = 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  });

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// health check endpoint
app.get("/ping", async (req, res) => {
  res.status(500).send("pong");
});
