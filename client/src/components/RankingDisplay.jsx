import { Container, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getPlayers } from "../api/api";

function RankingDisplay(props){
    const [players, setPlayers] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        async function getPlayerList(){
            try{
                const players_list = await getPlayers();
                setPlayers(players_list);
            }
            catch (ex){
                navigate('/error');
            }
        }
        getPlayerList()
    }, []);

    return(
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th colSpan={2}>RANKING BOARD</th>
                </tr>
                <tr>
                    <th>username</th>
                    <th>score</th>
                </tr>
            </thead>
            <tbody>
                {players.map((p) => <PlayerRow key={p.username} p={p}></PlayerRow>)}
            </tbody>
        </Table>
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