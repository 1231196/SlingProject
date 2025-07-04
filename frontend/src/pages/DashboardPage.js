import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalShifts: 0,
    totalUsers: 0,
    upcomingShifts: 0,
    completedShifts: 0
  });
  const [recentShifts, setRecentShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [shiftsRes, usersRes] = await Promise.all([
          axios.get('/api/shifts'),
          axios.get('/api/users')
        ]);

        const shifts = shiftsRes.data;
        const users = usersRes.data;
        const now = new Date();

        const upcomingShifts = shifts.filter(shift => new Date(shift.startTime) > now);
        const completedShifts = shifts.filter(shift => new Date(shift.endTime) < now);

        setStats({
          totalShifts: shifts.length,
          totalUsers: users.length,
          upcomingShifts: upcomingShifts.length,
          completedShifts: completedShifts.length
        });

        // Get recent shifts (next 5 upcoming)
        const sortedShifts = upcomingShifts
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
          .slice(0, 5);
        
        setRecentShifts(sortedShifts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}20`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 2, 
            bgcolor: `${color}20`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: color }}>
            {value}
          </Typography>
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Carregando dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ 
          color: 'white', 
          fontWeight: 700, 
          mb: 1,
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Bem-vindo de volta, {user?.name}! 👋
        </Typography>
        <Typography variant="h6" sx={{ 
          color: 'rgba(255,255,255,0.9)',
          fontWeight: 400
        }}>
          Aqui está um resumo da sua equipa e horários
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total de Turnos"
              value={stats.totalShifts}
              icon={<ScheduleIcon />}
              color="#667eea"
              subtitle="Todos os turnos criados"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Funcionários"
              value={stats.totalUsers}
              icon={<PeopleIcon />}
              color="#10b981"
              subtitle="Equipa ativa"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Próximos Turnos"
              value={stats.upcomingShifts}
              icon={<CalendarIcon />}
              color="#f59e0b"
              subtitle="Agendados para o futuro"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Turnos Concluídos"
              value={stats.completedShifts}
              icon={<CheckIcon />}
              color="#ef4444"
              subtitle="Já realizados"
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
            }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingIcon color="primary" />
                  Ações Rápidas
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    component={Link}
                    to="/schedule"
                    variant="contained"
                    startIcon={<CalendarIcon />}
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    Ver Calendário
                  </Button>
                  
                  <Button
                    component={Link}
                    to="/schedule"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Adicionar Turno
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Informações do Utilizador
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'var(--primary-color)' }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>

                <Chip 
                  label={user?.role || 'employee'} 
                  color="primary" 
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Shifts */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              height: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
            }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon color="primary" />
                  Próximos Turnos
                </Typography>

                {recentShifts.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CalendarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      Nenhum turno próximo
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Adicione turnos para começar a gerir a sua equipa
                    </Typography>
                    <Button
                      component={Link}
                      to="/schedule"
                      variant="contained"
                      startIcon={<AddIcon />}
                    >
                      Adicionar Primeiro Turno
                    </Button>
                  </Box>
                ) : (
                  <List>
                    {recentShifts.map((shift, index) => (
                      <React.Fragment key={shift._id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: getPositionColor(shift.position) }}>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {shift.user?.name}
                                </Typography>
                                <Chip 
                                  label={shift.position} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: getPositionColor(shift.position),
                                    color: 'white',
                                    fontSize: '0.75rem'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(shift.startTime).toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(shift.startTime).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })} - {new Date(shift.endTime).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < recentShifts.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Helper function for position colors
const getPositionColor = (position = '') => {
  const lowerCasePosition = position.toLowerCase();
  if (lowerCasePosition.includes('gestor')) return '#667eea';
  if (lowerCasePosition.includes('developer')) return '#10b981';
  if (lowerCasePosition.includes('caixa')) return '#f59e0b';
  if (lowerCasePosition.includes('barista')) return '#ef4444';
  return '#6b7280';
};

export default DashboardPage;