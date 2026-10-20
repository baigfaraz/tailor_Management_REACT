import { Component } from "react";
import Button from "react-bootstrap/Button";

// Catches render errors so one broken screen does not blank the whole app.
// Minimal styling with existing classes; Phase 3 designs it properly.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unexpected error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="adjustSearchScreen" role="alert">
        <h1 className="companyName">Something went wrong</h1>
        <p className="searchdescription">
          This screen could not be shown. Reload to try again.
        </p>
        <Button
          className="searchButton"
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
      </main>
    );
  }
}
