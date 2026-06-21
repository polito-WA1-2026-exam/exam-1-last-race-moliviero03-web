import { Container, ListGroup } from "react-bootstrap";

function SegmentListDisplay(props){
    const segments = props.segments;

    return(
        <div style={{ maxHeight: '600px', overflowY: 'auto', width: '100%', paddingRight: '5px'}}>
            <ListGroup>
                {segments.map((s) => {
                    const key = `${s.station1} - ${s.station2}`;
                    const isSelected = s.active === 1;

                    return(
                        <ListGroup.Item key={key}
                            className={`mb-2 rounded border shadow-sm text-center ${isSelected ? 'opacity-50 bg-light' : ''}`}
                            action
                            onClick={() => props.addOrRemoveSegment(s)}>
                            <div className="fw-bold">{s.station1}</div>
                            <div className="text-muted small">↕</div>
                            <div className="fw-bold">{s.station2}</div>
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </div>
    )
}

export {SegmentListDisplay}