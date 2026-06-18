import { useEffect, useState } from "react";
import { doLogin, doLogout } from "../api/auth";
import { useNavigate } from "react-router";
import { Form, Button, Container } from "react-bootstrap";

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
            setTimeout(() => setError('', 3000));
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
            props.login({id: undefined, name: undefined, surname: undefined, username: undefined, score: undefined});
            navigate('/');
        })
    }, [])
    return "Logging out...";
}

export {LoginForm, Logout}