import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";

export default function DetailModal({ show, handleClose, modalClassName }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [waist, setWaist] = useState("");
  const [bust, setBust] = useState("");
  const [upperArm, setUpperArm] = useState("");
  const [neckToSleeve, setNeckToSleeve] = useState("");
  const [back, setBack] = useState("");
  const [neckToShoulder, setNeckToShoulder] = useState("");
  const [legLength, setLegLength] = useState("");
  const [dressType, setDressType] = useState("");
  const [neckType, setNeckType] = useState("");
  const [upperPocket, setUpperPocket] = useState(false);
  const [price, setPrice] = useState("");
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [showSmallModal, setShowSmallModal] = useState(false);
  const [noOfSuits, setNoOfSuits] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");

  const handleCloseSmallModal = () => setShowSmallModal(false);
  const handleShowSmallModal = () => setShowSmallModal(true);

  const handlePaymentStatus = (event) => {
    setPaymentStatus(event.target.value);
  };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/customerDetail",
        {
          customer_name: name,
          customer_contact: contact,
          customer_waist: waist,
          customer_bust: bust,
          customer_upperArm: upperArm,
          customer_neckToSleeve: neckToSleeve,
          customer_back: back,
          customer_neckToShoulder: neckToShoulder,
          customer_legLength: legLength,
          customer_upperPocket: upperPocket,
          customer_dressDesign: dressType,
          customer_neckStyle: neckType,
          customer_orderPrice: price,
          customer_orderStatus: orderStatus,
          customer_paymentStatus: paymentStatus,
          customer_noOfSuits: noOfSuits,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(name);
      handleCloseSmallModal();
      setName("");
      setContact("");
      setWaist("");
      setBust("");
      setUpperArm("");
      setNeckToSleeve("");
      setBack("");
      setNeckToShoulder("");
      setLegLength("");
      setDressType("");
      setNeckType("");
      setPrice("");
      setOrderStatus("Pending");
      setUpperPocket(false);
      setPaymentStatus("Pending");
      setNoOfSuits("");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <>
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
                    value={name}
                    onChange={(event) => setName(event.target.value)}
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
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
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
                    value={waist}
                    onChange={(event) => setWaist(event.target.value)}
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
                    value={bust}
                    onChange={(event) => setBust(event.target.value)}
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
                    value={upperArm}
                    onChange={(event) => setUpperArm(event.target.value)}
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
                    value={neckToSleeve}
                    onChange={(event) => setNeckToSleeve(event.target.value)}
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
                    value={back}
                    onChange={(event) => setBack(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  controlId="neckToShoulder"
                  className="LabelandField"
                >
                  <Form.Label>Neck To Shoulder</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Neck To Shoulder"
                    className="textField"
                    value={neckToShoulder}
                    onChange={(event) => setNeckToShoulder(event.target.value)}
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
                    value={legLength}
                    onChange={(event) => setLegLength(event.target.value)}
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
                    value="Kurta"
                    checked={dressType === "Kurta"}
                    onChange={handleDressType}
                  />
                </Col>
                <Col className="col">
                  <Form.Check
                    type="radio"
                    label="Shalwar"
                    name="styleRadio"
                    value="Shalwar"
                    checked={dressType === "Shalwar"}
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
                    value="Color"
                    checked={neckType === "Color"}
                    onChange={handleNeckType}
                  />
                </Col>
                <Col className="col">
                  <Form.Check
                    type="radio"
                    label="Ban"
                    name="designRadio"
                    value="Ban"
                    checked={neckType === "Ban"}
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
                <Form.Group controlId="noOfSuits" className="LabelandField">
                  <Form.Label>No of Suits </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter no of Suits"
                    className="textField"
                    value={noOfSuits}
                    onChange={(event) => setNoOfSuits(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="price" className="LabelandField">
                  <Form.Label>Price Per Suit </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Price"
                    className="textField"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="paymentStatus" className="LabelandField">
              <Row className="row">
                <Col className="col">
                  <Form.Check
                    type="radio"
                    label="Payment Pending"
                    name="paymentStatusRadio"
                    value="Pending"
                    checked={paymentStatus === "Pending"}
                    onChange={handlePaymentStatus}
                  />
                </Col>
                <Col className="col">
                  <Form.Check
                    type="radio"
                    label="Payment Complete"
                    name="paymentStatusRadio"
                    value="Complete"
                    checked={paymentStatus === "Complete"}
                    onChange={handlePaymentStatus}
                  />
                </Col>
              </Row>
            </Form.Group>
            <text className="customerDetailText">Order Status</text>
            <Form.Group controlId="status" className="LabelandField">
              <Row className="row">
                <Col className="col">
                  <Form.Check
                    type="radio"
                    label="Order Pending"
                    name="statusRadio"
                    value="Pending"
                    checked={orderStatus === "Pending"}
                    onChange={handleOrderStatus}
                  />
                </Col>
                <Col className="col">
                  <Form.Check
                    type="radio"
                    label="Order Complete"
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
          <Button variant="secondary" onClick={handleClose} className="button">
            Close
          </Button>

          <Button
            variant="primary"
            className="button"
            onClick={handleShowSmallModal}
          >
            Add Detail
          </Button>
        </Modal.Footer>
      </Modal>

      {/* small modal confirmation model*/}
      <Modal show={showSmallModal} onHide={handleCloseSmallModal}>
        <Modal.Header className="customModalHeader">
          <Modal.Title className="customModalTitle">
            Add Customer Detail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="customModalBody">
          Click on confirm if you want to add!
        </Modal.Body>
        <Modal.Footer className="customModalFooter">
          <Button
            variant="secondary"
            onClick={handleCloseSmallModal}
            className="button"
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="button">
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
