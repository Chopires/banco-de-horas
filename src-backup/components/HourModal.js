import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal, Grid } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddHoursModal = ({ open, handleClose, handleAddHours }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSubmit = () => {
    if (hours !== '' && minutes !== '') {
      handleAddHours(date, hours, minutes);
      setHours('');
      setMinutes('');
      setDate(new Date());
      handleClose();
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Adicionar Horas
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
          <DatePicker
            label="Data"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            renderInput={({ inputRef, inputProps, InputProps }) => (
              <TextField
                inputRef={inputRef}
                {...inputProps}
                value={format(date, 'dd/MM/yyyy')} // Formata a data como dia/mês/ano
                InputProps={{
                  ...InputProps,
                  readOnly: true, // Faz o campo ser apenas leitura
                }}
              />
            )}
            // Adicionando a propriedade "format" para garantir o formato correto
            format="dd/MM/yyyy" // Isso pode não ser necessário, mas é bom garantir
          />
        </LocalizationProvider>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={6}>
            <TextField
              label="Horas"
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Minutos"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <Box marginTop={2}>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Cadastrar
          </Button>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddHoursModal;
