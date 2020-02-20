import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Component from './Component';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Modal, Button, Form, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// styling
const styling = {
    tab: {
        className: "text-muted"
    },
    tabContent: {
        className: "mt-3"
    }
}


function Composition(props) {
    const [state, setState] = useState({});
    const {t} = useTranslation();
    const entContext = useContext(EnterpriseContext);

    /*
        component name and concentrations
        * typical, lower and upper concentration
        * also: add button to add the component to the list below
        * and create new component button, if no required component
    */
    const Scheme = Yup.object().shape({
        component: Yup.number().min(1, t('messages.form.required')),
        typical_conc: Yup.number(),
        lower_conc: Yup.number(),
        upper_conc: Yup.number()
    });

    const myFormik = useFormik({
        validationSchema: Scheme,
        initialValues: {
            component: 0,
            typical_conc: 0,
            lower_conc: "",
            upper_conc: ""
        },
        onSubmit: values => {
            console.log(values)
        }
    })

    const ComponentDiv = (
        <Form onSubmit={myFormik.handleSubmit}>
            <Row>
                <Col xs={{ span: 5 }}>
                    <Form.Group as={Row}>
                        <Form.Label column xs={{ span: 12 }}>
                            { t('component') }:
                        </Form.Label>
                        <Col>
                            <Form.Control
                                name="component"
                                type="text"
                                as="select"
                                size="sm"
                                onChange={myFormik.handleChange}
                                value={myFormik.values.component}
                                required
                                isInvalid={!!myFormik.errors.component}
                            >
                                <option value={0} disabled></option>
                                {
                                    entContext.components.map(
                                        item => (
                                            <option value={item.id} key={item.id}>
                                                { item.reference }
                                            </option>)
                                    )
                                }
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                { myFormik.errors.component }
                            </Form.Control.Feedback>
                        </Col>

                        <Col xs="3">
                            <Component />
                        </Col>
                    </Form.Group>
                </Col>

                <Col className="pl-5">
                    <Form.Group as={Row}>
                        <Form.Label column xs={{span: 12}}>
                            { t('data.composition.concentration') }:
                        </Form.Label>

                        <Col xs={{ span: 4 }}>
                            <Form.Control
                                name="typical_conc"
                                type="number"
                                placeholder={t('data.composition.typical_conc')}
                                size="sm"
                                value={myFormik.values.typical_conc}
                                onChange={myFormik.handleChange}
                                isInvalid={!!myFormik.errors.typical_conc}
                            />
                            <Form.Control.Feedback type="invalid">
                                { myFormik.errors.typical_conc }
                            </Form.Control.Feedback>
                        </Col>

                        <Col>
                            <Row noGutters>
                                <Col>
                                    <Form.Control
                                        name="lower_conc"
                                        type="number"
                                        placeholder={t('data.composition.lower_conc')}
                                        size="sm"
                                        onChange={myFormik.handleChange}
                                        value={myFormik.values.lower_conc}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { myFormik.errors.lower_conc }
                                    </Form.Control.Feedback>
                                </Col>
                                <Col xs={{ span: 2 }} className="text-center pt-1">
                                    -
                                </Col>
                                <Col>
                                    <Form.Control
                                        name="upper_conc"
                                        type="number"
                                        placeholder={t('data.composition.upper_conc')}
                                        size="sm"
                                        onChange={myFormik.handleChange}
                                        value={myFormik.values.upper_conc}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { myFormik.errors.upper_conc }
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Col>
                        
                    </Form.Group>
                </Col>

                <Col xs={{ span: 1 }}>
                    <div className="h-25"></div>
                    <div className="mt-3">
                        <Button 
                            variant="danger" size="sm" className="w-100"
                            onClick={myFormik.handleSubmit}
                        >
                            <FontAwesomeIcon icon="plus" />
                        </Button>
                    </div>
                </Col>
            </Row>
        </Form>
    );


    return(
        <div>
            <Button 
                variant="secondary"
                size="sm"
                onClick={() => setState({ ...state, visible: true })}
            >
                {t('create-new')}
            </Button>
            <Modal
                show={state.visible}
                onHide={() => setState({ ...state, visible: false })}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('data.composition.title')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Tabs className="tabs-customized" defaultActiveKey="composition">
                        <Tab
                            eventKey="composition"
                            title={t('data.composition.constituents')}
                        >
                            <div {...styling.tabContent}>
                                <div>
                                    { ComponentDiv }
                                </div>
                            </div>
                        </Tab>
                        <Tab
                            eventKey="additives"
                            title={ t('data.composition.additives') }
                        >
                            <div>test</div>
                        </Tab>
                        <Tab
                            eventKey="impurities"
                            title={t('data.composition.impurities') }
                        >
                            <div>test</div>
                        </Tab>
                    </Tabs>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">
                        {t('cancel')}
                    </Button>
                    <Button variant="danger">
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default Composition;