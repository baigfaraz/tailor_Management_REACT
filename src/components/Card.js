import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function MainCard({ image, title, button, functionName , path}) {
  return (
    <div>
      <Card
        style={{ width: "18rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        className="cardBackground"
      >
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title className="cardText">{title}</Card.Title>

          <Button
            variant="primary"
            className="cardButton"
            onClick={functionName}
          >
            <Link to={path} className="GetStartedLink">{button}</Link>
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
