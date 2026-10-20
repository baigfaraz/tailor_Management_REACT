import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { DEVICE_LOCKED_EVENT } from "../api/client";
import { getSession, unlockDevice } from "../api/session";

// Shows the shop PIN screen until this device is unlocked (SEC-001).
// Minimal styling with existing classes; Phase 3 designs it properly.
export default function DeviceGate({ children }) {
  const [status, setStatus] = useState("checking");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getSession()
      .then((session) => setStatus(session.unlocked ? "unlocked" : "locked"))
      .catch(() => setStatus("locked"));

    const lock = () => setStatus("locked");
    window.addEventListener(DEVICE_LOCKED_EVENT, lock);
    return () => window.removeEventListener(DEVICE_LOCKED_EVENT, lock);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await unlockDevice(pin);
      setPin("");
      setStatus("unlocked");
    } catch (err) {
      setError(
        err.response?.data?.error || "Could not reach the server. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "unlocked") return children;
  if (status === "checking") return null;

  return (
    <main className="adjustSearchScreen">
      <h1 className="companyName">Tailor Management System</h1>
      <Form onSubmit={handleSubmit} className="searchbarAndButton">
        <Form.Label htmlFor="shop-pin" className="searchdescription">
          Enter the shop PIN to use this device
        </Form.Label>
        <Form.Control
          id="shop-pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          className="searchfield"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
        />
        <Button type="submit" className="searchButton" disabled={submitting}>
          Unlock
        </Button>
        {error && (
          <p role="alert" className="dataNotFound">
            {error}
          </p>
        )}
      </Form>
    </main>
  );
}
