// src/components/CustomerList.js
import React, { useState } from "react";
import Header from "./Header";
import ShowDetailModal from "./ShowDetailModal";

const AllCustomer = () => {
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      Phone_Number: "0182721301773",
      status: "Complete",
      measurements: {
        chest: "10",
        waist: "20",
        hips: "43",
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      Phone_Number: "032676878768678",
      status: "Pending",
      measurements: {
        chest: "10",
        waist: "20",
        hips: "43",
      },
    },
    {
      id: 3,
      name: "Jane Smith",
      Phone_Number: "032676878768678",
      status: "Pending",
      measurements: {
        chest: "10",
        waist: "20",
        hips: "43",
      },
    },
  ]);


  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const customerDetail =() =>{
    handleOpenModal();
  }

  return (
    <div className="adjustCustomerListScreen">
      <Header />
      <text className="allcustomerListText">All Customers</text>
      <div class="table-container">
        <table class="custom-table">
          <thead class="table-header">
            <tr>
              <th class="header-cell">Customer No</th>
              <th class="header-cell">Name</th>
              <th class="header-cell">Contact No</th>
              <th class="header-cell">Order Status</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} class="body-cell" onClick={customerDetail}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.Phone_Number}</td>
                {customer.status === "Complete" ? (
                  <td className="CompleteStatus">{customer.status}</td>
                ) : (
                  <td className="PendingStatus">{customer.status}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <ShowDetailModal show={showModal} handleClose={handleCloseModal} modalClassName="customModal"/>
      </div>
    </div>
  );
};

export default AllCustomer;
