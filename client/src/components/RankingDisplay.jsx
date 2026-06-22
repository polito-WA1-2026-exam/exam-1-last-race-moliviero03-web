import { Container, Table, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

function RankingDisplay(props){
    const players = props.players;

    const navigate = useNavigate();

    const sortedPlayers = [...players].filter((p) => p.best_score !== 0).sort((a, b) => b.best_score-a.best_score);

    return( <Container className="mt-1">
            <Row className="justify-content-center">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan={3}>RANKING BOARD</th>
                            </tr>
                            <tr>
                                <th>Position</th>
                                <th>Username</th>
                                <th>Best score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((p, index) => <PlayerRow key={p.username} p={p} position={index+1}></PlayerRow>)}
                        </tbody>
                    </Table>
            </Row>
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Button className="shadow-none px-5" onClick={() => navigate('/home')}>
                        Home
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

function PlayerRow(props){
    const p = props.p;
    const position = props.position;

    return (
        <tr>
            <td>{position}</td>
            <td>{p.username}</td>
            <td>{p.best_score}</td>
        </tr>
    )
}

export { RankingDisplay }