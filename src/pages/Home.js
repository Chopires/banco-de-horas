import React, { useState, useEffect } from 'react';
import { Button, IconButton, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import HourModal from '../components/HourModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import HistoricoModal from '../components/HistoricoModal';
import axios from 'axios';

const Home = ({ onLogout }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para armazenar a pesquisa
  const [filteredFuncionarios, setFilteredFuncionarios] = useState([]); // Lista de funcionários filtrados
  const [openModal, setOpenModal] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [operationType, setOperationType] = useState('');
  const [novoFuncionarioNome, setNovoFuncionarioNome] = useState('');
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedFuncionarioForDelete, setSelectedFuncionarioForDelete] = useState(null);
  const [historicoOpen, setHistoricoOpen] = useState(false); // controla a abertura do modal de histórico
  const [funcionarioParaHistorico, setFuncionarioParaHistorico] = useState(null); // armazena o funcionário selecionado para o histórico


  useEffect(() => {
    setFuncionarios((prevFuncionarios) =>
      [...prevFuncionarios].sort((a, b) => a.nome.localeCompare(b.nome))
    );
  }, [funcionarios]);


  // Carregar dados dos funcionários ao montar o componente
  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await axios.get('http://localhost:3001/funcionarios');
        setFuncionarios(response.data);
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
      }
    };

    fetchFuncionarios();
  }, []);

  // Função para abrir o modal de adicionar horas
  const handleOpenModal = (funcionario, type) => {
    setSelectedFuncionario(funcionario);
    setOperationType(type);
    setNovoFuncionarioNome(''); // Limpa o campo do novo funcionário
    setOpenModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFuncionario(null);
    setOperationType('');
  };

  const handleAddHours = async (funcionarioId, horas, minutos, data, tipo) => {
    try {
      const funcionario = funcionarios.find(f => f.id === funcionarioId);
      console.log("Funcionário encontrado:", funcionario);

      // Garantir que o histórico é um array
      const historico = Array.isArray(funcionario.historico) ? funcionario.historico : [];

      const minutosTotais = horas * 60 + minutos;
      const novoSaldo = tipo === 'add' ? funcionario.saldo + minutosTotais : funcionario.saldo - minutosTotais;

      // Atualizar saldo localmente
      const updatedFuncionarios = funcionarios.map(f =>
        f.id === funcionarioId ? { ...f, saldo: novoSaldo, historico: [...historico, { data, horas, minutos, tipo }] } : f
      );
      setFuncionarios(updatedFuncionarios);

      // Atualizar no JSON server
      await axios.put(`http://localhost:3001/funcionarios/${funcionarioId}`, {
        ...funcionario,
        saldo: novoSaldo,
        historico: [...historico, { data: data.toISOString().split('T')[0], horas, minutos, tipo }],
      });

      handleCloseModal();
    } catch (error) {
      console.error("Erro ao adicionar/descontar horas:", error);
    }
  };

  // Função para formatar o saldo de horas e minutos
  const formatTime = (totalMinutes) => {
    const isNegative = totalMinutes < 0; // Verifica se o saldo é negativo
    const absMinutes = Math.abs(totalMinutes); // Usa o valor absoluto para facilitar a formatação

    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;

    // Adiciona o sinal negativo apenas às horas, se necessário
    return `${isNegative ? '-' : ''}${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Função para adicionar novo funcionário
  const handleAddFuncionario = async (nome) => {
    if (!novoFuncionarioNome) {
      alert("Por favor, preencha o nome do funcionário.");
      return;
    }

    const novoFuncionario = {
      // id: Date.now(), // Gerando um ID único
      nome: novoFuncionarioNome,
      saldo: 0,
      historico: [],
    };

    try {
      const response = await axios.post('http://localhost:3001/funcionarios', novoFuncionario);
      setFuncionarios([...funcionarios, response.data]);
    } catch (error) {
      console.error("Erro ao adicionar funcionário:", error);
    }
  };

  // Função para deletar funcionário
  const handleDeleteFuncionario = async (funcionarioId) => {
    try {
      await axios.delete(`http://localhost:3001/funcionarios/${funcionarioId}`);
      setFuncionarios(funcionarios.filter(f => f.id !== funcionarioId));
      setOpenConfirmDeleteModal(false);
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
    }
  };

  // Função para abrir o modal do histórico
  const handleOpenHistorico = (funcionario) => {
    setFuncionarioParaHistorico(funcionario);
    setHistoricoOpen(true);
  };

  // Função para fechar o modal do histórico
  const handleCloseHistorico = () => {
    setHistoricoOpen(false);
    setFuncionarioParaHistorico(null);
  };

  useEffect(() => {
    // Filtra os funcionários com base no texto digitado na pesquisa
    setFilteredFuncionarios(
      funcionarios.filter(funcionario =>
        funcionario.nome.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, funcionarios]); // Atualiza a lista filtrada sempre que a pesquisa ou lista de funcionários mudar


  return (
    <Box p={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, alignItems: 'center' }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>Bem-vindo(a) ao Banco de Horas da Regulação!</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={onLogout}
        >
          Logout
        </Button>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal(null, 'add_employee')}
        style={{ marginBottom: '20px' }}
      >
        Adicionar Funcionário
      </Button>

      {/* CAMPO DE BUSCA DE FUNCIONÁRIO */}
      <TextField
        label="Pesquisar Funcionário"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        margin="normal"

        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#1976d2' }} />
            </InputAdornment>
          ),
        }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: '#1976d2', // Cor azul para destacar
                backgroundColor: '#e3f2fd', // Cor de fundo suave para as colunas
                fontSize: '1.1rem', // Aumentar um pouco o tamanho da fonte
              }}
            >
              Nome
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: '#1976d2',
                backgroundColor: '#e3f2fd',
                fontSize: '1.1rem',
              }}
            >
              Saldo
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: '#1976d2',
                backgroundColor: '#e3f2fd',
                fontSize: '1.1rem',
              }}
            >
              Adicionar Hora
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: '#1976d2',
                backgroundColor: '#e3f2fd',
                fontSize: '1.1rem',
              }}
            >
              Descontar Hora
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: '#1976d2',
                backgroundColor: '#e3f2fd',
                fontSize: '1.1rem',
              }}
            >
              Histórico
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: '#1976d2',
                backgroundColor: '#e3f2fd',
                fontSize: '1.1rem',
              }}
            >
              Excluir
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredFuncionarios.map((funcionario) => (
            <TableRow key={funcionario.id}>
              <TableCell>
                {funcionario.nome}</TableCell>
              <TableCell>
                {formatTime(funcionario.saldo)}</TableCell> {/* Formatar saldo */}
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpenModal(funcionario, 'add')}
                  sx={{
                    fontWeight: 'bold',
                    color: '#1976d2', // Cor azul para destacar
                    backgroundColor: '#e3f2fd', // Cor de fundo suave para as colunas
                    fontSize: '1.1rem', // Aumentar um pouco o tamanho da fonte
                    marginLeft: '30px',
                  }}
                >
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => handleOpenModal(funcionario, 'subtract')}
                  sx={{
                    fontWeight: 'bold',
                    color: '#D32F2F', // Cor azul para destacar
                    backgroundColor: '#FFCDD2', // Cor de fundo suave para as colunas
                    fontSize: '1.1rem', // Aumentar um pouco o tamanho da fonte
                    marginLeft: '30px',
                  }}>
                  <RemoveIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenHistorico(funcionario)}>
                  <HistoryIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => {
                  setSelectedFuncionarioForDelete(funcionario);
                  setOpenConfirmDeleteModal(true);
                }}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

      <HourModal
        open={openModal}
        onClose={handleCloseModal}
        onSave={operationType === 'add_employee' ? handleAddFuncionario : (horas, minutos, data) =>
          handleAddHours(selectedFuncionario?.id, horas, minutos, data, operationType)
        }
        funcionario={selectedFuncionario}
        operationType={operationType}
        novoFuncionarioNome={novoFuncionarioNome}
        setNovoFuncionarioNome={setNovoFuncionarioNome}
      />

      <ConfirmDeleteModal
        open={openConfirmDeleteModal}
        onClose={() => setOpenConfirmDeleteModal(false)}
        onConfirm={() => handleDeleteFuncionario(selectedFuncionarioForDelete.id)}
        funcionario={selectedFuncionarioForDelete}
      />

      {historicoOpen && (
        <HistoricoModal
          open={historicoOpen}
          onClose={handleCloseHistorico}
          funcionario={funcionarioParaHistorico}
        />
      )}


    </Box>
  );
};

export default Home;
