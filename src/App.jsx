import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WelcomePage from "./components/WelcomePage";
import HomePage from "./components/HomePage";
import AllCustomer from "./components/AllCustomer";
import SearchScreen from "./components/SearchScreen";
import DeviceGate from "./components/DeviceGate";

function App() {
  return (
    <DeviceGate>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Home/AllCustomer" element={<AllCustomer />} />
          <Route path="/Home/Search" element={<SearchScreen />} />
        </Routes>
      </Router>
    </DeviceGate>
  );
}

export default App;
