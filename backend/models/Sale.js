const mongoose = require('mongoose');
const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalRevenue: { type: Number, required: true, min: 0 },
  reportDate: { type: Date, required: true, index: true },
}, { timestamps: true });
module.exports = mongoose.model('Sale', saleSchema);