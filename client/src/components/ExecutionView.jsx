import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

import { NetworkMap } from "./NetworkMap";

import { getSegments, getEvents } from "../api/api";
import { shuffle, getStartAndFinish, getRandomEvent } from "../utils/utils";

function ExecutionView(props){
    const route = props.route;
    const startAndFinish = getStartAndFinish(route);
    const [segments, setSegments] = useState([]);
    const [currSeg, setCurrSeg] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function getNetworkMapWithRoute(){
            try{
                const segment_list = await getSegments();
                let filtered_segments = segment_list.map(s => {
                    const isInRoute = route.some(rs => 
                        (s.station1 === rs.station1 && s.station2 === rs.station2) ||
                        (s.station1 === rs.station2 && s.station2 === rs.station1)
                    );
                    return {...s, active: isInRoute ? 1 : 0};
                });

                setSegments(filtered_segments);
            }
            catch (ex){
                navigate('/error');
            }
        }
        getNetworkMapWithRoute();
    }, []);

    return(
        <Container className="mt-1">
            <Row className="justify-content-center mb-2">
                <Col xs="auto" className="d-flex">
                    <NetworkMap segments={segments} overrideColor={"red"} startAndFinish={startAndFinish} eventSegment={currSeg}/>
                </Col>
            </Row>
            <Event route={route} setCurrSeg={setCurrSeg}/>
        </Container>
    )
}

function Event(props){
    const route = props.route;
    const [events, setEvents] = useState([]);
    const [currEv, setCurrEv] = useState({});
    const [coins, setCoins] = useState(20);

    const navigate = useNavigate();

    const [currIdx, setCurrIdx] = useState(-1);

    useEffect(() => {
        async function getEventList(){
            try{
                const event_list = await getEvents();
                const shuffled_events = shuffle(event_list);
                setEvents(shuffled_events);
            }
            catch (ex){
                console.log(ex);
                navigate('/*');
            }
        }
        getEventList()
    }, []);

    useEffect(() =>{
        const interval = setInterval(() => {setCurrIdx(prev => prev+1);}, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currIdx >= route.length){
            navigate('/*');
        }
    }, [currIdx, route.length, navigate]);

    useEffect(() => {
        if (events.length === 0){
            return;
        }
        if (currIdx === -1){
            props.setCurrSeg(null);
            return;
        }
        if (currIdx < route.length){
            props.setCurrSeg(route[currIdx]);
            const event = getRandomEvent(events);
            setCurrEv(event);
            setCoins(prev => prev + event.effect);
        }
    }, [currIdx, route, props.setCurrSeg, events]);

    if (currIdx >= route.length){
        return null;
    }

    if (currIdx === -1){
        return(
            <Row className="justify-content-center mb-2">
                <Col xs="auto" className="d-flex">
                    Execution will start soon...
                </Col>
                <Col xs="auto" className="d-flex">
                    {'Coins: '}{coins}
                </Col>
            </Row>
        )
    }

    const localSeg = route[currIdx];

    return(
        <Row className="justify-content-center mb-2">
            <Col xs="auto" className="d-flex">
                {localSeg.station1}{'<->'}{localSeg.station2}
            </Col>
            <Col xs="auto" className="d-flex">
                {currEv.description}{': '}{currEv.effect}
            </Col>
            <Col xs="auto" className="d-flex">
                {'Coins: '}{coins}
            </Col>
        </Row>
    )
}

export {ExecutionView};