import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

import { getNewCustomersOverTime } from '../services/api';

const NewCustomersOverTimeChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) {
      setError('Please select a start and end date.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getNewCustomersOverTime(startDate, endDate)
      .then(response => {
        const data = response.data;

        if (data && data.length > 0) {
          const labels = data.map(item => item._id);
          const newCustomersData = data.map(item => item.newCustomers);

          setChartData({
            labels,
            datasets: [
              {
                label: 'New Customers Over Time',
                data: newCustomersData,
                borderColor: 'rgba(153,102,255,1)',
                backgroundColor: 'rgba(153,102,255,0.2)',
                fill: true,
              },
            ],
          });
        } else {
          setError('No data available for the selected time period.');
        }
      })
      .catch(error => {
        console.error('Error fetching new customers data:', error);
        setError('Error fetching data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate, endDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {chartData ? <Line data={chartData} options={{
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'P',
            },
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'New Customers',
            },
          },
        },
      }} /> : null}
    </div>
  );
};

export default NewCustomersOverTimeChart;
