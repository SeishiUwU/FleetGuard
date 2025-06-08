import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import Dashboard from './pages/Dashboard';
import Clips from './pages/Clips';
import Analytics from './pages/Analytics';
import ContactSupport from './pages/ContactSupport';
import Login from './pages/Login';
import NotFound from './pages/NotFound'; // Add this import

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clips" element={<Clips />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;