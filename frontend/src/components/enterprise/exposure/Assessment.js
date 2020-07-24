import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Form, Row, Col, Alert, Accordion, Card, FormCheck, Button
} from 'react-bootstrap';
import Calculation from './Calculation';



/*
    Assess exposure for a workplace's asssment entities
*/
export default function Assessment() {

    const [state, setState] = useState({ entities: [] });
    const { t } = useTranslation();
    const scaling = {
        label: { md: 2 },
        field: { md: 8 },
        tailed: { md: {span: 8, offset: 2} }
    }
    const context = useContext(EnterpriseContext);


    


    // schema and formik for form below
    const Schema = Yup.object().shape({});
    const formik = useFormik({
        validationSchema: Schema,
        initialValues: {
            workplace: '',
            same_model: true
        },
        onSubmit: values => {
            console.log(values)
        }
    })




    // user may select multiple models
    // however only one key is used in formik
    // selected models will be stored as []
    const handleModelCheck = e => {
        
        // model name and checked value (true|false)
        let model = e.target.name;
        let checked = e.target.checked;

        // entities which will be updated
        let entities = [...state.entities];
        for (let i = 0; i < entities.length; i++) {
            // if checked === true
            if (checked) {
                entities[i]['exposure_models'].push(model);
            } else {
                // exclude model from list
                let updatedList = [];
                let oldList = entities[i]['exposure_models'];

                for (let m = 0; m < oldList.length; m++) {
                    if (oldList[m] !== model) {
                        updatedList.push(oldList[m]);
                    }
                }

                // update entities
                entities['exposure_models'] = updatedList;
            }
        }
        // finally update state
        setState({ ...state, entities: entities });
    }




    // to list assessment entities (cas_of_aentity) we need to 
    // check which workplace is selected
    const updateEntities = workplace => {
        const aentity = context
                    .aentities
                    .find(o => o.workplace === parseInt(workplace));

        let entities = aentity['cas_of_aentity'];

        // parse JSON stringified exposure model list 
        // each ca of aentity
        // in order to show in Card components in listed assessment entities
        for (let i in entities){
            let value = entities[i]['exposure_models'];
            try {
                entities[i]['exposure_models'] = JSON.parse(value);
            } catch(e) { console.log(e) }
        }

        // update state in order to rerender
        setState({ ...state, entities: entities });
    }




    // update model set for a given entity
    const updateModelListForEntity = (id, model) => {
        let entities = [...state.entities];
        let emodels = entities.find(o => o.id === id)['exposure_models'];

        if (emodels.indexOf(model) > -1) {
            // model already added
            let updatedList = [];
            for (let i = 0; i < emodels.length; i++) {
                if (emodels[i] !== model) {
                    updatedList.append(emodels[i]);
                }
            }
            // update state
            entities.find(o => o.id === id)['exposure_models'] = updatedList;
            setState({ ...state, entities: entities });
            return;
        }

        // model to be added
        entities.find(o => o.id === id)['exposure_models'].push(model);
        setState({ ...state, entities: entities });
    }





    
    return(
        <div>
            <Accordion defaultActiveKey="1">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        1. {t('workplace')}
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <Form>
                                {/* workplace */}
                                <Form.Group as={Row}>
                                    <Form.Label column {...scaling.label}>
                                        {t('workplace')}:
                                    </Form.Label>

                                    <Col {...scaling.field}>
                                        <Form.Control
                                            as="select"
                                            name="workplace"
                                            value={formik.values.workplace}
                                            onChange={e => {formik.handleChange(e); updateEntities(e.target.value)}}
                                            required
                                        >
                                            <option value='' disabled />
                                            {context.workplaces.map(
                                                workplace => (
                                                    <option value={workplace.id} key={workplace.id}>
                                                        {workplace.reference}
                                                    </option>
                                                )
                                            )}
                                        </Form.Control>

                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.workplace}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>

                                {/* use the same exposure model(s) for all assessment entities */}
                                <Form.Group as={Row}>
                                    {/* exposure model */}
                                    <Form.Label column {...scaling.label}>
                                        
                                    </Form.Label>

                                    <Col {...scaling.field}>
                                        <Form.Check
                                            name="same_model"
                                            onChange={formik.handleChange}
                                            label={t('exposure.assessment.same-model-all-cas')}
                                            checked={formik.values['same_model']}
                                        />
                                    </Col>
                                </Form.Group>

                                {/* info regarding the model selection */}
                                <Row style={
                                        formik.values['same_model'] ?
                                        {display: "none"} : {} 
                                    }>
                                    <Col {...scaling.tailed}>
                                        <Alert variant="warning">
                                            <FontAwesomeIcon icon="exclamation-triangle"
                                            /> <span>
                                                {t('exposure.assessment.same-model-all-cas-info')}
                                            </span>
                                        </Alert>
                                    </Col>
                                </Row>
                                
                                {/* selection of exposure models for the assessment */}
                                <Form.Group 
                                    as={Row} 
                                    style={
                                        formik.values['same_model'] ?
                                        {} : {display: "none"}
                                    }
                                >
                                    {/* exposure model */}
                                    <Form.Label column {...scaling.label}>
                                        {t('exposure-model')}:
                                    </Form.Label>

                                    <Col {...scaling.field}>
                                        {['art', 'sm', 'tra', 'trexmop'].map(
                                            model => (
                                                <Form.Check
                                                    key={model}
                                                    name={model}
                                                    onChange={handleModelCheck}
                                                    label={t(`exposure-models.${model}`)}
                                                    disabled={!formik.values.workplace}
                                                />
                                            )
                                        )}
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>

                {/* assessment entities of the selected workplace */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                        2. <span>
                            {t('data.aentity.list.cas')}
                        </span> | <span>
                            {t('exposure-models.input-parameters')}
                        </span>
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <div style={
                                formik.values.workplace ?
                                {display: "none"} : {}
                            }>
                                <Alert variant="warning">
                                    {t('exposure.assessment.no-wp-alert')}
                                </Alert>
                            </div>
                            <div style={
                                formik.values.workplace ?
                                {} : {display: "none"}
                            }>{
                                state.entities.map(
                                    (ca, inx) => (
                                        <Card key={ca.id}>
                                            <Card.Header>
                                                {`${t('data.aentity.aentity')} ${inx+1}`}
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col>
                                                        <FontAwesomeIcon icon="cogs"
                                                        /> <span>{
                                                        context.uses
                                                            .find(o => o.id === parseInt(ca.use))
                                                            .reference
                                                        }</span>
                                                    </Col>
                                                    <Col>
                                                        <FontAwesomeIcon icon="cog"
                                                        /> <span>{
                                                        context.uses
                                                            .find(o => o.id === parseInt(ca.use))
                                                            .cas
                                                            .find(o => o.id === parseInt(ca.ca))
                                                            .reference
                                                        }</span>
                                                    </Col>
                                                    <Col>
                                                        <FontAwesomeIcon icon="flask"
                                                        /> <span>{
                                                            ca.substance ?
                                                            context.substances
                                                                .find(o => o.id === parseInt(ca.substance))
                                                                .reference
                                                            : context.mixtures
                                                                .find(o => o.id === parseInt(ca.mixture))
                                                                .reference
                                                        }</span>
                                                    </Col>
                                                </Row>

                                                <div className="mt-3">
                                                    <FontAwesomeIcon icon="calculator" /> <span>
                                                        {t('exposure-models.plural')}:
                                                    </span>
                                                </div>
                                                
                                                {/* selected exposure models */}
                                                <div className="mt-1 border-top pt-2">

                                                    {['art', 'sm', 'tra', 'trexmop'].map(
                                                        emodel => (
                                                            <Row key={emodel} className="mb-1">
                                                                <Col>
                                                                    <FormCheck
                                                                        name={emodel}
                                                                        checked={ca['exposure_models'].indexOf(emodel) > -1}
                                                                        onChange={() => updateModelListForEntity(ca.id, emodel)}
                                                                        label={t(`exposure-models.${emodel}`)}
                                                                        disabled={formik.values['same_model']}
                                                                    />
                                                                </Col>
                                                                
                                                                <Col>
                                                                    <Button variant="outline-secondary" size="sm">
                                                                        {t('exposure-models.input-parameters')}
                                                                    </Button>
                                                                </Col>

                                                                <Col>
                                                                    <FontAwesomeIcon
                                                                        icon="check-square"
                                                                        className="text-success" 
                                                                    /> <span>
                                                                        {t('exposure.assessment.status.complete')}
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    )}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    )
                                )
                            }</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                
                {/* exposure results per assessment entity */}
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="3">
                        3. {t('exposure.exposure')} | {t('exposure.risk')}
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="3">
                        <Card.Body>
                            <Calculation />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}