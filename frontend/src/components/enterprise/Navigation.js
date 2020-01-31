import React from 'react';
import {
    Navbar,
    Nav,
    Form,
    FormControl,
    Button
} from 'react-bootstrap';


export default function Navigation() {
    return (
        <Navbar bg="light" expand="lg" className="px-5">
            <Navbar.Brand href="/enterprise">SICHEM</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse>
                <Nav className="mr-auto w-100">
                    <Form inline className="w-100">
                        <FormControl type="text" placeholder="Search" className="w-50 mr-sm-2" />
                    </Form>
                </Nav>

                <Nav className="mr-3">
                    <Nav.Link>Profile</Nav.Link>
                    <Nav.Link>Enterprise</Nav.Link>
                    <Nav.Link>Security</Nav.Link>
                </Nav>
                <Button variant="outline-danger">Logout</Button>
            </Navbar.Collapse>
        </Navbar>
    )
}