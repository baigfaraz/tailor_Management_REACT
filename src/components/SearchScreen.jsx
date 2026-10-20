import Header from "./Header";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SearchBar from "./Searchbar";
import ShowDetailModal from "./ShowDetailModal";
import { getCustomer } from "../api/customers";
import { errorMessage } from "../api/errors";

const NOT_FOUND = "Customer Not Found.";

export default function SearchScreen() {
  const [customerData, setCustomerData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  const getCustomerDetail = async (id) => {
    setSearching(true);
    try {
      setCustomerData(await getCustomer(id));
      handleOpenModal();
      setSearchError("");
    } catch (error) {
      setCustomerData({});
      // 404 = no such customer, 400 = not a valid customer number (UX-003)
      const status = error.response?.status;
      setSearchError(
        status === 404 || status === 400
          ? NOT_FOUND
          : errorMessage(error, "Could not search right now. Try again."),
      );
    } finally {
      setSearching(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setCustomerData({});
    setShowModal(false);
  };

  const handleSearch = (searchTerm) => {
    getCustomerDetail(searchTerm);
  };

  return (
    <>
      <Header />
      <div className="adjustSearchScreen">
        <p className="searchdescription">
          Search customer by Name or Customer-ID
        </p>
        <Container className="adjustContainer">
          <Row className="mt-5">
            <Col md={{ span: 6, offset: 3 }}>
              <SearchBar onSearch={handleSearch} disabled={searching} />
            </Col>
          </Row>
        </Container>
        {searchError && (
          <p role="alert" className="dataNotFound">
            {searchError}
          </p>
        )}
      </div>
      <ShowDetailModal
        show={showModal}
        handleClose={handleCloseModal}
        modalClassName="customModal"
        data={customerData}
      />
    </>
  );
}
