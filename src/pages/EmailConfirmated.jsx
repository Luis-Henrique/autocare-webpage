import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmailConfirmated.css';
import { useParams } from 'react-router-dom';
import api from '../utils/Api';
import logo from '../assets/img/logo.svg';

const EmailConfirmated = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [confirmationStatus, setConfirmationStatus] = useState('pending');

    useEffect(() => {
        api.get(`/auth/confirm/${token}`)
            .then((response) => {
                console.log(response);
                setConfirmationStatus('confirmed');
            })
            .catch((error) => {
                console.error('Erro ao confirmar e-mail:', error);
                setConfirmationStatus('error');
            });
    }, [token]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    let content;
    if (confirmationStatus === 'pending') {
        content = <p>Aguarde enquanto confirmamos seu e-mail...</p>;
    } else if (confirmationStatus === 'confirmed') {
        content = (
            <div className="email-container">
                <h1>E-mail confirmado com sucesso!</h1>
                <button className="password-recovery-group-child" onClick={handleLoginClick}>
                    <div className="password-recovery-btn" >Entrar</div>
                </button>
            </div>
        );
    } else if (confirmationStatus === 'error') {
        content = (
            <div className="email-container">
                <h1>Ocorreu um erro ao confirmar seu e-mail.</h1>
                <p>Por favor, tente novamente mais tarde.</p>
            </div>
        );
    }

    return (
        <div className="password-recovery-container">
            <div className="password-recovery-logo">
                <a href="#" onClick={() => navigate('/')}><img className="password-recovery-logo-icon" src={logo} alt="Logo" /></a>
            </div>
            {content}
        </div>
    );
};

export default EmailConfirmated;
