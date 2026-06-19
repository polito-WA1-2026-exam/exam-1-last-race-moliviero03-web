import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

import { NetworkMap } from "./NetworkMap";

import { getSegments } from "../api/api";

function ExecutionView(props){
    const route = props.route;
    const startAndFinish = getStartAndFinish(route);
    const [segments, setSegments] = useState([]);

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
                navigate('/*');
            }
        }
        getNetworkMapWithRoute();
    }, []);

    return(
        <Container className="mt-1">
            <Row className="justify-content-center mb2">
                <Col md={9} className="d-flex">
                    <NetworkMap segments={segments} overrideColor={"red"} startAndFinish={startAndFinish} />
                </Col>
                <Col md={3} className="d-flex">
                    <Event route={route} />
                </Col>
            </Row>
        </Container>
    )
}

function Event(props){
    const route = props.route;

    const navigate = useNavigate();

    const [currIdx, setCurrIdx] = useState(0);

    useEffect(() =>{
        const interval = setInterval(() => {setCurrIdx(prev => prev+1);}, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currIdx >= route.length){
            navigate('/*');
        }
    }, [currIdx, route.length, navigate]);

    if (currIdx >= route.length){
        return null;
    }

    const currSeg = route[currIdx];

    return(
        <h5>{currSeg.station1}{'<-->'}{currSeg.station2}</h5>
    )
}

const getStartAndFinish = (route) => {
    const firstSeg = route[0];
    const secondSeg = route[1];

    const almostLastSeg = route[route.length-2];
    const lastSeg = route[route.length -1];

    const start = (firstSeg.station1 !== secondSeg.station1 && firstSeg.station1 !== secondSeg.station2) ? firstSeg.station1 : firstSeg.station2;
    const finish = (lastSeg.station1 !== almostLastSeg.station1 && lastSeg.station1 !== almostLastSeg.station2) ? lastSeg.station1 : lastSeg.station2;

    return [start, finish];
}

export {ExecutionView};