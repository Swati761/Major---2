import React, { useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Context } from "../../../Context/context";

const Menubar = () => {

    const context = useContext(Context);
    
    const Logout = () => {
        context.logoutUser();
    }

    const moveToUserLogsPage = () => {
        window.location.href = "/admin-user-logs";
    }

    const moveToRegisterAttackPage = () => {
        window.location.href = "/register-attack";
    }

    const moveToGroupLogsPage = () => {
        window.location.href = "/admin-group-logs";
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/admin-home">Secure Cloud Transactions using Blockchain</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick = {moveToRegisterAttackPage}>Register Attacks</Nav.Link>
                    <Nav.Link onClick = {moveToUserLogsPage}>Show User Logs</Nav.Link>
                    <Nav.Link onClick = {moveToGroupLogsPage}>Show Groups Logs</Nav.Link>
                    <Nav.Link onClick = {Logout}>Logout</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Menubar;