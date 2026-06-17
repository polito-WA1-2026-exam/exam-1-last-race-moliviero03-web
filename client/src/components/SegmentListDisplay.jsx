import { Container, ListGroup } from "react-bootstrap";

function SegmentListDisplay(props){
    const segments = props.segments;

    return(
        <ListGroup variant="flush">
            {segments.map((s) => {
                const key = `${s.station1} - ${s.station2}`;

                return(
                    <ListGroup.Item key={key} className="text-start" action onClick={() => props.addSegment(s)}>
                        {s.station1}{'<-->'}{s.station2}
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
    )
}

export {SegmentListDisplay}