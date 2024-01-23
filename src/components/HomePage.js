import React, { useState } from "react";
import MainCard from "./Card";
import imageSrc from "../assets/measure.png";
import customerImage from "../assets/customer.png";
import paymentImage from "../assets/payment.png";
import Header from "./Header";
import DetailModal from "./DetailModal";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const addCustomer = () => {
    handleOpenModal();
  };

  const searchCustomer = () => {};
  return (
    <>
      <Header />

      <div className="homePage">
        <div className="description">
          <text className="descriptionText">
            Our Platform give ease for tailors, Here you can manage every
            details of customer such like measurements , payments and status of
            orders. Let's start to try it for free.
          </text>
        </div>
        <div className="cards">
          <MainCard
            image={imageSrc}
            title="Add Customer Details"
            button="Add Customer"
            functionName={addCustomer}
          />
          <DetailModal
            show={showModal}
            handleClose={handleCloseModal}
            modalClassName="customModal"
          />
          <MainCard
            image={customerImage}
            title="Check Customers"
            button="All Customers"
            path="/Home/AllCustomer"
          />
          <MainCard
            image={paymentImage}
            title="Search Customer"
            button="Search"
            functionName={searchCustomer}
            path="/Home/Search"
          />
        </div>
      </div>
    </>
  );
}
