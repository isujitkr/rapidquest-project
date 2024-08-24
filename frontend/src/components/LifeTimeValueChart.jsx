import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getCustomerLifetimeValue } from '../services/api';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register required components with Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const CustomerLifetimeValueChart = () => {
  const [chartData, setChartData] = useState({
    labels: [], 
    datasets: [{
      label: 'Customer Lifetime Value',
      data: [],
      backgroundColor: 'rgba(54,162,235,0.6)',
      borderColor: 'rgba(54,162,235,1)',
      borderWidth: 1,
    }]
  });

  useEffect(() => {
    getCustomerLifetimeValue()
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          const sortedData = data.sort((a, b) => new Date(a._id) - new Date(b._id));

          const labels = sortedData.map(item => item._id || 'Unknown');
          const lifetimeValueData = sortedData.map(item => item.totalLifetimeValue || 0);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Customer Lifetime Value',
                data: lifetimeValueData,
                backgroundColor: 'rgba(54,162,235,0.6)',
                borderColor: 'rgba(54,162,235,1)',
                borderWidth: 1,
              },
            ],
          });
        }
      })
      .catch(error => console.error('Error fetching customer lifetime value data:', error));
  }, []);

  return <Bar data={chartData} />;
};

export default CustomerLifetimeValueChart;
