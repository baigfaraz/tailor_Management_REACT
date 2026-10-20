import React, { useEffect, useState } from "react";
import Header from "./Header";
import ShowDetailModal from "./ShowDetailModal";
import { deleteCustomer, getCustomer, listCustomers } from "../api/customers";
import { Trash } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const AllCustomer = () => {
  const [showModal, setShowModal] = useState(false);
  const [someData, setSomeData] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const [customerToDelete, setCustomerToDelete] = useState(null);

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
      setSomeData(await listCustomers());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCustomerDetail = async (id) => {
    try {
      setCustomerData(await getCustomer(id));
      return true;
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
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

  // Open only after the new customer has loaded, so the modal never shows the previous one.
  const customerDetail = async (id) => {
    if (await getCustomerDetail(id)) {
      handleOpenModal();
    }
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
                        setCustomerToDelete(customer);
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
        <Modal
          show={customerToDelete !== null}
          onHide={() => setCustomerToDelete(null)}
        >
          <Modal.Header className="customModalHeader">
            <Modal.Title className="customModalTitle">
              Delete customer
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="customModalBody">
            Delete {customerToDelete?.customer_name} (Customer No{" "}
            {customerToDelete?.customer_id})? This cannot be undone.
          </Modal.Body>
          <Modal.Footer className="customModalFooter">
            <Button
              variant="secondary"
              onClick={() => setCustomerToDelete(null)}
              className="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="button"
              onClick={async () => {
                await handleDeleteCustomer(customerToDelete.customer_id);
                setCustomerToDelete(null);
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
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
