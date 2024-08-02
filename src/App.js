import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailConfirmation from './pages/EmailConfirmation';
import EmailConfirmated from './pages/EmailConfirmated';
import PasswordRecovery from './pages/PasswordRecovery';
import NewPassword from './pages/NewPassword';
import Landing from './pages/Landing';
import MyAccount from './pages/MyAccount';
import About from './pages/About';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import Services from './pages/Services';
import Contact from './pages/Contact';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/email-confirmated/:token" element={<EmailConfirmated />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/new-password/:token" element={<NewPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
