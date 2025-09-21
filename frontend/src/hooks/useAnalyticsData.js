import { useState, useEffect, useCallback } from 'react';
import { generateReport, fetchHistory } from '../services/apiService';
import { socket } from '../services/socketService';

/**
 * A custom hook to manage all analytics data, state, and real-time updates for the dashboard.
 * @returns {object} The state and functions needed by the dashboard page.
 */
export const useAnalytics = () => {
  const [currentReport, setCurrentReport] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch the initial report history. Wrapped in useCallback for optimization.
  const loadInitialHistory = useCallback(async () => {
    try {
      const { data } = await fetchHistory();
      setReportHistory(data);
    } catch (err) {
      setError("Failed to load report history. Please refresh the page.");
    }
  }, []);

  // Effect to load initial data and set up WebSocket listener on component mount.
  useEffect(() => {
    loadInitialHistory();

    const handleNewReport = (newReport) => {
      setReportHistory(prevHistory => [newReport, ...prevHistory]);
    };
    
    socket.on('new_report_available', handleNewReport);

    return () => {
      socket.off('new_report_available', handleNewReport);
    };
  }, [loadInitialHistory]);

  const generateNewReport = async (startDate, endDate) => {
    setIsLoading(true);
    setError('');
    setCurrentReport(null);
    try {
      const { data } = await generateReport(startDate, endDate);
      setCurrentReport(data);
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "An unknown error occurred.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    currentReport, 
    reportHistory, 
    isLoading, 
    error, 
    generateReport: generateNewReport 
  };
};