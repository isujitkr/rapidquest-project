import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getGeographicalDistribution } from '../services/api';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register required components with Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement, // Register ArcElement for Doughnut charts
  CategoryScale,
  LinearScale
);

const GeographicalDistributionChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Geographical Distribution',
        data: [],
        backgroundColor: [
          'rgba(255,99,132,0.6)',
          'rgba(54,162,235,0.6)',
          'rgba(255,206,86,0.6)',
          'rgba(75,192,192,0.6)',
          'rgba(153,102,255,0.6)',
          'rgba(255,159,64,0.6)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54,162,235,1)',
          'rgba(255,206,86,1)',
          'rgba(75,192,192,1)',
          'rgba(153,102,255,1)',
          'rgba(255,159,64,1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    getGeographicalDistribution()
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item._id);
        const distributionData = data.map(item => item.customerCount);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Geographical Distribution',
              data: distributionData,
              backgroundColor: [
                'rgba(255,99,132,0.6)',
                'rgba(54,162,235,0.6)',
                'rgba(255,206,86,0.6)',
                'rgba(75,192,192,0.6)',
                'rgba(153,102,255,0.6)',
                'rgba(255,159,64,0.6)',
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54,162,235,1)',
                'rgba(255,206,86,1)',
                'rgba(75,192,192,1)',
                'rgba(153,102,255,1)',
                'rgba(255,159,64,1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => console.error('Error fetching geographical distribution data:', error));
  }, []);

  return <Doughnut data={chartData} />;
};

export default GeographicalDistributionChart;
