const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Electronics', 'Apparel', 'Groceries', 'Books', 'Home Goods'] },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);