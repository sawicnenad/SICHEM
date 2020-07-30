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


    // Actions - buttons or functions that are applied by the end user 
    // to execute exposure evaluation
    // also includes alerts - information to the end-user on how to proceed

    let Information = (
        <div className="my-2">
            <Alert
                variant="info"
            >
                <FontAwesomeIcon icon="info-circle"
                /> <span>{t('exposure.assessment.alert.select-workplace')}</span>
            </Alert>
        </div>);

    if (state.workplace) {
        let wpEntity = context.aentities.find(o => o.workplace === state.workplace);
        let entities = wpEntity['cas_of_aentity'];
        let exposure = [];
        let message = false; // later if any other value assigned message appears

        // we concatenate all exposure instances of entities
        // later is any has state of incomplete or another we
        // display a corresponding message to the end-user
        for (let i in entities) {
            exposure.concat(entities.exposure)
        }

        // so if lenght is zero, it means that no previous
        // exposure assessments conducted
        if (!exposure.length) { 
            message = "untested-all" 
        } else if (exposure.find(o => o.status === "untested")) {
            message = "untested-some" 
        }

        if (message) {
            Information = (
                <div className="my-2">
                    <Alert
                        variant="warning"
                    >{t(`exposure.assessment.alert.${message}`)}</Alert>
                </div>
            )
        }        
    }

    const Actions = (
        <div className="mt-4 mb-2">
            <div className="text-right">
                <Button 
                    variant="danger"
                >
                    <FontAwesomeIcon
                        icon="calculator"
                    /> <span>
                        {t('exposure.assessment.calculate-exposure')}
                    </span>
                </Button>
            </div>
        </div>
    )


    // Each time workplace is changed, assessment entities are updated
    // this also includes verification if the list of input parameters is complete
    // if complete or not corresponding status is displayed
    // end-user may then update the list of input parameters
    let Entities = <div />;

    // function that returns correct status of exposure assessment
    // entity may include up to four different exposure instances
    // for art, stoffenmanager, tra and trexmo+ (labelled as trexmop)
    const getStatus = (expList, model) => {
        let exposure = expList.find(o => o['exposure_model'] === model);
        // have not been tested yet
        if (!exposure) {
            return(
                <div>
                    <FontAwesomeIcon 
                        icon="times"
                        className="text-danger" 
                    /> { t('exposure.assessment.status.untested') }
                </div>
            )
        }

        // complete
        if (exposure.status === 'complete') {
            return(<div>
                <FontAwesomeIcon 
                    icon="check-square"
                    className="text-success" 
                /> { t('exposure.assessment.status.untested') }
            </div>)
        }

        // otherwise
        return(<div>
            <FontAwesomeIcon 
                icon="exclamation-triangle"
                className="text-warning" 
            /> { t(`exposure.assessment.status.${exposure.status}`) }
        </div>)
    }
    
    if (state.workplace) {
        let wpEntity = context.aentities.find(o => o.workplace === state.workplace);
        Entities = (
            <div>
                <div>
                    { Actions }
                </div>
                {wpEntity['cas_of_aentity'].map(
                    (entity, inx) => (
                        <Card key={inx}>
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
                                                {getStatus(entity.exposure, model)}
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
            { Workplace }
            { Information }
            { Entities }
        </div>
    )
}