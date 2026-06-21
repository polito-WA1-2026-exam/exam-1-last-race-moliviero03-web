import { Container, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";

function ErrorView() {
    const location = useLocation();
    const navigate = useNavigate();

    const errorMessage = location.state?.message || "Si è verificato un errore di sistema sconosciuto.";

    return (
        <Container className="text-center mt-5">
            <h1 className="text-danger mb-4">Something went wrong.</h1>
            <p className="fs-4">{errorMessage}</p>
            
            <Button 
                variant="primary" 
                className="mt-4 shadow-none" 
                onClick={() => navigate('/home')}
            >
                Torna alla Home
            </Button>
        </Container>
    );
}

export { ErrorView };