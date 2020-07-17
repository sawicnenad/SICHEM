import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Form, Row, Col, Alert, Accordion, Card
} from 'react-bootstrap';



/*
    Assess exposure for a workplace's asssment entities
*/
export default function Assessment() {

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
        console.log(e.target.name)
    }

    // to list assessment entities (cas_of_aentity) we need to 
    // check which workplace is selected
    const workplaceID = parseInt(formik.values.workplace);
    const aentity = context
                    .aentities
                    .find(o => o.workplace === workplaceID)
    
    const casOfAEntity = aentity ? aentity['cas_of_aentity'] : [];
    




    return(
        <div>
            <Accordion defaultActiveKey="1">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        {t('workplace')}
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
                                            onChange={formik.handleChange}
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
                                <Row>
                                    <Col {...scaling.tailed}>
                                        <Alert variant="info">
                                            <FontAwesomeIcon icon="info-circle"
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
                        {t('data.aentity.list.cas')}
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <div>{
                                casOfAEntity.map(
                                    (ca, inx) => (
                                        <Card key={ca.id} border="info">
                                            <Card.Header>
                                                {`${t('data.aentity.aentity')} ${inx+1}`}
                                            </Card.Header>
                                            <Card.Body style={{ textAlign: "center" }}>
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
                                                
                                                {/* selected exposure models */}
                                                <div className="mt-3">
                                                    <FontAwesomeIcon icon="calculator" />
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    )
                                )
                            }</div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}