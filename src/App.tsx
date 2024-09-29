import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KayanYazi from "./component/dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route with URL parameters */}
        <Route path="/:tvid/:machine1/:machine2" element={<KayanYazi />} />

        {/* Optionally, add more routes here */}
      </Routes>
    </Router>
  );
};

export default App;
