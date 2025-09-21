import { Grid, Paper, Typography,} from '@mui/material';

const MetricCard = ({ title, value }) => (
  <Grid item xs={12} sm={4}>
    <Paper sx={{ 
      p: 3, 
      textAlign: 'center', 
      height: '100%',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      transition: 'box-shadow 0.2s ease',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }
    }}>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
        {value}
      </Typography>
    </Paper>
  </Grid>
);

export default MetricCard;