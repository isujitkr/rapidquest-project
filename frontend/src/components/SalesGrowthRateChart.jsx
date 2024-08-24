import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getSalesGrowthRate } from '../services/api';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';

// Register required components with Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler 
);

const SalesGrowthRateChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sales Growth Rate (%)',
        data: [],
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: true, 
      },
    ],
  });

  useEffect(() => {
    getSalesGrowthRate()
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item.period);
        const growthRateData = data.map(item => parseFloat(item.growthRate));

        setChartData({
          labels,
          datasets: [
            {
              label: 'Sales Growth Rate (%)',
              data: growthRateData,
              borderColor: 'rgba(255,99,132,1)',
              backgroundColor: 'rgba(255,99,132,0.2)',
              fill: true,
            },
          ],
        });
      })
      .catch(error => console.error('Error fetching sales growth rate data:', error));
  }, []);

  return <Line data={chartData} />;
};

export default SalesGrowthRateChart;
