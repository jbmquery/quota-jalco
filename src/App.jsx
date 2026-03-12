//src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegistrosPage from "./pages/RegistrosPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registros" element={<RegistrosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
