import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab, Typography, Container } from '@mui/material';
import { Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'white', 
              fontWeight: 700, 
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            📅 SlingPro
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              mb: 1
            }}
          >
            Sistema de Gestão de Turnos
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Gerencie a sua equipa de forma eficiente com o nosso sistema de agendamento inteligente
          </Typography>
        </Box>

        <Paper 
          elevation={24}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header with Tabs */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  py: 2,
                  '&.Mui-selected': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: 3
                }
              }}
            >
              <Tab 
                icon={<LoginIcon />} 
                label="Entrar" 
                iconPosition="start"
              />
              <Tab 
                icon={<RegisterIcon />} 
                label="Registar" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Content */}
          <Box sx={{ p: 4 }}>
            {activeTab === 0 ? <Login /> : <Register />}
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem'
            }}
          >
            © 2024 SlingPro. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;