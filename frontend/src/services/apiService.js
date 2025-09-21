import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api/reports',
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