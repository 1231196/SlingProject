import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { Grid, FormControl, InputLabel, Select, MenuItem, Button, Chip, Box, Typography } from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './SchedulePage.css';
import ShiftModal from '../components/schedule/ShiftModal';

// 1. CONFIGURAÇÃO DO LOCALIZER E FUNÇÕES AUXILIARES
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {}, // Passar um objeto de locales, mesmo que vazio
});

const getPositionColor = (position = '') => {
  const lowerCasePosition = position.toLowerCase();
  if (lowerCasePosition.includes('gestor')) return '#667eea';
  if (lowerCasePosition.includes('developer')) return '#10b981';
  if (lowerCasePosition.includes('caixa')) return '#f59e0b';
  if (lowerCasePosition.includes('barista')) return '#ef4444';
  return '#6b7280';
};

// =====================================================================================

const SchedulePage = () => {
  // 2. DECLARAÇÃO DE ESTADOS
  const [allShifts, setAllShifts] = useState([]);      // Guarda dados brutos da API
  const [filteredEvents, setFilteredEvents] = useState([]); // Guarda eventos formatados e filtrados para o calendário
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);               // Lista de utilizadores para o filtro

  // Estados dos filtros
  const [userFilter, setUserFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');

  // Estados do Modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingShift, setEditingShift] = useState(null);

  // 3. EFEITOS (LÓGICA DE DADOS)

  // useEffect para ir buscar os dados iniciais (corre apenas uma vez)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [shiftsRes, usersRes] = await Promise.all([
          axios.get('/api/shifts'),
          axios.get('/api/users'),
        ]);
        setAllShifts(shiftsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Erro ao obter dados iniciais:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // useEffect para aplicar os filtros sempre que os dados ou os filtros mudam
  useEffect(() => {
    let events = allShifts;

    if (userFilter !== 'all') {
      events = events.filter(shift => shift.user?._id === userFilter);
    }
    
    if (positionFilter !== 'all') {
      events = events.filter(shift => shift.position === positionFilter);
    }

    const formatted = events.map(shift => ({
      id: shift._id,
      title: `[${shift.position}] ${shift.user?.name || 'N/A'}`,
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
      resource: shift,
    }));
    
    setFilteredEvents(formatted);
  }, [allShifts, userFilter, positionFilter]);


  // 4. FUNÇÕES HANDLER

  const handleClearFilters = () => {
    setUserFilter('all');
    setPositionFilter('all');
  };

  const handleShiftChange = async () => {
    handleCloseModal(); // Fecha sempre o modal
    setLoading(true);
    try {
      const res = await axios.get('/api/shifts');
      setAllShifts(res.data); // Re-busca os dados para garantir consistência
    } catch (err) {
      console.error("Erro ao re-obter turnos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = (slot) => {
    setEditingShift(null);
    setSelectedSlot(slot);
    setOpenModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedSlot(null);
    setEditingShift(event.resource);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingShift(null);
    setSelectedSlot(null);
  };

  const eventStyleGetter = (event) => {
    const position = event.resource?.position || '';
    const backgroundColor = getPositionColor(position);
    return { 
      style: { 
        backgroundColor, 
        color: 'white', 
        borderRadius: '6px', 
        border: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontWeight: '500'
      } 
    };
  };

  const uniquePositions = [...new Set(allShifts.map(shift => shift.position))];

  // 5. RENDERIZAÇÃO
  
  if (loading && filteredEvents.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="schedule-page-container">
      {/* Header Section */}
      <div className="schedule-page-header">
        <h1>📅 Calendário de Turnos</h1>
        <p className="schedule-page-subtitle">
          Gerencie e visualize todos os turnos da sua equipa de forma intuitiva
        </p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <Typography className="filters-title">
          <FilterIcon /> Filtros
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Funcionário</InputLabel>
              <Select
                value={userFilter}
                label="Filtrar por Funcionário"
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <MenuItem value="all">Todos os Funcionários</MenuItem>
                {users.map(user => (
                  <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Posição</InputLabel>
              <Select
                value={positionFilter}
                label="Filtrar por Posição"
                onChange={(e) => setPositionFilter(e.target.value)}
              >
                <MenuItem value="all">Todas as Posições</MenuItem>
                {uniquePositions.map(position => (
                  <MenuItem key={position} value={position}>{position}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              fullWidth
              sx={{ height: '40px' }}
            >
              Limpar Filtros
            </Button>
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        {(userFilter !== 'all' || positionFilter !== 'all') && (
          <Box className="filter-chips" sx={{ mt: 2 }}>
            {userFilter !== 'all' && (
              <Chip
                label={`Funcionário: ${users.find(u => u._id === userFilter)?.name}`}
                onDelete={() => setUserFilter('all')}
                color="primary"
                size="small"
              />
            )}
            {positionFilter !== 'all' && (
              <Chip
                label={`Posição: ${positionFilter}`}
                onDelete={() => setPositionFilter('all')}
                color="primary"
                size="small"
              />
            )}
          </Box>
        )}
      </div>

      {/* Calendar Container */}
      <div className="calendar-container">
        {filteredEvents.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-title">Nenhum turno encontrado</div>
            <div className="empty-state-description">
              {userFilter !== 'all' || positionFilter !== 'all' 
                ? 'Tente ajustar os filtros ou adicionar novos turnos.'
                : 'Comece adicionando o primeiro turno da sua equipa.'
              }
            </div>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
              sx={{ mt: 2 }}
            >
              Adicionar Primeiro Turno
            </Button>
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            step={60}
            timeslots={1}
            min={new Date(0, 0, 0, 6, 0, 0)}
            max={new Date(0, 0, 0, 22, 0, 0)}
            messages={{
              next: "Próximo",
              previous: "Anterior",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              noEventsInRange: "Não há eventos neste período."
            }}
          />
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        className="fab"
        onClick={() => setOpenModal(true)}
        title="Adicionar novo turno"
      >
        <AddIcon />
      </button>

      {/* Shift Modal */}
      <ShiftModal
        open={openModal}
        handleClose={handleCloseModal}
        event={selectedSlot}
        shiftToEdit={editingShift}
        onShiftChange={handleShiftChange}
      />
    </div>
  );
};

export default SchedulePage;