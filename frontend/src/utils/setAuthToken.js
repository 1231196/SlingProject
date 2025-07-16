import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // Se o token existir, adiciona-o ao cabeçalho de todos os pedidos axios
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Se não houver token, remove o cabeçalho
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;