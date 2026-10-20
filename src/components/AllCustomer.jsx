import { useEffect, useState } from "react";
import Header from "./Header";
import ShowDetailModal from "./ShowDetailModal";
import { deleteCustomer, getCustomer, listCustomers } from "../api/customers";
import { errorMessage } from "../api/errors";
import { Trash } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const AllCustomer = () => {
  const [showModal, setShowModal] = useState(false);
  const [someData, setSomeData] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const [customerToDelete, setCustomerToDelete] = useState(null);
  // "loading" | "error" | "ready" (UX-003)
  const [listStatus, setListStatus] = useState("loading");
  const [listError, setListError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getSomeData();
  }, []);

  // Reloads the list. A failed refresh keeps the rows already on screen.
  const getSomeData = async () => {
    try {
      setSomeData(await listCustomers());
      setListStatus("ready");
    } catch (error) {
      setListError(errorMessage(error, "Could not load customers."));
      setListStatus((status) => (status === "ready" ? status : "error"));
    }
  };

  const retryLoad = () => {
    setListStatus("loading");
    getSomeData();
  };

  const getCustomerDetail = async (id) => {
    setActionError("");
    try {
      setCustomerData(await getCustomer(id));
      return true;
    } catch (error) {
      setActionError(errorMessage(error, "Could not open this customer."));
      return false;
    }
  };

  const handleDeleteCustomer = async (id) => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteCustomer(id);
      setCustomerToDelete(null);
      getSomeData();
    } catch (error) {
      setDeleteError(errorMessage(error, "Could not delete this customer."));
    } finally {
      setDeleting(false);
    }
  };

  const closeDeleteDialog = () => {
    setCustomerToDelete(null);
    setDeleteError("");
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
      <div className="table-container">
        {actionError && (
          <p role="alert" className="dataNotFound">
            {actionError}
          </p>
        )}
        {listStatus === "loading" ? (
          <div className="nodataText" role="status">
            <text>Loading customers…</text>
          </div>
        ) : listStatus === "error" ? (
          <div className="nodataText" role="alert">
            <text>{listError}</text>
            <Button className="button ms-3" onClick={retryLoad}>
              Retry
            </Button>
          </div>
        ) : someData.length > 0 ? (
          <table className="custom-table">
            <thead className="table-header">
              <tr>
                <th className="header-cell">Customer No</th>
                <th className="header-cell">Name</th>
                <th className="header-cell">Contact No</th>
                <th className="header-cell">Order Status</th>
                <th className="header-cell">Payment Status</th>
                <th className="header-cell">{""}</th>
              </tr>
            </thead>

            <tbody>
              {someData.map((customer) => (
                <tr key={customer.customer_id} className="body-cell">
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
        <Modal show={customerToDelete !== null} onHide={closeDeleteDialog}>
          <Modal.Header className="customModalHeader">
            <Modal.Title className="customModalTitle">
              Delete customer
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="customModalBody">
            Delete {customerToDelete?.customer_name} (Customer No{" "}
            {customerToDelete?.customer_id})? This cannot be undone.
            {deleteError && (
              <p role="alert" className="dataNotFound">
                {deleteError}
              </p>
            )}
          </Modal.Body>
          <Modal.Footer className="customModalFooter">
            <Button
              variant="secondary"
              onClick={closeDeleteDialog}
              className="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="button"
              disabled={deleting}
              onClick={() => handleDeleteCustomer(customerToDelete.customer_id)}
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
