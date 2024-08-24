import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getSalesOverTime } from '../services/api';

const SalesOverTimeChart = ({ timeFrame }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!timeFrame) return;

    getSalesOverTime(timeFrame)
      .then(response => {
        const data = response.data;
        let labels = [];
        let salesData = [];

        if (timeFrame === 'quarterly') {
          labels = data.map(item => `${item._id.year}-Q${item._id.quarter}`);
        } else if (timeFrame === 'monthly') {
          labels = data.map(item => `${item._id.year}-${String(item._id.month).padStart(2, '0')}`);
        } else if (timeFrame === 'daily') {
          labels = data.map(item => item._id.date);
        } else if (timeFrame === 'yearly') {
          labels = data.map(item => item._id.year);
        }

        salesData = data.map(item => item.totalSales);

        setChartData({
          labels,
          datasets: [
            {
              label: `Total Sales Over Time (${timeFrame})`,
              data: salesData,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching sales over time data:', error);
        setError('Error fetching data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [timeFrame]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return chartData ? <Line data={chartData} /> : null;
};

export default SalesOverTimeChart;
