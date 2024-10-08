const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  imageUrl: { 
    type: String 
  },
  category: { 
    type: String 
  },
  isVisible: { 
    type: Boolean, 
    default: true 
  },
});

module.exports = mongoose.model("Product", productSchema);
