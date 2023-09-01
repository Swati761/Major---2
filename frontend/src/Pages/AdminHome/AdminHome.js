import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Menubar from "../../Components/Menubar/AdminMenubar/AdminMenubar";

const AdminHomePage = () => {
    return (
        <>
        <Menubar/>
        <Container>
            <Row style = {{margin: "50px", marginLeft: "120px"}}>
                <Col style={{alignContent: "center"}}>
                    
                </Col>
            </Row>
        </Container>
        </>
    );
}

export default AdminHomePage;