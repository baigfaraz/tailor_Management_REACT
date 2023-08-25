// src/components/CustomerDetails.js
import React, { useState } from "react";
import '../App.css'

const CustomerDetails = ({ customer }) => {
  const [measurements, setMeasurements] = useState({
    chest: customer.measurements.chest,
    waist: customer.measurements.waist,
    hips: customer.measurements.hips,
    // Add more measurements as needed
  });

  const handleMeasurementChange = (event) => {
    const { name, value } = event.target;
    setMeasurements((prevMeasurements) => ({
      ...prevMeasurements,
      [name]: value,
    }));
  };

  const handleSaveMeasurements = () => {
  
    console.log("Updated Measurements:", measurements);
  };

  const handleCompleteOrder = () => {
    
  };

  return (
    <div className="CustomerDetails">
      <h2 className="DetailsHeader">Customer Details</h2>
      <h3 className="DetailName">Name: {customer.name}</h3>
      <h4 className="DetailContact">Contact No: {customer.Phone_Number}</h4>
      <h4 className="DetailStatus">Order Status: {customer.status}</h4>
      <h4 className="DetailMeasurements">Measurements:</h4>
      <div className="MeasurementField">
        <label className="MeasurementLabel">Chest:</label>
        <input
          type="text"
          name="chest"
          value={measurements.chest}
          onChange={handleMeasurementChange}
          className="MeasurementInput"
        />
      </div>
      <div className="MeasurementField">
        <label className="MeasurementLabel">Waist:</label>
        <input
          type="text"
          name="waist"
          value={measurements.waist}
          onChange={handleMeasurementChange}
          className="MeasurementInput"
        />
      </div>
      <div className="MeasurementField">
        <label className="MeasurementLabel">Hips:</label>
        <input
          type="text"
          name="hips"
          value={measurements.hips}
          onChange={handleMeasurementChange}
          className="MeasurementInput"
        />
      </div>
      <button onClick={handleSaveMeasurements} className="SaveButton">
        Save
      </button>
      <button onClick={handleCompleteOrder} className="CompleteButton">
        Complete Order
      </button>
    </div>
  );
};

export default CustomerDetails;
