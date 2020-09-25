import React from 'react';
import {
    Navbar,
    Nav
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Navigation(props) {

    const handleLogout = () => {
        // deletes localstorage and redirects to login page
        localStorage.clear();
        window.location.replace("/login");
    }

    return (
        <Navbar expand="md" className="px-5" bg="dark" variant="dark">
            <div className="container-lg">
                <Navbar.Brand href="/enterprise">
                    SICHEM
                </Navbar.Brand>
            
                <Nav className="ml-auto">
                    <Nav.Link className="ml-3">
                        <FontAwesomeIcon icon="user" />
                    </Nav.Link>

                    <Nav.Link className="ml-3" href="/enterprise/management">
                        <FontAwesomeIcon icon="building" />
                    </Nav.Link>

                    <Nav.Link className="ml-3">
                        <FontAwesomeIcon icon="lock" />
                    </Nav.Link>

                    <Nav.Link className="ml-3" onClick={() => handleLogout()}>
                        <FontAwesomeIcon icon="sign-out-alt" />
                    </Nav.Link>
                </Nav>
            </div>
        </Navbar>
    )
}