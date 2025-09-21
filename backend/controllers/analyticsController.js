const Sale = require('../models/Sale');
const AnalyticsReport = require('../models/AnalyticsReport');

/**
 * @desc    Generate a new analytics report based on a date range.
 * @route   POST /api/reports
 * @access  Public
 */
exports.generateAnalyticsReport = async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const dateFilter = { reportDate: { $gte: new Date(startDate), $lte: new Date(endDate) } };

    const [kpiMetrics, topProducts, salesByRegion] = await Promise.all([
      // Pipeline 1: Calculate Key Performance Indicators (KPIs)
      Sale.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, totalRevenue: { $sum: '$totalRevenue' }, totalSales: { $sum: 1 }}},
        { $project: { _id: 0, totalRevenue: 1, totalSales: 1,
            avgOrderValue: { $cond: [{ $eq: ['$totalSales', 0] }, 0, { $divide: ['$totalRevenue', '$totalSales'] }] }
        }},
      ]),
      // Pipeline 2: Find the top 5 selling products by quantity
      Sale.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$productId', totalQuantity: { $sum: '$quantity' } } },
        { $sort: { totalQuantity: -1 } }, { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productInfo' } },
        { $unwind: '$productInfo' },
        { $project: { _id: 0, name: '$productInfo.name', totalQuantity: 1 } },
      ]),
      // Pipeline 3: Aggregate total revenue by customer region
      Sale.aggregate([
        { $match: dateFilter },
        { $lookup: { from: 'customers', localField: 'customerId', foreignField: '_id', as: 'customerInfo' }},
        { $unwind: '$customerInfo' },
        { $group: { _id: '$customerInfo.region', totalRevenue: { $sum: '$totalRevenue' }}},
        { $sort: { totalRevenue: -1 }},
        { $project: { _id: 0, region: '$_id', totalRevenue: 1 }}
      ]),
    ]);

    // Create a new report document with the aggregated metrics
    const reportData = kpiMetrics[0] || { totalRevenue: 0, totalSales: 0, avgOrderValue: 0 };
    const newReport = new AnalyticsReport({
      startDate, endDate,
      metrics: {
        totalRevenue: reportData.totalRevenue,
        totalSales: reportData.totalSales,
        avgOrderValue: reportData.avgOrderValue,
        topSellingProducts: topProducts,
        salesByRegion: salesByRegion,
      }
    });
    await newReport.save();
    
    req.io.emit('new_report_available', newReport);

    res.status(201).json(newReport);
  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({ message: 'An internal server error occurred while generating the report.' });
  }
};

/**
 * @desc    Retrieve the history of previously generated reports.
 * @route   GET /api/reports/history
 * @access  Public
 */
exports.getReportHistory = async (req, res) => {
    try {
        const reports = await AnalyticsReport.find().sort({ generatedAt: -1 }).limit(20);
        res.status(200).json(reports);
    } catch (error) {
        console.error("Fetch History Error:", error);
        res.status(500).json({ message: 'Failed to retrieve report history.' });
    }
};