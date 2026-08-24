<<<<<<< HEAD
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminRoutes from "./routes/AdminRoutes";
import Home from "./pages/Home";

import AuthRoutes from "./routes/AuthRoutes";
import CandidateRoutes from "./routes/CandidateRoutes";
import RecruiterRoutes from "./routes/RecruiterRoutes";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />

        {AuthRoutes}
        {CandidateRoutes}
        {RecruiterRoutes}
        {AdminRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> develope
