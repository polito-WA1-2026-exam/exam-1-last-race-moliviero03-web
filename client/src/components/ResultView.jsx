import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";

import { getPlayers, updateScore } from "../api/api";

import { RankingDisplay } from "./RankingDisplay";
import UserContext from "../contexts/UserContext";

function ResultView(props){
    const score = props.score;

    const user = useContext(UserContext);

    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [isNewRecord, setIsNewRecord] = useState(false);

    useEffect(() => {
        async function syncAndGetPlayers(){
            try{
                if (user.bestScore === null || score > user.bestScore){
                    setIsNewRecord(true);
                    await updateScore(score);
                    props.updateBestScore(score);
                }

                const players_list = await getPlayers();
                setPlayers(players_list);
            }
            catch (ex){
                navigate('/error');
            }
        }
        syncAndGetPlayers()
    }, [])

    return (
        <Container className="mt-1">
            <Row className="justify-content-center mb-2">
                <Col md={6}>
                    <h2>Game finished!</h2>
                    <h3>Your score is: {score}</h3>
                    {isNewRecord && (<h4 className="text-success">New personal record!!!</h4>)}
                </Col>
                <Col md={6} className="d-flex">
                    <RankingDisplay players={players} />
                </Col>
            </Row>
        </Container>
    )
}

export {ResultView}