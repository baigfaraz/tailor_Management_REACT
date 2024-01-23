import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

export default function ShowDetailModal({
  show,
  handleClose,
  modalClassName,
  data,
}) {
  const [updatedOrderStatus, setUpdatedOrderStatus] = useState();
  const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  const handleOpenConfirmationModal = (action) => {
    setConfirmationAction(action);
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmationAction(null);
  };

  const handleConfirmAction = async () => {
    if (confirmationAction === "orderComplete") {
      await handleOrderComplete();
    } else if (confirmationAction === "completePayment") {
      await handlePaymentComplete();
    }
    handleCloseConfirmationModal();
  };

  const handlePaymentComplete = async () => {
    const newStatus =
      data.customer_paymentStatus === "Pending" ? "Complete" : "Pending";
    setUpdatedPaymentStatus(newStatus);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/customerDetail/paymentStatus/${data.customer_id}`,
        {
          customer_paymentStatus: newStatus,
        }
      );
      console.log(response.data.customer_paymentStatus);
    } catch (error) {
      console.error("Error in updating data:", error);
    }
    handleClose();
  };

  const handleOrderComplete = async () => {
    const newStatus =
      data.customer_orderStatus === "Pending" ? "Complete" : "Pending";
    setUpdatedOrderStatus(newStatus);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/customerDetail/orderStatus/${data.customer_id}`,
        {
          customer_orderStatus: newStatus,
        }
      );
      console.log(response.data.customer_orderStatus);
    } catch (error) {
      console.error("Error in updating data:", error);
    }
    handleClose();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="l"
        halfscreen
        className={modalClassName}
      >
        <Modal.Header className="customModalHeader">
          <Modal.Title className="customModalTitle">
            Customer Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="customModalBody">
          <Form>
            <text className="customerDetailText">Customer Details</text>
            <Col>
              <Row>
                <Form.Group controlId="firstName" className="LabelandField">
                  <Form.Label className="label">Name : </Form.Label>
                  <p>{data.customer_name}</p>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group controlId="phoneNumber" className="LabelandField">
                  <Form.Label className="label">Contact : </Form.Label>
                  <p>{data.customer_contact}</p>
                </Form.Group>
              </Row>
            </Col>

            <text className="customerDetailText">Customer Measurements</text>
            <Col>
              <Row>
                <Form.Group controlId="waist" className="LabelandField">
                  <Form.Label className="label">Waist : </Form.Label>
                  <p>{data.customer_waist}</p>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group controlId="bust" className="LabelandField">
                  <Form.Label className="label">Bust : </Form.Label>
                  <p>{data.customer_bust}</p>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group controlId="upperArm" className="LabelandField">
                  <Form.Label className="label">Upper Arm : </Form.Label>
                  <p>{data.customer_upperArm}</p>
                </Form.Group>
              </Row>

              <Form.Group controlId="NeckToSleeve" className="LabelandField">
                <Form.Label className="label">Neck To Sleeve : </Form.Label>
                <p>{data.customer_neckToSleeve}</p>
              </Form.Group>

              <Row>
                <Form.Group controlId="back" className="LabelandField">
                  <Form.Label className="label">Back : </Form.Label>
                  <p>{data.customer_back}</p>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group
                  controlId="neckToShoulder"
                  className="LabelandField"
                >
                  <Form.Label className="label">Neck To Shoulder : </Form.Label>
                  <p>{data.customer_neckToShoulder}</p>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group controlId="legLength" className="LabelandField">
                  <Form.Label className="label">Leg Length : </Form.Label>
                  <p>{data.customer_legLength}</p>
                </Form.Group>
              </Row>
            </Col>
            <text className="customerDetailText">Customer Requirements</text>

            <Col>
              <Row>
                <Form.Group controlId="dressStyle" className="LabelandField">
                  <Form.Label className="label">Dress design : </Form.Label>
                  <p>{data.customer_dressDesign}</p>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group controlId="neckStyle" className="LabelandField">
                  <Form.Label className="label">Neck design : </Form.Label>
                  <p>{data.customer_neckStyle}</p>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group controlId="upperPocket" className="LabelandField">
                  <Form.Label className="label">Pocket : </Form.Label>
                  {data.customer_upperPocket ? <p>Yes</p> : <p>No</p>}
                </Form.Group>
              </Row>
            </Col>
            <text className="customerDetailText">Payment Detail</text>
            <Col>
              <Row>
                <Form.Group controlId="price" className="LabelandField">
                  <Form.Label className="label">Price per suit : </Form.Label>
                  <p>{data.customer_orderPrice}</p>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group controlId="noOfSuits" className="LabelandField">
                  <Form.Label className="label">No of suits : </Form.Label>
                  <p>{data.customer_noOfSuits}</p>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group
                  controlId="payementStatus"
                  className="LabelandField"
                >
                  <Form.Label className="label">Payment Status : </Form.Label>
                  {updatedPaymentStatus ? (
                    <p>{updatedPaymentStatus}</p>
                  ) : (
                    <p>{data.customer_paymentStatus}</p>
                  )}
                </Form.Group>
              </Row>
            </Col>
            <text className="customerDetailText">Order Status</text>
            <Row className="row">
              <Col>
                <Form.Group controlId="orderStatus" className="LabelandField">
                  <Form.Label className="label">Order Status : </Form.Label>
                  {updatedOrderStatus ? (
                    <p>{updatedOrderStatus}</p>
                  ) : (
                    <p>{data.customer_orderStatus}</p>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <text className="customerDetailText">Total : </text>
            <Col>
              <Row>
                <Form.Group controlId="totalPayment" className="LabelandField">
                  <Form.Label className="label">Total Payment : </Form.Label>
                  <p>
                    {parseFloat(data.customer_orderPrice) *
                      parseFloat(data.customer_noOfSuits) +
                      " Rs"}
                  </p>
                </Form.Group>
              </Row>
            </Col>
          </Form>
        </Modal.Body>
        <Modal.Footer className="customModalFooter">
          <Button variant="secondary" onClick={handleClose} className="button">
            Close
          </Button>
          {data.customer_paymentStatus === "Pending" ? (
            <Button
              variant="primary"
              onClick={() => handleOpenConfirmationModal("completePayment")}
              className="button"
            >
              Complete Payment
            </Button>
          ) : (
            ""
          )}
          {data.customer_orderStatus === "Pending" ? (
            <Button
              variant="primary"
              onClick={() => handleOpenConfirmationModal("orderComplete")}
              className="button"
            >
              Order Complete
            </Button>
          ) : (
            ""
          )}
        </Modal.Footer>
      </Modal>

      {/* small modal confirmation model*/}
      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header className="customModalHeader">
          <Modal.Title className="customModalTitle">Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="customModalBody">
          Are you sure you want to proceed?
        </Modal.Body>
        <Modal.Footer className="customModalFooter">
          <Button
            variant="secondary"
            onClick={handleCloseConfirmationModal}
            className="button"
          >
            Close
          </Button>
          <Button
            variant="primary"
            className="button"
            onClick={handleConfirmAction}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
