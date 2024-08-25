import React, { useEffect, useRef, useState } from 'react';

const DateRangePicker = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState('2021-01-08');

  const prevStartDateRef = useRef();
  const prevEndDateRef = useRef();

  useEffect(() => {
    if (
      prevStartDateRef.current !== startDate ||
      prevEndDateRef.current !== endDate
    ) {
      onDateChange(startDate, endDate);
    }

    prevStartDateRef.current = startDate;
    prevEndDateRef.current = endDate;
  }, [startDate, endDate, onDateChange]); 

  return (
    <div>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>
  );
};

export default DateRangePicker;
