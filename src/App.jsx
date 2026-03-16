//src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RegistrosPage from "./pages/RegistrosPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div data-theme="light">
      <BrowserRouter>
        <>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route
              path="/registros"
              element={
                <ProtectedRoute>
                  <RegistrosPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer position="top-right" autoClose={2000} />
        </>
      </BrowserRouter>
    </div>
  );
}

export default App;
