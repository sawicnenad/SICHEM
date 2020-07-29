import React, { useContext, useState, useEffect } from 'react';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { useTranslation } from 'react-i18next';
import {
    Accordion, Card, Form, Row, Col, Button, Alert
} from 'react-bootstrap';
import AEntityTitle from './aentity/AEntityTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/*
    Assess exposure for a workplace's asssment entities
*/
export default function Assessment() {

    const {t} = useTranslation();
    const context = useContext(EnterpriseContext);
    const [state, setState] = useState({});




    // on effect is executed whenever workplace changes
    // this calls a function on the backend that 
    // * verifies whether input parameters are complete
    // * in this case it calculates the exposure applying the selected exposure models
    // * return exposure results that are later formated
    useEffect(() => {
        
    })







    // Components in return ------------------------------------------------

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
                <div className="mt-5 h6 text-danger">
                    {t('data.aentity.plural')}
                </div>
                {wpEntity['cas_of_aentity'].map(
                    (entity, inx) => (
                        <Card key={entity.id}>
                            <Card.Header>
                                <AEntityTitle entity={entity} />
                            </Card.Header>
                            <Card.Body>
                                {['art', 'sm', 'tra', 'trexmop'].map(
                                    model => (
                                        entity[model] ?
                                        <Row key={model} className="my-1">
                                            <Col>
                                                 <FontAwesomeIcon 
                                                    icon="check-square"
                                                    className="text-success" 
                                                 /> {t(`exposure-models.${model}`)}
                                            </Col>

                                            <Col className="text-center">
                                                <Button variant="outline-danger" size="sm">
                                                    {t('exposure-models.input-parameters')}
                                                </Button>
                                            </Col>

                                            <Col className="text-right">
                                                <FontAwesomeIcon 
                                                    icon="check-square"
                                                    className="text-success" 
                                                 /> {t('exposure.assessment.status.complete')}
                                            </Col>
                                        </Row>
                                        : <div key={model} className="text-muted my-1">
                                                <FontAwesomeIcon icon="times" 
                                                /> {t(`exposure-models.${model}`)}
                                        </div>
                                    )
                                )}
                            </Card.Body>
                        </Card>
                    )
                )}
            </div>
        )
    }

    





    // ................................................................................
    return(
        <div className="p-5 bg-light h-100 wrapper">
            {
                state.workplace ?
                "":
                <Alert
                    variant="info"
                >
                    <FontAwesomeIcon icon="info-circle"
                    /> <span>{t('exposure.assessment.alert.select-workplace')}</span>
                </Alert>
            }
            { Workplace }
            { Entities }
        </div>
    )
}