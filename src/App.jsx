//src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AnalyticsPage from "./pages/AnalyticsPage"
import RegistrosPage from "./pages/RegistrosPage";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/registros" element={<RegistrosPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000}/>
      </>
    </BrowserRouter>
  );
}

export default App;
