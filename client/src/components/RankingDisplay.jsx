import { Container, Table, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getPlayers } from "../api/api";

function RankingDisplay(props){
    const players = props.players;

    const navigate = useNavigate();

    const sortedPlayers = [...players].sort((a, b) => b.best_score-a.best_score);

    return( <Container className="mt-1">
            <Row className="justify-content-center">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan={2}>RANKING BOARD</th>
                            </tr>
                            <tr>
                                <th>Username</th>
                                <th>Best score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((p) => <PlayerRow key={p.username} p={p}></PlayerRow>)}
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

    return (
        <tr>
            <td>{p.username}</td>
            <td>{p.best_score}</td>
        </tr>
    )
}

export { RankingDisplay }