import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, Card } from 'react-bootstrap';


/*
    hazard profile is a component used by both
    substances and mixtures
*/
export default function HazardProfile(props) {
    const { t } = useTranslation();

    return (
        <Accordion>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="physical">
                    3.1 { t('data.substance.physical-hazard') }
                </Accordion.Toggle>

                <Accordion.Collapse eventKey="physical">
                    <Card.Body>
                        Physical
                    </Card.Body>
                </Accordion.Collapse>
            </Card>

            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="health">
                    3.2 { t('data.substance.health-hazard') }
                </Accordion.Toggle>

                <Accordion.Collapse eventKey="health">
                    <Card.Body>
                        Health
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}