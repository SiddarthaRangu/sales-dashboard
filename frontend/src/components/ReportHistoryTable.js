import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, Chip, Box 
} from '@mui/material';
import { History } from 'lucide-react';
import { formatCurrencyUSD } from '../utils/formatters';

const ReportHistoryTable = ({ reports }) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <History size={24} style={{ marginRight: 12 }} />
      <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
        Report History
      </Typography>
    </Box>
    
    {reports.length === 0 ? (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary" variant="h6">
          No reports generated yet
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
          Generate your first report to see it here
        </Typography>
      </Paper>
    ) : (
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table aria-label="report history table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>
                Generated On
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>
                Date Range
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                Total Revenue
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow 
                key={report._id} 
                sx={{ 
                  '&:hover': { backgroundColor: '#f8fafc' },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell sx={{ fontSize: '0.95rem' }}>
                  <Box>
                    {new Date(report.generatedAt).toLocaleDateString()}
                    <Typography variant="body2" color="text.secondary">
                      {new Date(report.generatedAt).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '0.95rem' }}>
                  <Chip 
                    label={`${new Date(report.startDate).toLocaleDateString()} - ${new Date(report.endDate).toLocaleDateString()}`}
                    variant="outlined"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: report.metrics.totalRevenue > 100000 ? '#059669' : '#2563eb'
                    }}
                  >
                    {formatCurrencyUSD(report.metrics.totalRevenue)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Box>
);

export default ReportHistoryTable;