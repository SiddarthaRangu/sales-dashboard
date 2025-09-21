const express = require('express');
const router = express.Router();
const { generateAnalyticsReport, getReportHistory } = require('../controllers/analyticsController');
const { validateReportRequest } = require('../middlewares/validator');

router.post('/', validateReportRequest, generateAnalyticsReport);

router.get('/history', getReportHistory);

module.exports = router;