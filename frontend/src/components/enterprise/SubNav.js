import React from 'react';
import { Navbar, Nav, Col, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';




export default function SubNav(props) {
    const { t } = useTranslation();

    return(
        <Navbar expand="lg" className="pl-0 border-bottom border-secondary bg-light">
            
            <Nav>
                <Nav.Link href="/enterprise" className="px-3 text-info">
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
                                dropdown: true,
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
                                item.dropdown ?
                                <NavDropdown title={
                                    <span
                                    className={
                                        item.label === props.active 
                                        ? "text-danger text-center px-3 py-2 border border-danger" 
                                        : "text-center px-3"
                                    }
                                    >{t('chemicals')}</span>
                                } id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/enterprise/chemicals/suppliers">
                                        {t('suppliers')}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/enterprise/chemicals/substances">
                                        {t('substances')}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/enterprise/chemicals/mixtures">
                                        {t('mixtures')}
                                    </NavDropdown.Item>
                                </NavDropdown>
                                : <Nav.Link
                                    key={item.label}
                                    href={item.href}
                                    className={
                                        item.label === props.active 
                                        ? "text-danger text-center px-3 border border-danger" 
                                        : "text-center px-3"
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