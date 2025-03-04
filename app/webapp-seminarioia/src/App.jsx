import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './pages/login/Login';
import PrincipalMain from './pages/principal-main/PrincipalMain';


const App = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    console.log(user)
  }, [user])


  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <PrincipalMain />
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;