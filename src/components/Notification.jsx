import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faInfoCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Notification = ({ id, type, title, message, removeNotification }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, removeNotification]);

  const renderIcon = (type) => {
    switch (type) {
      case 'success':
        return <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#fff' }} />;
      case 'info':
        return <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#fff' }} />;
      case 'error':
      default:
        return <FontAwesomeIcon icon={faExclamationCircle} style={{ color: '#fff' }} />;
    }
  };

  let backgroundColor, iconBgColor, titleColor, subtitleColor;

  switch (type) {
    case 'success':
      backgroundColor = '#EDF7ED';
      iconBgColor = '#66BB6A';
      titleColor = '#2E7D32';
      subtitleColor = '#4CAF50';
      break;
    case 'info':
      backgroundColor = '#E3F2FD';
      iconBgColor = '#1976D2';
      titleColor = '#0D47A1';
      subtitleColor = '#64B5F6';
      break;
    case 'error':
    default:
      backgroundColor = '#FDEDED';
      iconBgColor = '#DB5050';
      titleColor = '#B71C1C';
      subtitleColor = '#565656';
      break;
  }

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={10000}
      onClose={() => removeNotification(id)}
    >
      <Alert
        onClose={() => removeNotification(id)}
        severity={type}
        style={{
          backgroundColor,
          color: titleColor,
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px',
          width: '364px', 
        }}
      >
        <div>
          <div style={{ fontWeight: 'bold', color: titleColor }}>{title}</div>
          <div style={{ color: subtitleColor, whiteSpace: 'pre-line' }}>{message}</div>
        </div>
      </Alert>
    </Snackbar>
  );
};

export default Notification;
