const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de CORS
app.use(cors({
  origin: "https://petshop-boutique.web.app", // Reemplaza con la URL de tu frontend
  credentials: true, // Permitir envío de cookies y cabeceras autorizadas
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Rutas
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
