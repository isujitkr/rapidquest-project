import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {getRepeatCustomers} from '../services/api'; 

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const RepeatCustomersChart = ({ timeFrame }) => {
  const [chartData, setChartData] = useState(null); 

  useEffect(() => {
    getRepeatCustomers(timeFrame)
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item._id); 
        const repeatCustomersData = data.map(item => item.totalOrders); 

        setChartData({
          labels,
          datasets: [
            {
              label: 'Repeat Customers',
              data: repeatCustomersData,
              backgroundColor: 'rgba(255,159,64,0.6)',
              borderColor: 'rgba(255,159,64,1)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => console.error('Error fetching repeat customers data:', error));
  }, [timeFrame]);

  if (!chartData) {
    return <div>Loading...</div>; 
  }

  return <Bar data={chartData} />;
};

export default RepeatCustomersChart;
