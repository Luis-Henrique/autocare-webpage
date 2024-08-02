import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/Api';
import '../styles/SignUp.css';
import Alert from '@mui/material/Alert';
import GoogleLoginComponent from './GoogleLogin';
import { useNotification } from '../components/NotificationContext';
import rigth from '../assets/img/arrow-right.svg';
import left from '../assets/img/arrow-left.svg';
import closedEye from '../assets/img/closed-eye.svg';
import openEye from '../assets/img/open-eye.svg';

function SignUpForm() {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: '',
        phone_number: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [message, setMessage] = useState('');
    const [isRequired, setIsRequired] = useState({
        email: false,
        username: false,
        first_name: false,
        last_name: false,
        password: false,
        confirmPassword: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ strength: 0, message: 'Muito Fraca' });

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === 'phone_number') {
            formattedValue = formatPhoneNumber(value);
        }

        setFormData((prevFormData) => {
            let newFormData = { ...prevFormData, [name]: formattedValue };

            if (name === 'email') {
                newFormData = {
                    ...newFormData,
                    username: value.split('@')[0]
                };
            }

            return newFormData;
        });

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const formatPhoneNumber = (input) => {
        const cleaned = input.replace(/\D/g, '');
        let formattedNumber = '';

        if (cleaned.length > 0) formattedNumber = `(${cleaned.slice(0, 2)}`;
        if (cleaned.length >= 3) formattedNumber += `) ${cleaned.slice(2, 7)}`;
        if (cleaned.length >= 8) formattedNumber += `-${cleaned.slice(7, 11)}`;

        return formattedNumber;
    };

    const handleNextStep = (e) => {
        e.preventDefault();

        if (currentStep === 1) {
            if (!formData.email || !formData.username) {
                addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');

                setIsRequired({
                    ...isRequired,
                    email: true,
                    username: true
                });

                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                addNotification('error', 'Erro', 'Formato de e-mail inválido.');

                setIsRequired({
                    ...isRequired,
                    email: true,
                    username: false
                });

                return;
            }
        }

        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = (e) => {
        e.preventDefault();
        setCurrentStep(currentStep - 1);

        setIsRequired({
            email: false,
            username: false,
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

        if (!formData.password || !formData.confirmPassword || !formData.first_name || !formData.last_name) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');

            setIsRequired({
                email: true,
                username: true,
                first_name: true,
                last_name: true,
                password: true,
                confirmPassword: true
            });
            return;
        }

        const password = formData.password;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const isValidLength = password.length >= 8;
        const isValidComplexity = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length >= 3;

        if (!isValidLength || !isValidComplexity) {
            addNotification('error', 'Erro', 'A senha deve ter pelo menos 8 caracteres, e incluir letras maiúsculas (A-Z), minúsculas (a-z), números (0-9), caracteres especiais (!, @, #, $, etc.).');

            setIsRequired({
                email: false,
                username: false,
                first_name: false,
                last_name: false,
                password: true,
                confirmPassword: true
            });

            return;
        }

        if (formData.password !== formData.confirmPassword) {
            addNotification('error', 'Erro', 'As senhas não coincidem.');

            setIsRequired({
                email: false,
                username: false,
                first_name: false,
                last_name: false,
                password: true,
                confirmPassword: true
            });

            return;
        }

        api.post('/users/', formData)
            .then(response => {
                console.log('Usuário criado:', response.data);
                setMessage('Usuário criado com sucesso!');
                setFormData({
                    email: '',
                    username: '',
                    first_name: '',
                    last_name: '',
                    password: '',
                    confirmPassword: '',
                    phone_number: ''
                });
                navigate('/email-confirmation');
            })
            .catch(error => {
                console.error(error);

                if (error.response && error.response.data.detail) {
                    if (error.response.data.detail === 'Username already exists') {
                        addNotification('error', 'Erro', 'O nome de usuário informado já está em uso.');
                        setCurrentStep(1);
                    } else if (error.response.data.detail === 'Email already exists') {
                        addNotification('error', 'Erro', 'Esse e-mail já está cadastrado, tente fazer login.');
                        setCurrentStep(1);
                    } else {
                        addNotification('error', 'Erro', 'Falha ao criar usuário. Por favor, tente novamente.');
                    }
                } else {
                    addNotification('error', 'Erro', 'Falha ao criar usuário. Por favor, tente novamente.');
                }
            });
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const calculatePasswordStrength = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValidLength = password.length >= 8;

        let strength = 0;
        if (isValidLength) strength++;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumber) strength++;
        if (hasSpecialChar) strength++;

        const messages = [
            'Muito Fraca',
            'Muito Fraca',
            'Fraca',
            'Média',
            'Forte',
            'Muito Forte'
        ];

        return { strength, message: messages[strength] };
    };

    const getPasswordStrengthColor = (strength) => {
        switch (strength) {
            case 1:
                return '#ff0000'; // Vermelho
            case 2:
                return '#ff6600'; // Laranja
            case 3:
                return '#ffcc00'; // Amarelo
            case 4:
                return '#66ff66'; // Verde
            case 5:
                return '#00cc00'; // Verde escuro
            default:
                return '#ff0000'; // Vermelho
        }
    };

    return (
        <div className="sign-up-container">
            <form className="sign-up-form" noValidate onSubmit={handleSubmit}>
                <h1 className='sing-up-title'>Criar Conta</h1>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(currentStep / 2) * 100}%` }}></div>
                </div>
                {currentStep === 1 && (
                    <div className="sign-up-form">
                        <div className="sign-up-email-input">
                            <input className='sign-up-input' type="email" name="email" value={formData.email} onFocus={() => handleFocus('email')} onChange={handleChange} placeholder="E-mail" required={isRequired.email} />
                        </div>
                        <div className="sign-up-input-container">
                            <input className='sign-up-input' type="text" name="username" value={formData.username} onFocus={() => handleFocus('username')} onChange={handleChange} placeholder="Nome de usuário" required={isRequired.username} />
                        </div>
                        <div className='prev-next-buttons'>
                            <button className="rigth-btn" disabled>
                                <img className="sign-up-btn-icon" src={rigth} alt="seta para esquerda" />
                            </button>
                            <button className="left-btn" onClick={handleNextStep}>
                                <img className="sign-up-btn-icon" src={left} alt="seta para direita" />
                            </button>
                        </div>
                        <div className="form-login">
                            <span className='register-btn'>Já tem uma conta? <a className="register-btn-spam" onClick={handleLoginClick}>Entrar</a></span>
                        </div>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className='sign-up-form'>
                        <div className="sign-up-name-input">
                            <input className='sign-up-input' type="text" name="first_name" value={formData.first_name} onFocus={() => handleFocus('first_name')} onChange={handleChange} placeholder="Nome" required={isRequired.first_name} />
                        </div>
                        <div className="sign-up-input-container">
                            <input className='sign-up-input' type="text" name="last_name" value={formData.last_name} onFocus={() => handleFocus('last_name')} onChange={handleChange} placeholder="Sobrenome" required={isRequired.last_name} />
                        </div>
                        <div className="sign-up-input-container">
                            <input className='sign-up-input' type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Número de telefone" />
                        </div>
                        <div className='sign-up-input-container-password'>
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
                                className="sign-up-toggle-password-visibility"
                            />
                        </div>
                        <div className="password-strength-container">
                            <div className="password-strength">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={`password-strength-bar ${index < passwordStrength.strength ? 'filled' : ''}`}
                                        style={{ backgroundColor: index < passwordStrength.strength ? getPasswordStrengthColor(passwordStrength.strength) : '#f3f3f3' }}
                                    ></div>
                                ))}
                            </div>
                            <span
                                className="password-strength-message"
                                style={{ color: getPasswordStrengthColor(passwordStrength.strength) }}
                            >
                                {passwordStrength.message}
                            </span>
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
                        <div className='prev-next-buttons'>
                            <button className="left-btn" onClick={handlePreviousStep}>
                                <img className="sign-up-btn-icon" src={rigth} alt="seta para esquerda" />
                            </button>
                            <button className="rigth-btn" disabled>
                                <img className="sign-up-btn-icon" src={left} alt="seta para direita" />
                            </button>
                        </div>
                        <button className="group-child" type="submit">
                            <div className="entrar">Registrar</div>
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default SignUpForm;
