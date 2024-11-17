import React from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const HistoricoModal = ({ open, onClose, funcionario }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2, color: '#1976d2' }}>
          Histórico de {funcionario?.nome}
        </Typography>
        <List>
          {funcionario?.historico && funcionario?.historico.length > 0 ? (
            funcionario.historico.map((entry, index) => (
              <ListItem key={index} sx={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #ddd',
                mb: 1,
                pb: 1,
                '&:last-child': { borderBottom: 'none' },
              }}>
                <CalendarTodayIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="body1" sx={{ mr: 2 }}>
                  {new Date(entry.data).toLocaleDateString()}
                </Typography>

                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: entry.tipo === 'add' ? '#4CAF50' : '#F44336',
                        fontWeight: 'bold',
                      }}
                    >
                      {entry.tipo === 'add' ? (
                        <AddCircleIcon sx={{ mr: 1 }} />
                      ) : (
                        <RemoveCircleIcon sx={{ mr: 1 }} />
                      )}
                      {/* Formatação para Horas e Minutos */}
                      {`Horas: ${String(entry.horas).padStart(2, '0')}:${String(entry.minutos).padStart(2, '0')}h`}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: 'gray', textAlign: 'center' }}>
              Nenhum histórico encontrado.
            </Typography>
          )}
        </List>
      </Box>
    </Modal>
  );
};

export default HistoricoModal;
