import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurveyPage from './components/survey';  // adjust path if needed

function App() {
  console.log('App rendered');
  return (
    <Router>
      <Routes>
        <Route path="/survey/:dealID" element={<SurveyPage />} />
        <Route path="*" element={<div>404 - Not Found</div>} />
        {/* Add a default route or homepage if needed */}
      </Routes>
    </Router>
  );
}

export default App;
