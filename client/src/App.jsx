import 'bootstrap/dist/css/bootstrap.min.css';

import { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';

import UserContext from './contexts/UserContext.js'

import { Header } from './components/Header.jsx';
import { LoginForm, Logout } from './components/LoginForm.jsx';
import { RulesDisplay } from './components/RulesDisplay.jsx';
import { NetworkMap } from './components/NetworkMap.jsx';
import { RankingDisplay } from './components/RankingDisplay.jsx';

import { checkSession, doLogin } from './api/auth.js'
import { getSegments } from './api/api.js';

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
            <Route path='home' element={<HomeView />} />
            <Route path='login' element={<LoginForm login={login} />} />
            <Route path='logout' element={<Logout login={login} />} />
            <Route path='setup' element={<SetupView />} />
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

function HomeView(props){
  const navigate = useNavigate();

  return(
    <Container>
      <Row className="align-items-center">
        <Col md={5} className="d-flex">
          <RulesDisplay />
        </Col>
        <Col md={2} className="d-flex">
          <Button className="shadow-none" onClick={() => navigate('/setup')}>
            PLAY
          </Button>
        </Col>
        <Col md={5} className="d-flex">
          <RankingDisplay />
        </Col>
      </Row>
    </Container>
  )
}

function SetupView(props){
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    async function getSegmentList(){
      try{
        const segment_list = await getSegments();
        let filtered_segments = segment_list.map(s => ({...s, active: 1}));
        setSegments(filtered_segments);
      }
      catch (ex){
        navigate('/*');
      }
    }
    getSegmentList()
  }, []);

  return(
    <GameModeContext.Provider value={"setup"}>
      <NetworkMap segments={segments} />
    </GameModeContext.Provider>
  )
}

export default App