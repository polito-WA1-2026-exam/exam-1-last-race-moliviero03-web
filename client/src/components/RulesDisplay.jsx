import { Container } from "react-bootstrap";

function RulesDisplay(props){
    return (
        <Container>
            <h2>Rules</h2>
            <ol>
                <li><strong>Setup:</strong></li>
                <li><strong>Plan:</strong></li>
                <li><strong>Execution:</strong></li>
                <li><strong>Result:</strong></li>
            </ol>
        </Container>
    )
}

export {RulesDisplay}