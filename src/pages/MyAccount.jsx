import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import api from '../utils/Api';
import { TextField, Button, Container, Box, Typography } from '@mui/material';

const MyAccount = () => {
  const [user, setUser] = useState({});
  const [editable, setEditable] = useState(false);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      api.get('users/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        setUser(response.data);
      }).catch(error => {
        console.error("Erro ao buscar dados do usuário", error);
      });
    }
  }, []);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleSaveClick = () => {
    const token = getToken();
    api.put(`users/${user.id}`, user, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      setUser(response.data);
      setEditable(false);
    }).catch(error => {
      console.error("Erro ao atualizar dados do usuário", error);
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      <TopBar />
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Minha Conta
          </Typography>
          <form noValidate autoComplete="off">
            <TextField
              label="Primeiro Nome"
              name="first_name"
              value={user.first_name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: !editable,
              }}
            />
            <TextField
              label="Último Nome"
              name="last_name"
              value={user.last_name || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: !editable,
              }}
            />
            <TextField
              label="Email"
              name="email"
              value={user.email || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: !editable,
              }}
            />
            <TextField
              label="Número de Telefone"
              name="phone_number"
              value={user.phone_number || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: !editable,
              }}
            />
            {editable ? (
              <Button variant="contained" color="primary" onClick={handleSaveClick}>
                Salvar
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleEditClick}>
                Editar
              </Button>
            )}
          </form>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default MyAccount;
