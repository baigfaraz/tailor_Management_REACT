import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <>
      <Form className="searchbarAndButton">
        <FormControl
          type="text"
          placeholder="Enter Customer-ID"
          className="mr-sm-2 searchfield"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button className="searchButton" onClick={handleSearch}>
          Check
        </Button>
      </Form>
    </>
  );
}

export default SearchBar;
