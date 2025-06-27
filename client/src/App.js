import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SurveyPage from './components/survey';
import Survey2 from './components/survey2';
import Dashboard from './components/dashboard';
import Home from './pages/home';
import Clients from './pages/clients';
import Team from './pages/team';
import UpcomingSurveys from './pages/surveys';

function App() {
  console.log('App rendered');
  return (
    <Router>
      <Routes>
        {/* Survey Route */}
        <Route path="/survey/:dealID" element={<SurveyPage />} />
        <Route path="/survey2/:dealID" element={<Survey2 />} />

        {/* Dashboard Route*/}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="clients" element={<Clients />} />
          <Route path="team" element={<Team />} />
          <Route path="surveys" element={<UpcomingSurveys/>} />
        </Route>

        {/* Fallback for all other routes */}
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
