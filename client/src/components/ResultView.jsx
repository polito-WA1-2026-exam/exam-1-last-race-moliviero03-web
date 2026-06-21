import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";

import { getPlayers, updateScore } from "../api/api";

import { RankingDisplay } from "./RankingDisplay";
import UserContext from "../contexts/UserContext";

function ResultView(props){
    const score = props.score < 0 ? 0 : props.score;

    const wasInvalid = props.score === -100;

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
                navigate('/error', {
                    state: { message: ex.message || "Unknown error" }
                });
            }
        }
        syncAndGetPlayers()
    }, [])

    return (
        <Container className="mt-1">
            <Row className="justify-content-center mb-2">
                <Col xs="auto">
                    <h2>Game finished!</h2>
                    {wasInvalid && (<h3>Route was invalid</h3>)}
                    <h3>Your score is: {score}</h3>
                    {isNewRecord && (<h4 className="text-success">New personal record!!!</h4>)}
                </Col>
            </Row>
            <Row className="mt-1 justify-content-center">
                <Col xs="auto">
                    <Button className="shadow-none px-5" onClick={() => {
                            props.setScore(-100);
                            navigate('/setup')
                        }}>
                        New Game
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button className="shadow-none px-5" onClick={() => {
                            props.setScore(-100);
                            navigate('/home')
                        }}>
                        Home
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export {ResultView}