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
                navigate('/error', {
                    state: { message: ex.message || "Unknown error" }
                });
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
            <Event route={route} setRoute={props.setRoute} setCurrSeg={setCurrSeg} setScore={props.setScore}/>
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
                navigate('/error', {
                    state: { message: ex.message || "Unknown error" }
                });
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
            props.setScore(coins);
            props.setRoute([]);
            navigate('/result');
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

    const formattedEffect = currEv.effect > 0 ? `+${currEv.effect}` : currEv.effect;

    if (currIdx === -1){
        return(
            <Row className="mt-2 w-100 align-items-center" style={{ maxWidth: '950px', margin: '0 auto' }}>
                <Col md={4} className="text-start fs-5 fw-bold text-muted">
                    Execution will start soon...
                </Col>
                <Col md={4} className="text-center fs-5">
                </Col>
                <Col md={4} className="text-end fs-3 fw-bold text-warning">
                    {'Coins: '}{coins}
                </Col>
            </Row>
        )
    }

    const localSeg = route[currIdx];

    return(
        <Row className="mt-2 w-100 align-items-center" style={{ maxWidth: '950px', margin: '0 auto' }}>
            <Col md={6} className="text-start fs-5 fw-bold">
                {localSeg.station1}{'<->'}{localSeg.station2}
            </Col>
            <Col md={4} className="text-center fs-5 fw-bold">
                {currEv.description}{': '}<span className={currEv.effect > 0 ? "text-success" : "text-danger"}>
                    {formattedEffect} </span>
            </Col>
            <Col md={2} className="text-end fs-3 fw-bold text-warning">
                {'Coins: '}{coins}
            </Col>
        </Row>
    )
}

export {ExecutionView};