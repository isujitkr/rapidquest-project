import React , { useState }from 'react';
import './App.css';
import RepeatCustomersChart from './components/RepeatCustomersChart';
import CustomerLifetimeValueChart from './components/LifeTimeValueChart';
import SalesGrowthRateChart from './components/SalesGrowthRateChart';
import GeographicalDistributionChart from './components/GeographicalDistributionChart';
import NewCustomersOverTimeChart from './components/NewCustomersChart';
import DateRangePicker from './components/DateRangePicker';
import SalesOverTimeChart from './components/SalesOverTimeChart';

function App() {

  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [timeFrame, setTimeFrame] = useState('yearly'); 

  const handleDateChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };

  return (
    <div className="App">
      <h1>Analytics Dashboard</h1>
      
      <div className="chart-container">
        <div>
        <select onChange={handleTimeFrameChange} value={timeFrame}>
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <RepeatCustomersChart timeFrame={timeFrame}/>
        </div>
        <div>
          <CustomerLifetimeValueChart />
        </div>

        <div>
          <SalesGrowthRateChart />
        </div>
        
        <div>
          <GeographicalDistributionChart />
        </div>
        
        <div>
          <DateRangePicker onDateChange={handleDateChange} />
          <NewCustomersOverTimeChart 
          startDate={dateRange.startDate} 
          endDate={dateRange.endDate} 
          />
        </div>
        <div>
        <select onChange={handleTimeFrameChange} value={timeFrame}>
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <SalesOverTimeChart timeFrame={timeFrame} />
        </div>
      </div>
    </div>
  );
}

export default App;
