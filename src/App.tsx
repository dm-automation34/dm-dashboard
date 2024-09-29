import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KayanYazi from "./component/dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:machine1/:machine2" element={<KayanYazi />} />
        <Route path="/:machine1" element={<KayanYazi />} />
      </Routes>
    </Router>
  );
};

export default App;
