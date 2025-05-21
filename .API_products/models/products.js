const mongoose = require("mongoose");
const { list } = require("postcss");

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  color: { type: String, required: true },
  count_in_stock: { type: Number, required: true },
  rating: { type: list, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
