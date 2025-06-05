import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurveyPage from './SurveyPage';

function App() {
  useEffect(() => {
    console.log('✅ React App has started successfully.');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/survey" element={<SurveyPage />} />
        {/* Optional: Add a home or 404 page route if needed */}
      </Routes>
    </Router>
  );
}

export default App;
