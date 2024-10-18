const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Alimento", "Accesorio", "Aseo", "Indumentaria", "Juguete" ],
    required: true,
  },
  animalType: {
    type: String,
    enum: ["Perro", "Gato", "Otros"],
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
