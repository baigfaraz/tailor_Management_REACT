import { Link } from "react-router-dom";
import Header from "./Header";

// Minimal 404 with existing styles; Phase 3 (UX-008) designs it properly.
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="adjustSearchScreen">
        <h1 className="searchdescription">Page not found</h1>
        <Link to="/Home" className="btn searchButton">
          Go to Home
        </Link>
      </main>
    </>
  );
}
