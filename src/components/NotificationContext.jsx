import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Notification from './Notification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, title, message) => {
    const id = new Date().getTime();
    setNotifications((prevNotifications) => [...prevNotifications, { id, type, title, message }]);
  };

  const removeNotification = (id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {notifications.map(({ id, type, title, message }) => (
        <Notification
          key={id}
          id={id}
          type={type}
          title={title}
          message={message}
          removeNotification={removeNotification}
        />
      ))}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
