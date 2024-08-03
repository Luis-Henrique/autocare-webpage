import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Alert } from '@mui/material';

const Notification = ({ id, type, title, message, removeNotification }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, removeNotification]);

  let backgroundColor, titleColor, subtitleColor;

  switch (type) {
    case 'success':
      backgroundColor = '#EDF7ED';
      titleColor = '#2E7D32';
      subtitleColor = '#4CAF50';
      break;
    case 'info':
      backgroundColor = '#E3F2FD';
      titleColor = '#0D47A1';
      subtitleColor = '#64B5F6';
      break;
    case 'error':
    default:
      backgroundColor = '#FDEDED';
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

Notification.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['success', 'info', 'error']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  removeNotification: PropTypes.func.isRequired,
};

export default Notification;
