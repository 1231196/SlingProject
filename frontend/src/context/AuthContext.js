import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'; // Precisamos de importar isto

// Estado inicial
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true, // Começa como 'true' para que possamos mostrar um spinner de loading
  user: null,
  error: null,
};

// Criar o contexto
export const AuthContext = createContext(initialState);

// Reducer para gerir as ações
const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED': // <-- AÇÃO EM FALTA
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload, // Guarda o objeto do utilizador no estado
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false, // Define loading como false após o login/registo
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Componente Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Ações

  // Carregar Utilizador: Verifica se há um token e obtém os dados do utilizador
  // Esta função é a peça que estava em falta.
  async function loadUser() {
    if (localStorage.token) {
      setAuthToken(localStorage.token); // Define o token global para o axios
    }

    try {
      const res = await axios.get('/api/auth');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }

  // ...
  // AÇÃO DE LOGIN ATUALIZADA
  async function login(formData) {
    // Adicionamos um bloco try...catch à volta de TUDO
    try {
      const res = await axios.post('/api/auth/login', formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });

      setAuthToken(res.data.token);

      // Agora, a chamada a loadUser() também está dentro do try...catch
      await loadUser(); 
      
      return true; // Só retorna true se TUDO for bem-sucedido
    } catch (err) {
      // Este catch irá apanhar tanto o erro do login (ex: 400 credenciais inválidas)
      // como um possível erro do loadUser (ex: 404 que tínhamos)
      console.error("Erro durante o processo de login:", err.response ? err.response.data : err.message);
      
      dispatch({
        type: 'LOGIN_FAIL',
        // Usamos a mensagem de erro da resposta, se existir
        payload: err.response ? err.response.data.msg : 'Erro de rede',
      });
      return false; // Retorna false em qualquer caso de falha
    }
  }

  // Faça a mesma alteração para a função register
  async function register(formData) {
    try {
      const res = await axios.post('/api/users/register', formData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });

      setAuthToken(res.data.token);
      await loadUser();
      return true;
    } catch (err) {
      console.error("Erro durante o processo de registo:", err.response ? err.response.data : err.message);
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response ? err.response.data.msg : 'Erro de rede'
      });
      return false;
    }
  }
  // Logout
  function logout() {
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser, // Exportar a função para ser usada no App.js
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};