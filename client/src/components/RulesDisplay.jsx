import { Container } from "react-bootstrap";

function RulesDisplay(props){
    return (
        <Container>
            <h2>Rules</h2>
            <ol>
                <li><strong>Setup:</strong> In this phase, the player will
                see the network map, with the lines connecting the stations.
                His aim is to memorize it for the next phase. Whenever he is ready,
                he can click on the "GO ON" button to go to the next phase.</li>
                <li><strong>Plan:</strong> In this phase, the player will see the network map
                with only the stations on the left, on the right the list of the connections.
                In the map, two stations are highlighted: the starting and the finish stations.
                The player has 90 seconds to create a route, that is a sequence of connections,
                to connect the start and finish station. Be aware that the player must insert
                the connections IN ORDER, because the route to be validated is strictly the one submitted.
                Once done, he has to click the "SUBMIT" button
                to save it. If the timer expires, the route will be automatically submitted.
                To add a connection to the route, he has to click it on the list, if he
                wants to remove it, he has to click it again.
                Be aware that a route is valid if: it starts from the "start" station and finishes
                at the "finish" one; there is no extra connections apart the ones building the route.</li>
                <li><strong>Execution:</strong> The game will show the submitted and valid route.
                For each connection, it will show a random event. This event will increment/decrement/not affect
                the player's coins, which starts from 20.</li>
                <li><strong>Result:</strong>Here the result is shown on the left. If the route was invalid, the score is
                automatically set to 0; same if the coins went negative. On the right the ranking board
                is shown. Then if the player wants to play another game, he has to click on the "New Game" button,
                if not, he can click the "Home" button to go back to the home.</li>
            </ol>
        </Container>
    )
}

export {RulesDisplay}