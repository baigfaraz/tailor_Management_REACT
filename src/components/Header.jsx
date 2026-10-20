import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="App-header">
      <h1 className="companyName">Tailor Management System</h1>
      <div className="headerOptions">
        <h3 className="headeroptionText">
          <Link to="/Home" className="GetStartedLink">
            Home
          </Link>
        </h3>
        <h3 className="headeroptionText">
          <Link to="/" className="GetStartedLink">
            Logout
          </Link>
        </h3>
      </div>
    </header>
  );
}
