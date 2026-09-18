import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import EventLog from './pages/EventLog';
import Statistics from './pages/Statistics';
import Performance from './pages/Performance';

export default function App() {
  return (
    <SimulationProvider>
      <BrowserRouter>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/event-log" element={<EventLog />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </SimulationProvider>
  );
}
