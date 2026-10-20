import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import WelcomePage from "./components/WelcomePage";
import HomePage from "./components/HomePage";
import AllCustomer from "./components/AllCustomer";
import SearchScreen from "./components/SearchScreen";
import DeviceGate from "./components/DeviceGate";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <DeviceGate>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/Home" element={<HomePage />} />
            <Route path="/Home/AllCustomer" element={<AllCustomer />} />
            <Route path="/Home/Search" element={<SearchScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </DeviceGate>
    </ErrorBoundary>
  );
}

export default App;
