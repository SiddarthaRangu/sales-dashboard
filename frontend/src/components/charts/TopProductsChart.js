import ReactECharts from 'echarts-for-react';
import { Paper, Typography, Box } from '@mui/material';

const TopProductsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary" variant="h6">No product data for this period.</Typography>
      </Paper>
    );
  }

  const chartOption = {
    title: { 
      text: '',  
      show: false
    },
    tooltip: { 
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      textStyle: { fontSize: 14 }
    },
    grid: { 
      left: '8%', 
      right: '8%', 
      bottom: '20%', 
      top: '10%',
      containLabel: true 
    },
    xAxis: { 
      type: 'category', 
      data: data.map(item => item.name), 
      axisLabel: { 
        interval: 0, 
        rotate: 30,
        fontSize: 14,
        fontWeight: 'bold'
      },
      axisLine: { lineStyle: { color: '#666' } }
    },
    yAxis: { 
      type: 'value',
      axisLabel: { 
        fontSize: 14,
        fontWeight: 'bold'
      },
      axisLine: { lineStyle: { color: '#666' } }
    },
    series: [{
      name: 'Quantity Sold', 
      type: 'bar', 
      barWidth: '60%',
      data: data.map(item => item.totalQuantity),
      itemStyle: {
        color: '#2563eb',
        borderRadius: [6, 6, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 12,
        fontWeight: 'bold'
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

export default TopProductsChart;