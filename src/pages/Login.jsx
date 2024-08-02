import React from 'react';
import SignInForm from '../components/SignInForm';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.svg';

const Login = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <a href="#" onClick={() => handleNavigation('/')}><img className="login-logo-icon" src={logo} alt="Logo" /></a>
      </div>
      <SignInForm />
    </div>
  );
};

export default Login;
