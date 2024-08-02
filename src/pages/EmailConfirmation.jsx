import React from 'react';
import '../styles/EmailConfirmation.css';
import logo from '../assets/img/logo.svg';
import { useNavigate } from 'react-router-dom';

const EmailConfirmation = () => {
    const navigate = useNavigate();

    const redirectToEmailProvider = (provider) => {
        switch (provider) {
            case 'google':
                window.location.href = 'https://mail.google.com';
                break;
            case 'apple':
                window.location.href = 'https://www.icloud.com';
                break;
            case 'microsoft':
                window.location.href = 'https://outlook.live.com';
                break;
            default:
                break;
        }
    };

    return (
        <div className='email-confirmation-container'>
            <div className="email-confirmation-logo">
                <a href="#" onClick={() => navigate('/')}><img className="email-confirmation-logo-icon" src={logo} alt="Logo" /></a>
            </div>
            <div className="email-confirmation-email-container">
                <h1>Confirmação de e-mail</h1>
                <p>Um e-mail de confirmação foi enviado para o endereço informado. Por favor, verifique sua caixa de entrada e clique no link de confirmação.</p>
                <span>Acesse seu provedor</span>
                <div className="email-confirmation-social-buttons">
                    <button className="email-confirmation-social" onClick={() => redirectToEmailProvider('google')}>
                        <i className="fab fa-google-plus-g" />
                    </button>
                    <button className="email-confirmation-social" onClick={() => redirectToEmailProvider('apple')}>
                        <i className="fab fa-apple" />
                    </button>
                    <button className="email-confirmation-social" onClick={() => redirectToEmailProvider('microsoft')}>
                        <i className="fab fa-microsoft" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
