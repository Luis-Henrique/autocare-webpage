import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/Api';
import logoGoogle from '../assets/img/logo-google.svg';

const GoogleLoginComponent = () => {
    const navigate = useNavigate();
    let isGoogleInitialized = false;

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (!isGoogleInitialized) {
                isGoogleInitialized = true;

                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.onload = () => {
                    console.log('Google Sign-In script loaded');
                    if (window.google) {
                        console.log('Initializing Google Sign-In');
                        window.google.accounts.id.initialize({
                            client_id: '744926788933-jonc4p921vmt9qhr58detigs7fiksfr3.apps.googleusercontent.com',
                            callback: handleCredentialResponse
                        });

                        window.google.accounts.id.prompt();

                        const button = document.getElementById('customGoogleButton');
                        if (button) {
                            console.log('Adding click listener to Google Sign-In button');
                            button.addEventListener('click', (event) => {
                                event.preventDefault();
                                window.google.accounts.id.prompt();
                            });
                        }
                    }
                };
                script.onerror = () => {
                    console.error('Failed to load Google Sign-In script');
                };
                document.body.appendChild(script);

                return () => {
                    document.body.removeChild(script);
                };
            }
        };

        initializeGoogleSignIn();
    }, []);

    const handleCredentialResponse = async (response) => {
        console.log('Handling credential response', response);
        if (response.credential) {
            const token = response.credential;
            try {
                const res = await api.post('/auth/token', new URLSearchParams({
                    username: 'google_user',
                    password: token,
                }));

                localStorage.setItem('token', res.data.access_token);
                console.log('Login bem-sucedido', res.data);
                navigate('/');
            } catch (error) {
                console.error('Erro ao fazer login', error);
            }
        } else {
            console.error('No credential received', response);
        }
    };

    return (
        <button id="customGoogleButton" class="btn-google-light">
            <div class="official-buttons-sign-in-wit">
                <img class="logo-googleg-48dp" alt="Logo da google" src={logoGoogle} />
                <div class="sign-in-with">Sign in with Google</div>
            </div>
        </button>
    );
};

export default GoogleLoginComponent;
