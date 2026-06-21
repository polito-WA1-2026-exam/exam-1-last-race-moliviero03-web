import { useContext } from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link, Links, useNavigate } from "react-router";

import UserContext from "../contexts/UserContext";

function Header(props){
    const user = useContext(UserContext);

    const dest = user.username ? '/home' : '/';

    return (
        <Navbar style={{ backgroundColor: '#f35f10' }} data-bs-theme="dark">
            <Container fluid>
                <h1 style={{color: 'black'}}><Link to={dest}>Race The Rails</Link></h1>
                <div>{user.username ? <UserInfo username={user.username}/> : <LoginButton/>}</div>
            </Container>
        </Navbar>
    )
}

function LoginButton(props){
    const navigate = useNavigate();
    return <Button onClick={() => navigate('/login')}>Log In</Button>
}

function UserInfo(props){
    return (
        <div>
            <div>{props.username}</div>
            <div><Link to='/logout'>Logout</Link></div>
        </div>
    )
}

export {Header}