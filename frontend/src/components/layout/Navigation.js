import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem, Box, IconButton } from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'var(--primary-color)',
              fontWeight: 700,
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            📅 SlingPro
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<DashboardIcon />}
            sx={{
              color: isActive('/') ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: isActive('/') ? 600 : 400,
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--primary-color)'
              }
            }}
          >
            Dashboard
          </Button>
          
          <Button
            component={Link}
            to="/schedule"
            startIcon={<CalendarIcon />}
            sx={{
              color: isActive('/schedule') ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: isActive('/schedule') ? 600 : 400,
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--primary-color)'
              }
            }}
          >
            Calendário
          </Button>
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Olá, {user?.name}
          </Typography>
          
          <IconButton
            onClick={handleMenu}
            sx={{
              color: 'var(--text-secondary)',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--primary-color)'
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: 'var(--primary-color)',
                fontSize: '0.875rem'
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius)'
              }
            }}
          >
            <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
              <AccountIcon fontSize="small" />
              Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ gap: 1, color: 'var(--error-color)' }}>
              <LogoutIcon fontSize="small" />
              Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 