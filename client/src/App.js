import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SurveyPage from './components/survey';
import Dashboard from './components/dashboard';
import Home from './pages/home';
import Clients from './pages/clients';

function App() {
  console.log('App rendered');
  return (
    <Router>
      <Routes>
        {/* Survey Route */}
        <Route path="/survey/:dealID" element={<SurveyPage />} />

        {/* Dashboard Route*/}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="clients" element={<Clients />} />
        </Route>

        {/* Fallback for all other routes */}
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
