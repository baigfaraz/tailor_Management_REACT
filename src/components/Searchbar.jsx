import { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";

function SearchBar({ onSearch, disabled = false }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Enter submits the form; prevent the browser's page reload (UX-011).
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <>
      <Form className="searchbarAndButton" onSubmit={handleSubmit}>
        <FormControl
          type="text"
          placeholder="Enter Customer-ID"
          aria-label="Customer number"
          className="mr-sm-2 searchfield"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button type="submit" className="searchButton" disabled={disabled}>
          Check
        </Button>
      </Form>
    </>
  );
}

export default SearchBar;
