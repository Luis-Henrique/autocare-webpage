import React, { useState, useEffect } from 'react';
import '../styles/ProfileMenu.css';

const ProfileMenu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setUserName('John Doe'); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className="dropdown">
          <div className="profile-pic">{userName.charAt(0)}</div>
          <div className="dropdown-content">
            <a href="/account">Minha Conta</a>
            <a href="/settings">Configurações</a>
            <a href="/" onClick={handleLogout}>Sair</a>
          </div>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
};

export default ProfileMenu;
