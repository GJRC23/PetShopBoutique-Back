const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createProduct, deleteProduct } = require("../controllers/productController");
const Product = require("../models/Product");

// Configurar Multer para la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Crear un nuevo producto (con imagen)
router.post("/", upload.single("image"), createProduct);

// Obtener todos los productos
router.get("/", async (req, res) => {
  const { name, category, isFeatured, sortBy, sortOrder, animalType } = req.query;
  const filter = {};
  const sort = {};

  // Filtros
  if (name) filter.name = { $regex: name, $options: "i" };
  if (category) filter.category = category;
  if (isFeatured !== undefined && isFeatured !== "") {
    filter.isFeatured = isFeatured === "true";
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
router.put("/:id", upload.single("image"), async (req, res) => {
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

// Eliminar un producto (incluye la eliminación de la imagen de Cloudinary)
router.delete("/:id", deleteProduct);

module.exports = router;
