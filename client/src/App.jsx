import 'bootstrap/dist/css/bootstrap.min.css';

import { useContext, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';

import UserContext from './contexts/UserContext.js'

import { Header } from './components/Header.jsx';
import { LoginForm, Logout } from './components/LoginForm.jsx';
import { RulesDisplay } from './components/RulesDisplay.jsx';

import { checkSession, doLogin } from './api/auth.js'

function App() {

  const navigate = useNavigate();

  const [user, setUser] = useState({id: undefined, name: undefined, surname: undefined, username: undefined, score: undefined});

  useEffect(() => {
    checkSession().then(result => {
      if (result){
        setUser({id: result.userId, name: result.name, surname: result.surname, username: result.username, bestScore: result.bestScore});
      }
    })
  }, [])

  const login = (user) => {
    setUser({id: user.userId, name: user.name, surname: user.surname, username: user.username, bestScore: user.bestScore});
    navigate('/home');
  }

  return (
    <UserContext.Provider value={user}>
      <Container>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<RulesDisplay />} />
            <Route path='home' element={<h1>Work in progress</h1>} />
            <Route path='login' element={<LoginForm login={login} />} />
            <Route path='logout' element={<Logout login={login} />} />
            <Route path='*' element={<h1>Something went wrong</h1>} />
          </Route>
        </Routes>
      </Container>
    </UserContext.Provider>
  )

}

function MainLayout(props){
  return (
    <Container>
      <Header></Header>
      <Outlet />
    </Container>
  )
}

export default App