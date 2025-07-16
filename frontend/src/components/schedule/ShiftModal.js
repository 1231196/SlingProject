import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Modal, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Stack,
  Alert,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Close as CloseIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxWidth: '90vw',
  bgcolor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  border: '1px solid var(--border-color)',
  borderRadius: 3,
  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  p: 0,
  maxHeight: '90vh',
  overflow: 'auto'
};

const ShiftModal = ({ open, handleClose, event, shiftToEdit, onShiftChange }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: '', 
    position: '', 
    notes: '', 
    startTime: null, 
    endTime: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!shiftToEdit;

  // Efeito para ir buscar os utilizadores
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
      } catch (err) {
        console.error("Erro a obter utilizadores", err);
        setError('Erro ao carregar utilizadores');
      }
    };
    if (open) {
      fetchUsers();
    }
  }, [open]);

  // Efeito para preencher o formulário
  useEffect(() => {
    if (isEditing) {
      setFormData({
        user: shiftToEdit.user._id || shiftToEdit.user,
        position: shiftToEdit.position,
        notes: shiftToEdit.notes || '',
        startTime: new Date(shiftToEdit.startTime),
        endTime: new Date(shiftToEdit.endTime),
      });
    } else if (event) {
      setFormData({
        user: '', 
        position: '', 
        notes: '',
        startTime: new Date(event.start),
        endTime: new Date(event.end),
      });
    } else {
      // Reset form for new shift
      setFormData({
        user: '', 
        position: '', 
        notes: '', 
        startTime: new Date(), 
        endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      });
    }
    setError('');
  }, [shiftToEdit, event, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await axios.put(`/api/shifts/${shiftToEdit._id}`, formData);
      } else {
        await axios.post('/api/shifts', formData);
      }
      onShiftChange();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao guardar turno');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem a certeza que quer apagar este turno?')) {
      setLoading(true);
      try {
        await axios.delete(`/api/shifts/${shiftToEdit._id}`);
        onShiftChange();
        handleClose();
      } catch (err) {
        setError('Erro ao apagar turno');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          pb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {isEditing ? '✏️ Editar Turno' : '➕ Novo Turno'}
            </Typography>
            <IconButton 
              onClick={handleClose} 
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Date/Time Pickers */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <DateTimePicker
                label="Início do Turno"
                value={formData.startTime}
                onChange={(newValue) => handleDateChange('startTime', newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    sx={{ minWidth: 200 }}
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <DateTimePicker
                label="Fim do Turno"
                value={formData.endTime}
                onChange={(newValue) => handleDateChange('endTime', newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    sx={{ minWidth: 200 }}
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>

            {/* Employee Selection */}
            <FormControl fullWidth required>
              <InputLabel>Funcionário</InputLabel>
              <Select 
                name="user" 
                value={formData.user} 
                label="Funcionário" 
                onChange={handleChange}
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
                {users.map(u => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Position */}
            <TextField
              fullWidth 
              label="Posição" 
              name="position"
              value={formData.position} 
              onChange={handleChange}
              required
              placeholder="Ex: Barista, Caixa, Gestor..."
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
            
            {/* Notes */}
            <TextField
              fullWidth 
              label="Notas (opcional)" 
              name="notes"
              value={formData.notes} 
              onChange={handleChange} 
              multiline 
              rows={3}
              placeholder="Adicione notas ou observações sobre este turno..."
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
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Actions */}
          <Stack direction="row" spacing={2}>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
              startIcon={isEditing ? <SaveIcon /> : <AddIcon />}
              sx={{ 
                flex: 1,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-1px)'
                },
                '&:disabled': {
                  background: 'var(--text-muted)',
                  transform: 'none'
                }
              }}
            >
              {loading ? 'A guardar...' : (isEditing ? 'Guardar Alterações' : 'Criar Turno')}
            </Button>
            
            {isEditing && (
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDelete}
                disabled={loading}
                startIcon={<DeleteIcon />}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: 'var(--error-color)',
                  color: 'var(--error-color)',
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                  }
                }}
              >
                Apagar
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShiftModal;