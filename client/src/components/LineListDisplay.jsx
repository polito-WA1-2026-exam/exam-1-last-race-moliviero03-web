import { Container, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getLines } from "../api/api";

function LineListDisplay(props){
    const [lines, setLines] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function getLineList(){
            try{
                const lines_list = await getLines();
                setLines(lines_list);
            }
            catch (ex){
                navigate('/error', {
                    state: { message: ex.message || "Unknown error" }
                });
            }
        }
        getLineList();
    }, []);

    const getLineStations = (segments) => {
        if (!segments || segments.length === 0) return "No stations";

        const stations = [];
        for (let seg of segments){
            if (!stations.includes(seg.station1)) stations.push(seg.station1);
            if (!stations.includes(seg.station2)) stations.push(seg.station2);
        }

        return stations.join("<-->");
    }

    return (
        <Container className="mb-1">
            <ListGroup>
                {lines.map((l) => {
                    const lineColor = (l.segments && l.segments.length > 0) ? l.segments[0].color : "black";
                    return (
                        <ListGroup.Item key={l.lineNumber} style={{ color: lineColor, fontWeight: "500"}} className="mb-2 border">
                            <strong>Line {l.lineNumber}: </strong>{getLineStations(l.segments)}
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </Container>
    )
}

export {LineListDisplay}