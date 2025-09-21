import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/reports`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends a request to the backend to generate a new report.
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Promise} 
 */
export const generateReport = (startDate, endDate) => {
  return apiClient.post('/', { startDate, endDate });
};

/**
 * Fetches the history of previously generated reports.
 * @returns {Promise} 
 */
export const fetchHistory = () => {
  return apiClient.get('/history');
};