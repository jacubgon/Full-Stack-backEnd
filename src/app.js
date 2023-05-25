const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const candidates = require("./routes/candidatesRoute");

const app = express();

app.use(express.json());
app.use("/candidates", candidates);

const port = 3000;

mongoose
  .connect("mongodb://localhost:27017/Finder", {
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
