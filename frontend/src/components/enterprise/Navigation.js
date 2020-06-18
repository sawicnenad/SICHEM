import React from 'react';
import {
    Navbar,
    Nav,
    Form,
    FormControl,
    Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Navigation(props) {

    const handleLogout = () => {
        // deletes localstorage and redirects to login page
        localStorage.clear();
        window.location.replace("/login");
    }

    return (
        <Navbar expand="md" className="px-5" bg="light">
            <div className="container-lg">
                <Navbar.Brand href="/enterprise">
                    SICHEM
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

            
                <Nav className="mr-3 ml-auto">
                    <Nav.Link className="ml-3">
                        <FontAwesomeIcon icon="user" />
                    </Nav.Link>

                    <Nav.Link className="ml-3">
                        <FontAwesomeIcon icon="building" />
                    </Nav.Link>

                    <Nav.Link className="ml-3">
                        <FontAwesomeIcon icon="lock" />
                    </Nav.Link>

                    <Nav.Link className="ml-3">
                        <FontAwesomeIcon icon="sign-out-alt" />
                    </Nav.Link>
                </Nav>
            </div>
        </Navbar>
    )
}