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
import { SegmentListDisplay } from './components/SegmentListDisplay.jsx';

import { checkSession, doLogin } from './api/auth.js'
import { getSegments, getStations } from './api/api.js';

function App() {

  const navigate = useNavigate();

  const [user, setUser] = useState({id: undefined, name: undefined, surname: undefined, username: undefined, score: undefined});

  const [route, setRoute] = useState([]);

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
            <Route path='planning' element={<PlanningView setRoute={setRoute}/>} />
            <Route path='*' element={<h1>Something went wrong{console.log(route)}</h1>} />
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

  const navigate = useNavigate();

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
    <Container className="mt-1">
      <Row className="justify-content-center mb-2">
        <Col xs="auto">
          <NetworkMap segments={segments} />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button className="shadow-none px-5" onClick={() => navigate('/planning')}>
            GO ON
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

function PlanningView(props){
  const [segments, setSegments] = useState([]);

  const [startAndFinish, setStartAndFinish] = useState([]);

  const navigate = useNavigate();

  const [localRoute, setLocalRoute] = useState([]);

  useEffect(() => {
    async function getSegmentList(){
      try{
        const segment_list = await getSegments();
        let filtered_segments = segment_list.map(s => ({...s, active: 0}));
        let shuffled_segments = shuffle(filtered_segments);
        setSegments(shuffled_segments);
      }
      catch (ex){
        console.log("error in effect of segments")
        navigate('/*');
      }
    }
    getSegmentList()
  }, []);

  useEffect(() => {
    async function getStationList(){
      try{
        const station_list = await getStations();
        let shuffled_stations = shuffle(station_list);
        setStartAndFinish(randomStation(shuffled_stations));
      }
      catch (ex){
        navigate('/*');
      }
    }
    getStationList();
  }, []);

  const addSegment = (segment) => {
    setSegments(old => old.map(s => (s.station1 === segment.station1 && s.station2 === segment.station2) ? {...s, active: 1} : s));
    setLocalRoute(old => [...old, segment]);
  }

  return (
    <Container className="mt-1">
      <Row className="justify-content-center mb-2">
        <Col md={9} className="d-flex">
          <NetworkMap segments={segments} overrideColor={"black"} startAndFinish={startAndFinish} />
        </Col>
        <Col md={3} className="d-flex">
          <SegmentListDisplay segments={segments} addSegment={addSegment} />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button className="shadow-none px-5" onClick={() => {
            props.setRoute(localRoute);
            navigate('/*');
          }}>
            SUBMIT
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

const randomStation = (station_list) => {
  const idx1 = Math.floor(Math.random() * station_list.length);
  const begin_station = station_list[idx1];

  const remaining_stations = station_list.filter((station, index) => index != idx1);

  const idx2 = Math.floor(Math.random() * remaining_stations.length);
  const end_station = remaining_stations[idx2];

  return [begin_station, end_station];
}

const shuffle = (list) => {
  const newList = [...list];
  for (let i = newList.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [newList[i], newList[j]] = [newList[j], newList[i]];
  }
  return newList;
}

export default App