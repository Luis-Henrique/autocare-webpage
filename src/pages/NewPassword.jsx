import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/Api';
import '../styles/NewPassword.css';
import { useNotification } from '../components/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/img/logo.svg';
import closedEye from '../assets/img/closed-eye.svg';
import openEye from '../assets/img/open-eye.svg';

const NewPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const { addNotification } = useNotification();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const [isRequired, setIsRequired] = useState({
        password: false,
        confirmPassword: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [requestStatus, setRequestStatus] = useState('idle');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleFocus = (field) => {
        setIsRequired((prev) => ({
            ...prev,
            [field]: false
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { password, confirmPassword } = formData;

        if (!password || !confirmPassword) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired({
                password: !password,
                confirmPassword: !confirmPassword
            });
            return;
        }

        if (password !== confirmPassword) {
            addNotification('error', 'Erro', 'As senhas não coincidem.');
            setIsRequired({
                password: true,
                confirmPassword: true
            });
            return;
        }

        setRequestStatus('loading');

        api.get(`/auth/new-password/${token}?password=${password}`)
            .then((response) => {
                console.log(response);
                setRequestStatus('success');
                addNotification('success', 'Sucesso', 'Senha redefinida com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao redefinir a senha:', error);
                setRequestStatus('error');
                addNotification('error', 'Erro', 'Ocorreu um erro ao redefinir a senha.');
            });
    };

    let content;
    if (requestStatus === 'loading') {
        content = <p>Aguarde enquanto redefinimos sua senha...</p>;
    } else if (requestStatus === 'success') {
        content = (
            <div className="reset-container">
                <div className="back-icon" onClick={() => navigate('/login')}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h1 className='password-recovery-title'>Senha redefinida com sucesso!</h1>
                <p className='password-recovery-subtitle'>Você já pode fazer login com sua nova senha.</p>
            </div>
        );
    } else if (requestStatus === 'error') {
        content = (
            <div className="reset-container">
                <div className="back-icon" onClick={() => navigate('/login')}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <h1>Ocorreu um erro ao redefinir a senha.</h1>
                <p>Por favor, tente novamente.</p>
            </div>
        );
    } else {
        content = (
            <div className="reset-container">
                <div className="back-icon" onClick={() => navigate('/login')}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Redefinir Senha</h1>
                    <div className='new-password-input-container'>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => handleFocus('password')}
                            required={isRequired.password}
                            className={`new-password-input ${isRequired.confirmPassword ? 'input-error' : ''}`}
                        />
                        <img
                            src={showPassword ? closedEye : openEye}
                            alt="Toggle password visibility"
                            onClick={togglePasswordVisibility}
                            className="new-password-toggle-password-visibility"
                        />
                    </div>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirme a senha"
                        required={isRequired.confirmPassword}
                        onFocus={() => handleFocus('confirmPassword')}
                        className={`new-password-input ${isRequired.confirmPassword ? 'input-error' : ''}`}
                    />
                    <div className="reset-password-buttons">
                        <button className="reset-btn" type="submit">Redefinir Senha</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="reset-page">
            <div className="reset-logo">
                <a href="#" onClick={() => navigate('/')}><img className="reset-logo-icon" src={logo} alt="Logo" /></a>
            </div>
            {content}
        </div>
    );
};

export default NewPassword;
