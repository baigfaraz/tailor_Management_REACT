import React, { useEffect, useState } from "react";
import Header from "./Header";
import ShowDetailModal from "./ShowDetailModal";
import axios from "axios";
import { Trash } from "react-bootstrap-icons";

const AllCustomer = () => {
  const [showModal, setShowModal] = useState(false);
  const [someData, setSomeData] = useState([]);
  const [customerData, setCustomerData] = useState({});

  useEffect(() => {
    getSomeData();
  }, []);

  useEffect(() => {
    if (someData) {
      // console.log(someData);
    }
  }, [someData]);

  const getSomeData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/customerDetail/somedata"
      );
      setSomeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCustomerDetail = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/customerDetail/${id}`
      );
      setCustomerData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/customerDetail/delete/${id}`
      );
      getSomeData();
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    getSomeData();
  };

  const customerDetail = (id) => {
    getCustomerDetail(id);
    handleOpenModal();
  };

  return (
    <div className="adjustCustomerListScreen">
      <Header />
      {someData.length > 0 ? (
        <text className="allcustomerListText">All Customers</text>
      ) : (
        ""
      )}
      <div class="table-container">
        {someData.length > 0 ? (
          <table class="custom-table">
            <thead class="table-header">
              <tr>
                <th class="header-cell">Customer No</th>
                <th class="header-cell">Name</th>
                <th class="header-cell">Contact No</th>
                <th class="header-cell">Order Status</th>
                <th class="header-cell">Payment Status</th>
                <th class="header-cell">{""}</th>
              </tr>
            </thead>

            <tbody>
              {someData.map((customer) => (
                <tr key={customer.customer_id} class="body-cell">
                  <td
                    onClick={() => {
                      customerDetail(customer.customer_id);
                    }}
                  >
                    {customer.customer_id}
                  </td>
                  <td
                    onClick={() => {
                      customerDetail(customer.customer_id);
                    }}
                  >
                    {customer.customer_name}
                  </td>
                  <td
                    onClick={() => {
                      customerDetail(customer.customer_id);
                    }}
                  >
                    {customer.customer_contact}
                  </td>
                  {customer.customer_orderStatus === "Complete" ? (
                    <td
                      className="CompleteStatus"
                      onClick={() => {
                        customerDetail(customer.customer_id);
                      }}
                    >
                      {customer.customer_orderStatus}
                    </td>
                  ) : (
                    <td
                      className="PendingStatus"
                      onClick={() => {
                        customerDetail(customer.customer_id);
                      }}
                    >
                      {customer.customer_orderStatus}
                    </td>
                  )}
                  {customer.customer_paymentStatus === "Complete" ? (
                    <td
                      className="CompleteStatus"
                      onClick={() => {
                        customerDetail(customer.customer_id);
                      }}
                    >
                      {customer.customer_paymentStatus}
                    </td>
                  ) : (
                    <td
                      className="PendingStatus"
                      onClick={() => {
                        customerDetail(customer.customer_id);
                      }}
                    >
                      {customer.customer_paymentStatus}
                    </td>
                  )}
                  <td>
                    <Trash
                      size={18}
                      className="trash"
                      onClick={() => {
                        handleDeleteCustomer(customer.customer_id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="nodataText">
            <text>No data availaible to show!</text>
          </div>
        )}
        <ShowDetailModal
          show={showModal}
          handleClose={handleCloseModal}
          modalClassName="customModal"
          data={customerData}
        />
      </div>
    </div>
  );
};

export default AllCustomer;
