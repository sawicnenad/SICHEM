import React, { useContext, useState } from 'react';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { useTranslation } from 'react-i18next';
import {
    Accordion, Card, Form, Row, Col
} from 'react-bootstrap';

/*
    Assess exposure for a workplace's asssment entities
*/
export default function Assessment() {

    const {t} = useTranslation();
    const context = useContext(EnterpriseContext);
    const [state, setState] = useState({});










    // Components in return

    // fiel scaling
    const scaling = {
        label: { md: 2 },
        field: { md: 8 }
    }

    // Workplace select field
    const Workplace = (
        <Form.Group as={Row}>
            <Form.Label column {...scaling.label}>
                {t('workplace')}:
            </Form.Label>
            <Col {...scaling.field}>
                <Form.Control
                    as="select"
                    onChange={
                        e => setState({ 
                            ...state,
                            workplace: parseInt(e.target.value) 
                    })}
                >
                    <option></option>
                    {context.workplaces.map(
                        wp => (
                            <option key={wp.id} value={wp.id}>
                                {wp.reference}
                            </option>
                        )
                    )}
                </Form.Control>
            </Col>
        </Form.Group>)


    // Each time workplace is changed, assessment entities are updated
    // this also includes verification if the list of input parameters is complete
    // if complete or not corresponding status is displayed
    // end-user may then update the list of input parameters
    let Entities = <div />;
    
    if (state.workplace) {
        let wpEntity = context.aentities.find(o => o.workplace === state.workplace);
        Entities = (
            <div>
                {wpEntity['cas_of_aentity'].map(
                    entity => (
                        <div key={entity.id}>
                            { entity.ca }
                        </div>
                    )
                )}
            </div>
        )
    }

    


    return(
        <div className="mt-3">
             <Accordion>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        1. {t('workplace')} & {t('data.aentity.plural')}
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            { Workplace }
                            { Entities }
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
             </Accordion>
        </div>
    )
}