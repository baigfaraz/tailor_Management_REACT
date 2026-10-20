import { useState } from "react";
import MainCard from "./Card";
import imageSrc from "../assets/measure.png";
import customerImage from "../assets/customer.png";
import paymentImage from "../assets/payment.png";
import Header from "./Header";
import DetailModal from "./DetailModal";
import Alert from "react-bootstrap/Alert";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [savedCustomer, setSavedCustomer] = useState(null);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const addCustomer = () => {
    setSavedCustomer(null);
    handleOpenModal();
  };

  const searchCustomer = () => {};
  return (
    <>
      <Header />

      <div className="homePage">
        {savedCustomer && (
          <Alert
            variant="success"
            role="status"
            className="align-self-center mt-3 mb-0"
            dismissible
            onClose={() => setSavedCustomer(null)}
          >
            Customer added: {savedCustomer.customer_name} (Customer No{" "}
            {savedCustomer.customer_id})
          </Alert>
        )}
        <div className="description">
          <text className="descriptionText">
            Our Platform give ease for tailors, Here you can manage every
            details of customer such like measurements , payments and status of
            orders. Let&apos;s start to try it for free.
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
            onSaved={setSavedCustomer}
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
