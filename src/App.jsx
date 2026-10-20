import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import WelcomePage from "./components/WelcomePage";
import HomePage from "./components/HomePage";
import AllCustomer from "./components/AllCustomer";
import SearchScreen from "./components/SearchScreen";
import DeviceGate from "./components/DeviceGate";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";

// Dev-only design system reference; not included in production builds.
const DesignSystemPage = import.meta.env.DEV
  ? lazy(() => import("./design-system/DesignSystemPage"))
  : null;

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
            {DesignSystemPage && (
              <Route
                path="/design-system"
                element={
                  <Suspense fallback={null}>
                    <DesignSystemPage />
                  </Suspense>
                }
              />
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </DeviceGate>
    </ErrorBoundary>
  );
}

export default App;
