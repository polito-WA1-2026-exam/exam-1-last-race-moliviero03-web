import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

import { NetworkMap } from "./NetworkMap";
import { SegmentListDisplay } from "./SegmentListDisplay";

import { getSegments, getStations } from "../api/api";

function PlanningView(props){
  const [segments, setSegments] = useState([]);

  const [startAndFinish, setStartAndFinish] = useState([]);

  const navigate = useNavigate();

  const [localRoute, setLocalRoute] = useState([]);

  useEffect(() => {
    async function getNetworkMap(){
      try{
        const segment_list = await getSegments();
        let filtered_segments = segment_list.map(s => ({...s, active: 0}));
        let shuffled_segments = shuffle(filtered_segments);
        setSegments(shuffled_segments);

        const station_list = await getStations();
        let shuffled_stations = shuffle(station_list);
        setStartAndFinish(randomStation(shuffled_stations, shuffled_segments));
      }
      catch (ex){
        navigate('/*');
      }
    }
    getNetworkMap()
  }, []);

  const addSegment = (segment) => {
    const isActive = segment.active === 1;
    setSegments(old => old.map(s => 
        (s.station1 === segment.station1 && s.station2 === segment.station2)
            ? {...s, active: isActive ? 0 : 1} : s));
    if (isActive){
        setLocalRoute(old => old.filter(s => !(s.station1 === segment.station1 && s.station2 === segment.station2)));
    }
    else{
        setLocalRoute(old => [...old, segment]);
    }
  }

  return (
    <Container className="mt-1">
      <Row className="justify-content-center mb-2">
        <Col md={9} className="d-flex">
          <NetworkMap segments={segments} overrideColor={"orange"} startAndFinish={startAndFinish} />
        </Col>
        <Col md={3} className="d-flex">
          <SegmentListDisplay segments={segments} addSegment={addSegment} />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={2}>
            <Timer route={localRoute} startAndFinish={startAndFinish} setRoute={props.setRoute} navigate={navigate}/>
        </Col>
        <Col md={2}>
          <Button className="shadow-none px-5" onClick={() => {terminate(localRoute, startAndFinish, props.setRoute, navigate)}}>
            SUBMIT
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

function Timer(props){
    const [time, setTime] = useState(90);
    const route = props.route;
    const startAndFinish = props.startAndFinish;
    const setRoute = props.setRoute;
    const navigate = props.navigate;

    useEffect(() => {
        const interval = setInterval(() =>{setTime(prevTime => prevTime - 1);}, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (time <= 0){
            console.log("Time's up");
            terminate(route, startAndFinish, setRoute, navigate);
        }
    }, [time]);

    return(
        <h2>{time}</h2>
    )
}

const terminate = (route, startAndFinish, setRoute, navigate) => {
  const valid = validate(route, startAndFinish);
  if (valid === false){
    navigate('/*');
  }
  else{
    setRoute(valid);
    navigate('/execution');
  }
}

const randomStation = (station_list, segment_list) => {
  const graph = createGraph(station_list, segment_list)

  while(true){
    const idx1 = Math.floor(Math.random() * station_list.length);
    const begin_station = station_list[idx1];

    const remaining_stations = station_list.filter((station, index) => index != idx1);

    const idx2 = Math.floor(Math.random() * remaining_stations.length);
    const end_station = remaining_stations[idx2];

    if (check(graph, [begin_station, end_station])){
      return [begin_station, end_station];
    }
  }
}

const shuffle = (list) => {
  const newList = [...list];
  for (let i = newList.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [newList[i], newList[j]] = [newList[j], newList[i]];
  }
  return newList;
}

const createGraph = (stations, segments) => {
  const graph = {};

  for (const stat of stations){
    graph[stat] = [];
  }

  for (const seg of segments){
    graph[seg.station1].push(seg.station2);
    graph[seg.station2].push(seg.station1);
  }

  return graph;
}

const check = (graph, startAndFinish) => {
  const start = startAndFinish[0];
  const finish = startAndFinish[1];

  const visited = [start];
  const to_visit = [start];

  const dist = {};
  dist[start] = 0;

  while(to_visit.length > 0) {
    const curr = to_visit.shift();
    
    if (curr === finish){
      break;
    }

    for (let e of graph[curr]){
      if (!visited.includes(e)){
        visited.push(e);
        to_visit.push(e);
        dist[e] = dist[curr] + 1;
      }
    }
  }

  return dist[finish] !== undefined && dist[finish] > 2;
}

const validate = (route, startAndFinish) => {
  let r = [...route];

  const start = startAndFinish[0];
  const finish = startAndFinish[1];

  const count = {}
  for (let seg of route){
    count[seg.station1] = (count[seg.station1] || 0) + 1;
    count[seg.station2] = (count[seg.station2] || 0) + 1;
  }
  if (!Object.keys(count).includes(start) || !Object.keys(count).includes(finish)) return false;
  for (let [stat, freq] of Object.entries(count)){
    if ((freq%2 == 1) && stat !== start && stat !== finish) return false;
    if ((freq%2 == 0) && (stat === start || stat === finish)) return false;
  }

  let fr = [];
  let visited = [];

  let curr = start;

  while (r.length > 0){
    let flag = false;
    for (let seg of r){
      if (seg.station1 === curr || seg.station2 === curr){
        curr = seg.station1 === curr ? seg.station2 : seg.station1;
        r = r.filter(s => !(s.station1 === seg.station1 && s.station2 === seg.station2));
        fr.push(seg);
        flag = true;
        r = r.concat(visited);
        visited = []
        break;
      }
    }

    if (flag === false){
      let lastSeg = fr.pop();
      curr = lastSeg.station1 === curr ? lastSeg.station2 : lastSeg.station1;
      visited.push(lastSeg);
    }
  }

  return fr;
}

export {PlanningView}