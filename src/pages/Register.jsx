import React from 'react';
import SignUpForm from '../components/SignUpForm';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.svg';


const Register = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="register-container">
            <div className="register-logo">
                <a href="#" onClick={() => handleNavigation('/')}><img className="register-logo-icon" src={logo} alt="Logo" /></a>
            </div>
            <SignUpForm />
        </div>
    );
};

export default Register;
