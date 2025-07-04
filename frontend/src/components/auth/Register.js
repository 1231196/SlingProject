import React, { useState, useContext} from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon, 
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await register(formData);
      
      if (success) {
        navigate('/');
      } else {
        setError('O registo falhou. O email pode já estar em uso.');
      }
    } catch (error) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Criar Conta
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        Registe-se para começar a gerir a sua equipa
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Nome Completo"
        name="name"
        type="text"
        value={name}
        onChange={onChange}
        required
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: 'var(--primary-color)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--primary-color)',
            },
          },
        }}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={onChange}
        required
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: 'var(--primary-color)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--primary-color)',
            },
          },
        }}
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={onChange}
        required
        margin="normal"
        helperText="Mínimo 6 caracteres"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: 'var(--primary-color)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--primary-color)',
            },
          },
        }}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Função</InputLabel>
        <Select
          name="role"
          value={role}
          label="Função"
          onChange={onChange}
          startAdornment={
            <InputAdornment position="start">
              <WorkIcon color="action" />
            </InputAdornment>
          }
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              '&:hover': {
                borderColor: 'var(--primary-color)',
              },
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary-color)',
            },
          }}
        >
          <MenuItem value="employee">Funcionário</MenuItem>
          <MenuItem value="manager">Gestor</MenuItem>
          <MenuItem value="admin">Administrador</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          mt: 4,
          mb: 2,
          py: 1.5,
          borderRadius: 2,
          fontSize: '1.1rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 25px -5px rgb(0 0 0 / 0.2)'
          },
          '&:disabled': {
            background: 'var(--text-muted)',
            transform: 'none'
          }
        }}
      >
        {loading ? 'A registar...' : 'Registar'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Já tem uma conta?{' '}
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: 'var(--primary-color)',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Entrar
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;