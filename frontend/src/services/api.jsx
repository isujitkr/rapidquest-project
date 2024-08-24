import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getCustomerLifetimeValue = () => axios.get(`${API_BASE_URL}/customer-lifetime-value`);
export const getGeographicalDistribution = () => axios.get(`${API_BASE_URL}/geographical-distribution`);


export const getRepeatCustomers = async (timeFrame = 'quarterly') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/repeat-customers`, {
        params: { timeFrame }
      });
      return response;
    } catch (error) {
      console.error('Error fetching repeat customers data:', error);
      throw error;
    }
};

export const getSalesOverTime = async (timeFrame = 'yearly') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales-over-time`, {
      params: { timeFrame },
    });
    return response;
  } catch (error) {
    console.error('Error fetching sales over time data:', error);
    throw error;
  }
};

export const getSalesGrowthRate = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales-growth-rate`);
    return response;
  } catch (error) {
    console.error('Error fetching sales growth rate:', error);
    throw error; 
  }
};

export const getNewCustomersOverTime = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/new-customers-over-time`, {
      params: { startDate, endDate }
    });
    return response;
  } catch (error) {
    console.error('Error fetching new customers over time:', error);
    throw error;
  }
};
