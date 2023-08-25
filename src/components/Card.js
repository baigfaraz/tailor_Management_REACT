import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function MainCard({ image, title, button , functionName}) {

  
  return (
    <div>
      <Card
        style={{ width: "18rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        className="cardBackground"
      >
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title className="cardText">{title}</Card.Title>

          <Button variant="primary" className="cardButton" onClick={functionName}>{button}</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
