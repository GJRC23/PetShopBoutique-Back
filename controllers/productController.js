const cloudinary = require('../cloudinaryConfig');
const Product = require('../models/Product'); // Modelo de tu base de datos

// Controlador para crear un producto
const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado una imagen' });
    }

    // Subir la imagen a Cloudinary desde el buffer
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'petshop-products' },
      (error, result) => {
        if (error) return res.status(500).json({ error: 'Error al subir la imagen' });

        // Guardar el producto con la URL de la imagen
        const newProduct = new Product({
          name: req.body.name,
          price: req.body.price,
          imageUrl: result.secure_url,
        });

        newProduct.save().then((product) => {
          res.status(201).json(product);
        }).catch((error) => {
          res.status(500).json({ error: 'Error al guardar el producto' });
        });
      }
    );

    // Enviar el buffer de la imagen a Cloudinary
    result.end(req.file.buffer);
  } catch (error) {
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
    const publicId = product.imageUrl.split('/').pop().split('.')[0]; // Obtener el public ID
    await cloudinary.uploader.destroy(`petshop-products/${publicId}`);

    // Eliminar el producto de la base de datos
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Producto eliminado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

module.exports = { createProduct, deleteProduct };
