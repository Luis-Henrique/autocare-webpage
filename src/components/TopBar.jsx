import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/Api';
import '../styles/TopBar.css';
import logo from '../assets/img/logo.svg';
import menuIcon from '../assets/img/menu-icon.svg';
import closeIcon from '../assets/img/close-icon.svg';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

function TopBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInitial, setUserInitial] = React.useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const open = Boolean(anchorEl);

    const getToken = () => {
        return localStorage.getItem('token');
    }

    React.useEffect(() => {
        const token = getToken();
        if (token) {
            setIsLoggedIn(true);
            api.get('users/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                const user = response.data;
                setUserInitial(user.first_name[0]);
            }).catch(error => {
                console.error("Erro ao buscar dados do usuário", error);
            });
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMenuOpen) {
            toggleMenu();
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (option) => () => {
        handleClose();
        if (option === 'logoff') {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
        } else if (option === 'profile') {
            navigate('/my-account');
        } else if (option === 'settings') {
            navigate('/settings');
        } else if (option === 'bookings') {
            navigate('/bookings');
        }
    };

    const getMenuItemClass = (path) => {
        return location.pathname === path ? 'topbar-menu-item active' : 'topbar-menu-item';
    };

    return (
        <header className="topbar-container">
            <div className="topbar-logo">
                <a href="#" onClick={() => handleNavigation('/')}><img className="topbar-logo-icon" src={logo} alt="Logo" /></a>
            </div>
            <div className="topbar-menu-container">
                <nav className={`topbar-menu ${isMenuOpen ? 'open' : ''}`}>
                    <a href="#" className={getMenuItemClass('/')} onClick={() => handleNavigation('/')}>Home</a>
                    <a href="#" className={getMenuItemClass('/about')} onClick={() => handleNavigation('/about')}>Sobre</a>
                    <a href="#" className={getMenuItemClass('/contact')} onClick={() => handleNavigation('/contact')}>Contato</a>
                    <a href="#" className={getMenuItemClass('/services')} onClick={() => handleNavigation('/services')}>Serviços</a>
                    <button className="topbar-close-button" onClick={toggleMenu}>
                        <img className="topbar-close-button-icon" src={closeIcon} alt="Close Menu" />
                    </button>
                </nav>
                {isLoggedIn ? (
                    <React.Fragment>
                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 37, height: 37, bgcolor: '#0071E3' }}>{userInitial}</Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&::before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleMenuClick('profile')}>
                                <Avatar /> Minha conta
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleMenuClick('bookings')}>
                                <ListItemIcon>
                                    <CalendarTodayIcon fontSize="small" />
                                </ListItemIcon>
                                Meus agendamentos
                            </MenuItem>
                            <MenuItem onClick={handleMenuClick('settings')}>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                Configurações
                            </MenuItem>
                            <MenuItem onClick={handleMenuClick('logoff')}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Sair
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                ) : (
                    <button className="topbar-login-button" onClick={() => handleNavigation('/login')}>
                        <span className="topbar-button-text">Login</span>
                    </button>
                )}
                <button className="topbar-menu-button" onClick={toggleMenu}>
                    <img className="topbar-menu-button-icon" src={menuIcon} alt="Menu" />
                </button>
            </div>
            {isMenuOpen && <div className="topbar-backdrop" onClick={toggleMenu}></div>}
        </header>
    );
}

export default TopBar;
