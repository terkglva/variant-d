import "./App.css";
import Nav from "./components/Nav/Nav.jsx";
import CallsPage from "../features/calls/CallsPage/CallsPage.jsx";
import CallDetailsPage from "../features/calls/CallsDetailsPage/CallsDetailsPage.jsx";
import { Navigate, Route, Routes } from "react-router";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/calls" replace />} />
        <Route path="/calls" element={<CallsPage />} />
        <Route path="/calls/:id" element={<CallDetailsPage />} />
      </Routes>
    </>
  );
}

export default App;
