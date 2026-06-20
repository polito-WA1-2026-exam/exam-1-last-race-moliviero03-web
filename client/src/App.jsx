import 'bootstrap/dist/css/bootstrap.min.css';

import { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';

import UserContext from './contexts/UserContext.js'

import { Header } from './components/Header.jsx';
import { LoginForm, Logout } from './components/LoginForm.jsx';
import { RulesDisplay } from './components/RulesDisplay.jsx';
import { RankingDisplay } from './components/RankingDisplay.jsx';
import { SetupView } from './components/SetupView.jsx';
import { PlanningView } from './components/PlanningView.jsx';
import { ExecutionView } from './components/ExecutionView.jsx';
import { ResultView } from './components/ResultView.jsx';

import { checkSession, doLogin } from './api/auth.js'
import { getSegments, getStations, getPlayers } from './api/api.js';

function App() {

  const navigate = useNavigate();

  const [user, setUser] = useState({id: undefined, name: undefined, surname: undefined, username: undefined, bestScore: undefined});

  const [route, setRoute] = useState([]);

  const [score, setScore] = useState(0);

  useEffect(() => {
    checkSession().then(result => {
      if (result){
        setUser({id: result.userId, name: result.name, surname: result.surname, username: result.username, bestScore: result.bestScore});
      }
    })
  }, []);

  const login = (user) => {
    setUser({id: user.userId, name: user.name, surname: user.surname, username: user.username, bestScore: user.bestScore});
    navigate('/home');
  }

  const updateBestScore = (score) => {
    setUser(old => ({...old, bestScore: score}));
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
            <Route path='planning' element={<PlanningView setRoute={setRoute}/>} />
            <Route path='execution' element={<ExecutionView route={route} setScore={setScore}/>} />
            <Route path='result' element={<ResultView score={score} updateBestScore={updateBestScore}/>} />
            <Route path='error' element={<h1>Route invalid</h1>} />
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
  const [players, setPlayers] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
      async function getPlayerList(){
          try{
              const players_list = await getPlayers();
              setPlayers(players_list);
          }
          catch (ex){
              navigate('/error');
          }
      }
      getPlayerList()
  }, []);

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
          <RankingDisplay players={players}/>
        </Col>
      </Row>
    </Container>
  )
}

export default App