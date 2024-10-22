const cloudinary = require('../cloudinaryConfig');
const Product = require('../models/Product');

// Controlador para crear un producto
const createProduct = async (req, res) => {
  try {
    console.log('Archivo recibido:', req.file);
    console.log('Datos del producto:', req.body);
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado una imagen' });
    }

    // Subir la imagen a Cloudinary desde el buffer
    const result = await cloudinary.uploader.upload(req.file.buffer, {
      folder: 'petshop-products',
    });

    // Guardar el producto con la URL de la imagen
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      imageUrl: result.secure_url,
    });

    await newProduct.save();
    console.log('Producto guardado:', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Controlador para eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    // Eliminar la imagen de Cloudinary
    const publicId = product.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`petshop-products/${publicId}`);

    // Eliminar el producto de la base de datos
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Producto eliminado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

module.exports = { createProduct, deleteProduct };
