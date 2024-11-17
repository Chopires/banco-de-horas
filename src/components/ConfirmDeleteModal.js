import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ConfirmDeleteModal = ({ open, onClose, onConfirm, funcionario }) => {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {funcionario ? `Deseja realmente deletar ${funcionario.nome}?` : 'Funcionário não encontrado.'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color="error" onClick={onConfirm} disabled={!funcionario}>
              Deletar
            </Button>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };
  

export default ConfirmDeleteModal;
