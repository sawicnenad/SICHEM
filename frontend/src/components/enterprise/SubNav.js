import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';




export default function SubNav(props) {
    const { t } = useTranslation();

    return(
        <Navbar expand="lg" className="pl-0 border-bottom border-secondary">
            
            <Nav>
                <Nav.Link href="/enterprise">
                    <FontAwesomeIcon icon="home" />
                </Nav.Link>
            </Nav>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav>
                    {
                        [
                            {
                                label: "workplaces",
                                href: "/enterprise/workplaces"
                            }, {
                                label: "workers",
                                href: "/enterprise/workers"
                            }, {
                                label: "chemicals",
                                href: "/enterprise/chemicals/suppliers"
                            }, {
                                label: "uses",
                                href: "/enterprise/uses"
                            }, {
                                label: "aentities",
                                href: "/enterprise/a-entities"
                            }, {
                                label: "assessment",
                                href: "/enterprise/assessment"
                            }, {
                                label: "worker-risk",
                                href: "/enterprise/risk"
                            }
                        ].map(
                            item => (
                                <Nav.Link
                                    key={item.label}
                                    href={item.href}
                                    className={
                                        item.label === props.active 
                                        ? "text-danger font-weight-bold" 
                                        : ""
                                    }
                                >{t(item.label)}
                                </Nav.Link>
                            )
                        )
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}