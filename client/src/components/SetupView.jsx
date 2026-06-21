import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

import { NetworkMap } from "./NetworkMap";
import { LineListDisplay } from "./LineListDisplay";

import { getSegments } from "../api/api";

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
        navigate('/error');
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
          <LineListDisplay />
        </Col>
        <Col xs="auto">
          <Button className="shadow-none px-5" onClick={() => navigate('/planning')}>
            GO ON
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export {SetupView}