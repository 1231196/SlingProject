// REACT LIBRARY IMPORTS
import React, { useEffect, useContext } from 'react'; // <-- PRECISAMOS DE useEffect e useContext
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// IMPORTS DE PÁGINAS
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import SchedulePage from './pages/SchedulePage';
// IMPORTS DE COMPONENTES E CONTEXTO
import PrivateRoute from './components/routing/PrivateRoute';
import Navigation from './components/layout/Navigation';
import { AuthContext } from './context/AuthContext'; // <-- PRECISAMOS DE IMPORTAR O CONTEXTO
import setAuthToken from './utils/setAuthToken'; // <-- PRECISAMOS DE IMPORTAR ISTO TAMBÉM
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale'; // Opcional: para ter o picker em português

 

import './App.css';

// Esta verificação é importante: se houver um token no localStorage quando
// a app é carregada, nós configuramos o axios para o usar imediatamente.
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  // Usamos o useContext para ter acesso às funções do nosso AuthContext
  const { loadUser, isAuthenticated } = useContext(AuthContext);

  // O useEffect com um array vazio [] corre apenas uma vez, quando o componente é montado.
  // É o sítio perfeito para chamar a função que verifica a autenticação do utilizador.
  useEffect(() => {
    console.log('App.js: A chamar loadUser() no arranque da aplicação.');
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        {/* Aqui podemos colocar o ThemeProvider se quisermos */}
      <div className="App">
        {/* Show Navigation only when authenticated */}
        {isAuthenticated && <Navigation />}
        
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LandingPage />} />

          {/* Rotas Privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
          </Route>
        </Routes>
      </div>
      </LocalizationProvider>
    </Router>
  );
}

export default App;