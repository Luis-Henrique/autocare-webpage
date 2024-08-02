import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/Api';
import '../styles/PasswordRecovery.css';
import logo from '../assets/img/logo.svg';
import { useNotification } from '../components/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 

const PasswordRecovery = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification(); 

    const [email, setEmail] = useState('');
    const [requestStatus, setRequestStatus] = useState('idle');
    const [isRequired, setIsRequired] = useState({
        email: false,
    });

    const handleFocus = (field) => {
        setIsRequired((prev) => ({
            ...prev,
            [field]: false
        }));
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired({
                email: true
            });
            return;
        }

        setRequestStatus('loading');

        api.put(`/users/new-password/${email}`)
            .then((response) => {
                console.log(response);
                setRequestStatus('success');
                addNotification('success', 'Sucesso', 'Email de recuperação enviado com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao enviar email de recuperação:', error);
                setRequestStatus('error');
                addNotification('error', 'Erro', 'Ocorreu um erro ao enviar o email de recuperação.');
            });
    };

    let content;
    if (requestStatus === 'loading') {
        content = <p>Aguarde enquanto enviamos o email de recuperação...</p>;
    } else if (requestStatus === 'success') {
        content = (
            <div>
                <div className="password-recovery-email-container">
                    <h1>Email de recuperação enviado com sucesso!</h1>
                    <p>Verifique sua caixa de entrada para instruções.</p>
                    <span>Acesse seu provedor</span>
                    <div className="password-recovery-social-buttons">
                        <button className="password-recovery-social" onClick={() => redirectToEmailProvider('google')}>
                            <i className="fab fa-google-plus-g" />
                        </button>
                        <button className="password-recovery-social" onClick={() => redirectToEmailProvider('apple')}>
                            <i className="fab fa-apple" />
                        </button>
                        <button className="password-recovery-social" onClick={() => redirectToEmailProvider('microsoft')}>
                            <i className="fab fa-microsoft" />
                        </button>
                    </div>
                </div>
            </div>
        );
    } else if (requestStatus === 'error') {
        content = (
            <div>
                <div className="password-recovery-email-container">
                    <div className="back-icon" onClick={() => window.location.reload()}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <h1 className="password-recovery-title">Ocorreu um erro ao enviar o email de recuperação</h1>
                    <p className="password-recovery-subtitle">Por favor, verifique o email inserido e tente novamente.</p>
                </div>
            </div>
        );
    } else {
        content = (
            <div>
                <form noValidate onSubmit={handleSubmit} className="password-recovery-email-container">
                    <div className="back-icon" onClick={() => navigate('/login')}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                    <h1 className="password-recovery-title">Recuperação de Senha</h1>
                    <div className="email-input">
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => handleFocus('email')}
                            required={isRequired.email}
                            className='password-recovery-input'
                        />
                    </div>
                    <div className="password-recovery-form-buttons">
                        <button className="password-recovery-group-child" type="submit">
                            <div className="password-recovery-btn" type="submit">Enviar e-mail de Recuperação</div>
                        </button>
                    </div>
                </form>
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

export default PasswordRecovery;
