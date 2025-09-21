const mongoose = require('mongoose');
const analyticsReportSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  generatedAt: { type: Date, default: Date.now },
  metrics: {
    totalRevenue: { type: Number, default: 0 },
    avgOrderValue: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    topSellingProducts: [{ name: String, totalQuantity: Number, _id: false }],
    salesByRegion: [{ region: String, totalRevenue: Number, _id: false }],
  },
}, { timestamps: true });
module.exports = mongoose.model('AnalyticsReport', analyticsReportSchema);