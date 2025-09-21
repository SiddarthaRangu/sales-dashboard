import { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalyticsData';
import { 
  Container, Grid, Paper, Typography, Button, Box, 
  CircularProgress, Alert 
} from '@mui/material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { formatCurrencyUSD } from '../utils/formatters';
import ReportHistoryTable from '../components/ReportHistoryTable';
import TopProductsChart from '../components/charts/TopProductsChart';
import RegionPieChart from '../components/charts/RegionPieChart';
import MetricCard from '../components/MetricCard';

const DashboardPage = () => {
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  
  const { currentReport, reportHistory, isLoading, error, generateReport } = useAnalytics();

  const handleGenerateReportClick = () => {
    generateReport(startDate, endDate);
  };
  
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Sales Analytics Dashboard
        </Typography>
      </Box>

      {/* Controls Section */}
      <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Generate Report
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          flexWrap: 'wrap', 
          alignItems: 'center', 
          gap: 3 
        }}>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
          <Button variant="contained" onClick={handleGenerateReportClick} disabled={isLoading} size="large">
            {isLoading ? 'Generating...' : 'Generate Report'}
          </Button>
        </Box>
      </Paper>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={60} />
        </Box>
      )}
      
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

      {currentReport && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            Current Report
          </Typography>
          
          {/* Metrics Row */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <MetricCard title="Total Revenue" value={formatCurrencyUSD(currentReport.metrics.totalRevenue)} />
            <MetricCard title="Total Sales" value={currentReport.metrics.totalSales.toLocaleString()} />
            <MetricCard title="Avg. Order Value" value={formatCurrencyUSD(currentReport.metrics.avgOrderValue)} />
          </Grid>
          
          {/* Charts Section*/}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
              Top Selling Products
            </Typography>
            <TopProductsChart data={currentReport.metrics.topSellingProducts} />
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
              Revenue Distribution by Region
            </Typography>
            <RegionPieChart data={currentReport.metrics.salesByRegion} />
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 5 }}>
        <ReportHistoryTable reports={reportHistory} />
      </Box>
    </Container>
  );
};

export default DashboardPage;