import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from 'date-fns/locale';

const HourModal = ({ open, onClose, onSave, funcionario, operationType, novoFuncionarioNome, setNovoFuncionarioNome }) => {
  const [time, setTime] = useState(null); // Novo estado para armazenar a hora
  const [data, setData] = useState(new Date());

  // Função para lidar com a submissão
  const handleSubmit = () => {
    if (operationType === 'add' || operationType === 'subtract') {
      if (!time) {
        alert("Por favor, selecione a hora.");
        return;
      }
      const hours = time.getHours(); // Obtém as horas selecionadas
      const minutes = time.getMinutes(); // Obtém os minutos selecionados
      onSave(hours, minutes, data);
    } else if (operationType === 'add_employee') {
      if (!novoFuncionarioNome) {
        alert("Por favor, preencha o nome do funcionário.");
        return;
      }
      onSave(); // Chama o método de adicionar funcionário
    }
    onClose();
  };

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
        <Typography variant="h6" gutterBottom>
          {operationType === 'add' ? 'Adicionar Horas' : operationType === 'subtract' ? 'Descontar Horas' : 'Adicionar Funcionário'}
        </Typography>

        {operationType === 'add_employee' ? (
          <TextField
            label="Nome do Funcionário"
            value={novoFuncionarioNome}
            onChange={(e) => setNovoFuncionarioNome(e.target.value)}
            fullWidth
            margin="normal"
          />
        ) : (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label="Data"
              value={data}
              onChange={(newValue) => setData(newValue)}
              disableFuture // Isso restringe as datas futuras
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
        )}

        {operationType === 'add' || operationType === 'subtract' ? (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <TimePicker
              label="Hora"
              value={time}
              onChange={(newValue) => setTime(newValue)} // Atualiza o estado com a nova hora
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
        ) : null}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onClose} color="secondary" sx={{ mr: 2 }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default HourModal;
