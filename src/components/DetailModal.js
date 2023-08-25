import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function DetailModal({ show, handleClose, modalClassName }) {
  const [dressType, setDressType] = useState("");
  const [neckType, setNeckType] = useState("");
  const [upperPocket, setUpperPocket] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Pending");

  const handleOrderStatus = (event) => {
    setOrderStatus(event.target.value);
  };

  const handleCheckboxChange = () => {
    setUpperPocket(!upperPocket);
  };

  const handleDressType = (event) => {
    setDressType(event.target.value);
  };
  const handleNeckType = (event) => {
    setNeckType(event.target.value);
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      fullscreen
      className={modalClassName}
    >
      <Modal.Header className="customModalHeader">
        <Modal.Title className="customModalTitle">
          Add Customer Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="customModalBody">
        <Form>
          <text className="customerDetailText">Customer Details</text>
          <Row className="row">
            <Col>
              <Form.Group controlId="firstName" className="LabelandField">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter First Name"
                  className="textField"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="phoneNumber" className="LabelandField">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter Contact No"
                  className="textField"
                />
              </Form.Group>
            </Col>
          </Row>

          <text className="customerDetailText">Customer Measurements</text>
          <Row className="row">
            <Col>
              <Form.Group controlId="waist" className="LabelandField">
                <Form.Label>Waist</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Waist"
                  className="textField"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="bust" className="LabelandField">
                <Form.Label>Bust</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Bust"
                  className="textField"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="upperArm" className="LabelandField">
                <Form.Label>Upper Arm</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Upper Arm Length"
                  className="textField"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="NeckToSleeve" className="LabelandField">
                <Form.Label>Neck To Sleeve</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Neck To Sleeve Length"
                  className="textField"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="back" className="LabelandField">
                <Form.Label>Back</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Back"
                  className="textField"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="neckToShoulder" className="LabelandField">
                <Form.Label>Neck To Shoulder</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Neck To Shoulder"
                  className="textField"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="legLength" className="LabelandField">
                <Form.Label>Leg Length</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Leg Length "
                  className="textField"
                />
              </Form.Group>
            </Col>
          </Row>
          <text className="customerDetailText">Customer Requirements</text>

          <Form.Group controlId="style" className="LabelandField">
            <Row className="row">
              <Col className="col">
                <Form.Check
                  type="radio"
                  label="Kurta"
                  name="styleRadio"
                  value="kurta"
                  checked={dressType === "kurta"}
                  onChange={handleDressType}
                />
              </Col>
              <Col className="col">
                <Form.Check
                  type="radio"
                  label="Shalwar"
                  name="styleRadio"
                  value="shalwar"
                  checked={dressType === "shalwar"}
                  onChange={handleDressType}
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="design" className="LabelandField">
            <Row className="row">
              <Col className="col">
                <Form.Check
                  type="radio"
                  label="Color"
                  name="designRadio"
                  value="color"
                  checked={neckType === "color"}
                  onChange={handleNeckType}
                />
              </Col>
              <Col className="col">
                <Form.Check
                  type="radio"
                  label="Ban"
                  name="designRadio"
                  value="ban"
                  checked={neckType === "ban"}
                  onChange={handleNeckType}
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group controlId="upperPocket" className="LabelandField">
            <Row className="row">
              <Form.Check
                type="checkbox"
                label="Upper Pocket"
                checked={upperPocket}
                onChange={handleCheckboxChange}
              />
            </Row>
          </Form.Group>
          <text className="customerDetailText">Payment Detail</text>
          <Row className="row">
            <Col>
              <Form.Group controlId="price" className="LabelandField">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Price"
                  className="textField"
                />
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
