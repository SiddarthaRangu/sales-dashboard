import ReactECharts from 'echarts-for-react';
import { Paper, Typography, Box } from '@mui/material';
import { formatCurrencyUSD } from '../../utils/formatters';

const RegionPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary" variant="h6">No region data for this period.</Typography>
      </Paper>
    );
  }
    
  const chartOption = {
    title: { 
      show: false  
    },
    tooltip: { 
      trigger: 'item', 
      formatter: (params) => `${params.name}<br/>Revenue: ${formatCurrencyUSD(params.value)}<br/>Percentage: ${params.percent}%`,
      textStyle: { fontSize: 14 }
    },
    legend: { 
      orient: 'horizontal', 
      bottom: '5%',
      left: 'center',
      textStyle: { 
        fontSize: 16,
        fontWeight: 'bold'
      },
      itemWidth: 25,
      itemHeight: 14
    },
    series: [{
      name: 'Revenue by Region', 
      type: 'pie', 
      radius: ['25%', '75%'],
      center: ['50%', '45%'],
      data: data.map(item => ({ value: item.totalRevenue, name: item.region })),
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 3
      },
      label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold',
        formatter: '{b}\n{c}'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  return (
    <Paper sx={{ p: 4, width: '100%' }}>
      <Box sx={{ height: 550, width: '100%' }}>
        <ReactECharts 
          option={chartOption} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </Box>
    </Paper>
  );
};

export default RegionPieChart;