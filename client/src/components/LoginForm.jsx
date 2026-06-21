import { useEffect, useState } from "react";
import { doLogin, doLogout } from "../api/auth";
import { useNavigate } from "react-router";
import { Form, Button, Container, Spinner } from "react-bootstrap";

function LoginForm(props){

    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [error, setError] = useState('');

    const doSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try{
            const user = await doLogin(username, pwd);
            props.login(user);
        }
        catch (err){
            setError(err.message);
            setTimeout(() => setError('Wrong credentials'), 3000);
        }
    }

    return (
        <Container>
            <h2>Please login</h2>
            <Form onSubmit={doSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder="Enter username" value={username} onChange={(ev) => setUsername(ev.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={pwd} onChange={(ev) => setPwd(ev.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Log In
                </Button> {error && <div className="text-danger">{error}</div>}
            </Form>
        </Container>
    );
}

function Logout(props){
    const navigate = useNavigate();

    useEffect(() => {
        doLogout().then(() => {
            props.logout();
            setTimeout(() => { navigate('/'); }, 3000);
        }).catch(() => {
            props.logout();
            navigate('/');
        })
    }, []);

    return (
        <Container className="text-center mt-5">
            <h2>Logging out...</h2>
            <Spinner animation="border" variant="primary" className="mt-3" />
            <p className="mt-2">You will go back to the base page</p>
        </Container>
    );
}

export {LoginForm, Logout}