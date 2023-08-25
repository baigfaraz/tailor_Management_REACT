import React from "react";
import mainImage from "../assets/mainImage.jpg";
import Button from "react-bootstrap/Button";

export default function WelcomePage() {
  return (
    <div className="adjustScreen">
      <div className="getStartedDiv">
        <h1 className="companyName marginTop">Tailor Management System</h1>
        <div className="getStartedDivDescription marginTop">
          <text className="getStartedDivDescriptionText">
            Our Platform give ease for tailors, Here you can manage every
            details of customer such like measurements , payments and status of
            orders.
          </text>
          <br />
          <text className="getStartedDivDescriptionText smallMarinTop">
            Click on 'Get Started' to join our Platform by login with Google!
          </text>
        </div>
        <Button variant="primary" className="cardButton marginTopExtra">
          Get Started
        </Button>
      </div>
      <div className="ImageDiv">
        <img className="mainImage" src={mainImage} alt=" " />
      </div>
    </div>
  );
}
