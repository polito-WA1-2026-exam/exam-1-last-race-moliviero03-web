import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

import { NetworkMap } from "./NetworkMap";
import { SegmentListDisplay } from "./SegmentListDisplay";

import { getSegments, getStations } from "../api/api";
import { shuffle, getRandomStation, terminate } from "../utils/utils";

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
        setStartAndFinish(getRandomStation(shuffled_stations, shuffled_segments));
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

export {PlanningView}