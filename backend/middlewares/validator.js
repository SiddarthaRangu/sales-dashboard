const { body, validationResult } = require('express-validator');

const validateReportRequest = [
  body('startDate').isISO8601().toDate().withMessage('Start date must be a valid ISO 8601 date.'),
  body('endDate').isISO8601().toDate().withMessage('End date must be a valid ISO 8601 date.')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date.');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateReportRequest };