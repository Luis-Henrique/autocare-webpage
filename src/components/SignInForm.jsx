import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/Api';
import '../styles/SignIn.css';
import GoogleLoginComponent from './GoogleLogin';
import closedEye from '../assets/img/closed-eye.svg';
import openEye from '../assets/img/open-eye.svg';
import { useNotification } from '../components/NotificationContext';

function SignInForm() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [isRequired, setIsRequired] = useState({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFocus = (field) => {
    setIsRequired((prev) => ({
      ...prev,
      [field]: false
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
      setIsRequired({
        email: !formData.username,
        password: !formData.password
      });
      return;
    }

    const urlencodedData = new URLSearchParams();
    urlencodedData.append('username', formData.username);
    urlencodedData.append('password', formData.password);

    api.post('http://localhost:8000/auth/token', urlencodedData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      console.log('Login bem-sucedido:', response.data);
      addNotification('success', 'Sucesso', 'Login bem-sucedido!');

      const token = response.data.access_token;
      if (formData.rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }

      navigate('/');
    }).catch(error => {
      if (error.response) {
        console.error('Erro na resposta:', error.response.data);
        addNotification('error', 'Erro', 'Falha no login. Verifique suas credenciais e tente novamente.');
      } else {
        console.error(error);
        addNotification('error', 'Erro', 'Ocorreu um erro. Por favor, tente novamente.');
      }
    });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleForgetPasswordClick = () => {
    navigate('/password-recovery');
  }

  return (
    <div className="sign-in-container">
      <form noValidate onSubmit={handleSubmit}>
        <h1 className="sing-in-title">Entrar</h1>
        <div className="sing-in-google-btn">
          <GoogleLoginComponent />
        </div>
        <span className="sign-in-spam">Ou use sua conta</span>
        <div>
          <div className="email-input">
            <input
              type="text"
              placeholder="Email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              required={isRequired.email}
              className='sign-in-input'
            />
          </div>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              required={isRequired.password}
              className='sign-in-input'
            />
            <img
              src={showPassword ? closedEye : openEye}
              alt="Toggle password visibility"
              onClick={togglePasswordVisibility}
              className="toggle-password-visibility"
            />
          </div>
        </div>
        <div className="sign-in-form-buttons">
          <button className="group-child" type="submit">
            <div className="entrar">Entrar</div>
          </button>
          <label className='remember-me'>
            <input
              className='remember-me-checkbox'
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            Lembre de mim
          </label>
        </div>
        <div className="sign-in-register">
          <a className='forget-password' onClick={handleForgetPasswordClick}>Esqueceu sua senha?</a>
          <span className='register-btn'>Não tem uma conta? <a className="register-btn-spam" onClick={handleRegisterClick}>Registre-se</a></span>
        </div>
      </form>
    </div>
  );
}

export default SignInForm;
