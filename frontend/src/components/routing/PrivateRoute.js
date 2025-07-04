import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // Enquanto verificamos a autenticação, mostramos uma mensagem de loading
    // Isto evita um "flash" da página de login antes de detetar o utilizador logado
    return <div>Loading...</div>;
  }

  // Se estiver autenticado, renderiza o componente filho (a página protegida)
  // Se não, redireciona para a página de login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;