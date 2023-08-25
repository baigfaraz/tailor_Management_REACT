import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function ShowDetailModal({ show, handleClose, modalClassName }) {
  const [orderStatus, setOrderStatus] = useState("Pending");

  const handleOrderStatus = (event) => {
    setOrderStatus(event.target.value);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="l"
      halfscreen
      className={modalClassName}
    >
      <Modal.Header className="customModalHeader">
        <Modal.Title className="customModalTitle">Customer Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="customModalBody">
        <Form>
          <text className="customerDetailText">Customer Details</text>
          <Col>
            <Row>
              <Form.Group controlId="firstName" className="LabelandField">
                <Form.Label>Name</Form.Label>
                <p>Muhamm Faraz Baig</p>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="phoneNumber" className="LabelandField">
                <Form.Label>Contact</Form.Label>
                <p>03025082569</p>
              </Form.Group>
            </Row>
          </Col>

          <text className="customerDetailText">Customer Measurements</text>
          <Col>
            <Row>
              <Form.Group controlId="waist" className="LabelandField">
                <Form.Label>Waist</Form.Label>
                <p>32 inches</p>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="bust" className="LabelandField">
                <Form.Label>Bust</Form.Label>
                <p>37 inches</p>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="upperArm" className="LabelandField">
                <Form.Label>Upper Arm</Form.Label>
                <p>12 inches</p>
              </Form.Group>
            </Row>
          </Col>
          <Row>
            <Col>
              <Form.Group controlId="NeckToSleeve" className="LabelandField">
                <Form.Label>Neck To Sleeve</Form.Label>
                <p>22 inches</p>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="back" className="LabelandField">
                <Form.Label>Back</Form.Label>
                <p>37 inches</p>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="neckToShoulder" className="LabelandField">
                <Form.Label>Neck To Shoulder</Form.Label>
                <p>6 inches</p>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="legLength" className="LabelandField">
                <Form.Label>Leg Length</Form.Label>
                <p>33 inches</p>
              </Form.Group>
            </Col>
          </Row>
          <text className="customerDetailText">Customer Requirements</text>

          <Col>
            <Row>
              <Form.Group controlId="dressStyle" className="LabelandField">
                <Form.Label>Dress design</Form.Label>
                <p>Kurta</p>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="neckStyle" className="LabelandField">
                <Form.Label>Neck design</Form.Label>
                <p>Color</p>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group controlId="upperPocket" className="LabelandField">
                <Form.Label>Pocket</Form.Label>
                <p>No</p>
              </Form.Group>
            </Row>
          </Col>
          <text className="customerDetailText">Payment Detail</text>
          <Row className="row">
            <Col>
              <Form.Group controlId="price" className="LabelandField">
                <Form.Label>Price</Form.Label>
                <p>900 Rs</p>
              </Form.Group>
            </Col>
          </Row>
          <text className="customerDetailText">Order Status</text>
          <Form.Group controlId="status" className="LabelandField">
            <Row className="row">
              <Col className="col">
                <Form.Check
                  type="radio"
                  label="Pending"
                  name="statusRadio"
                  value="Pending"
                  checked={orderStatus === "Pending"}
                  onChange={handleOrderStatus}
                />
              </Col>
              <Col className="col">
                <Form.Check
                  type="radio"
                  label="Complete"
                  name="statusRadio"
                  value="Complete"
                  checked={orderStatus === "Complete"}
                  onChange={handleOrderStatus}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="customModalFooter">
        <Button
          variant="secondary"
          onClick={handleClose}
          className="customCloseButton"
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleClose}
          className="customSaveButton"
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
