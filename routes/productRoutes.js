const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  const { name, category, isFeatured, sortBy, sortOrder, animalType} = req.query;
  const filter = {};
  const sort = {};

  // Filtros
  if (name) filter.name = { $regex: name, $options: "i" };
  if (category) filter.category = category;
  if (isFeatured !== undefined && isFeatured !== "") {
    filter.isFeatured = isFeatured === 'true';
  }
  if (animalType) filter.animalType = animalType;

  // Ordenar por precio de mayor a menor o viceversa
  if (sortBy) {
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  try {
    const products = await Product.find(filter).sort(sort);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
