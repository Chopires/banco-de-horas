// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Axios para requisições HTTP

// Componentes da MUI para interface
import { Button, IconButton, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HistoryIcon from '@mui/icons-material/History';

// Import para o modal de adicionar/descontar horas
import HourModal from '../components/HourModal';

// Imports adicionais para DatePicker e localização pt-BR
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ptBR } from 'date-fns/locale';


const Home = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(0);

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    const response = await axios.get('http://localhost:3001/funcionarios');
    setFuncionarios(response.data);
  };

  // Função para adicionar horas ao funcionário
  const handleAddHours = async () => {
    if (selectedFuncionario !== null) {
      const funcionario = funcionarios.find(f => f.id === selectedFuncionario);
      const totalMinutos = funcionario.saldo + horas * 60 + minutos;

      const updatedFuncionario = {
        ...funcionario,
        saldo: totalMinutos,
        historico: [
          ...funcionario.historico,
          { data: new Date().toLocaleDateString('pt-BR'), horas, minutos, tipo: 'adicionado' },
        ],
      };

      await axios.put(`http://localhost:3001/funcionarios/${funcionario.id}`, updatedFuncionario);
      fetchFuncionarios();
      setOpenModal(false);
    }
  };

  // Função para descontar horas do funcionário (similar a handleAddHours)
  const handleSubtractHours = async () => {
    if (selectedFuncionario !== null) {
      const funcionario = funcionarios.find(f => f.id === selectedFuncionario);
      const totalMinutos = funcionario.saldo - (horas * 60 + minutos);

      const updatedFuncionario = {
        ...funcionario,
        saldo: totalMinutos >= 0 ? totalMinutos : 0,
        historico: [
          ...funcionario.historico,
          { data: new Date().toLocaleDateString('pt-BR'), horas, minutos, tipo: 'descontado' },
        ],
      };

      await axios.put(`http://localhost:3001/funcionarios/${funcionario.id}`, updatedFuncionario);
      fetchFuncionarios();
      setOpenModal(false);
    }
  };

  const handleOpenModal = (tipo, funcionario) => {
    setModalData({ tipo, funcionario });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalData(null);
  };

  const handleConfirmModal = (data) => {
    console.log("Dados confirmados:", data); // Aqui iremos salvar o registro no JSON
    setOpenModal(false);
  };

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>Banco de Horas</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal('adicionar')}
      >
        Adicionar Funcionário
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Saldo</TableCell>
            <TableCell>Adicionar Hora</TableCell>
            <TableCell>Descontar Hora</TableCell>
            <TableCell>Histórico</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {funcionarios.map((funcionario) => (
            <TableRow key={funcionario.id}>
              <TableCell>{funcionario.nome}</TableCell>
              <TableCell>{funcionario.saldo}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenModal('adicionar', funcionario)} color="primary">
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenModal('descontar', funcionario)} color="secondary">
                  <RemoveIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton color="default">
                  <HistoryIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <HourModal open={openModal} onClose={handleCloseModal} onConfirm={handleConfirmModal} />
    </Box>
  );
};

export default Home;
