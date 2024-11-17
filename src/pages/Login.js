// Login.js
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const isSuccess = onLogin(username, password);
    if (isSuccess) {
      setUsername('');
      setPassword('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      onKeyDown={handleKeyDown} // Evento para ouvir a tecla Enter
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: 3,
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <Typography variant="h4" align="center" sx={{ marginBottom: '1rem' }}>
          Login
        </Typography>
        <TextField
          label="Nome de Usuário"
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          variant="outlined"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{ marginTop: '1rem', backgroundColor: '#1976d2' }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default Login;