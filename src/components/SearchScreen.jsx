import Header from "./Header";
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SearchBar from "./Searchbar";
import ShowDetailModal from "./ShowDetailModal";
import { getCustomer } from "../api/customers";

export default function SearchScreen() {
  const [customerData, setCustomerData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [dataNotFound, setDataNotFound] = useState(false);

  const getCustomerDetail = async (id) => {
    try {
      setCustomerData(await getCustomer(id));
      handleOpenModal();
      setDataNotFound(false);
    } catch (error) {
      setCustomerData({});
      setDataNotFound(true);
      console.error("Error fetching data:", error);
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
              <SearchBar onSearch={handleSearch} />
            </Col>
          </Row>
        </Container>
        {dataNotFound && <p className="dataNotFound">Customer Not Found.</p>}
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
