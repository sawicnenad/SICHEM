import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Component from './Component';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Modal, Button, Form, Row, Col, Tabs, Tab, Alert, Table } from 'react-bootstrap';
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
    const {t} = useTranslation();
    const entContext = useContext(EnterpriseContext);

    const [state, setState] = useState({
        activeTab: "constituents",
        showHelp: true
    });

    /*
        data entries in componentDiv will be stored 
        temporary in composition state

        * when 'Save' button is applied in the modal
        * the data is transmitted to the server
    */
    const [composition, setComposition] = useState({
        constituents: [],
        additives: [],
        impurities: []
    })

    /*
        component name and concentrations
        * typical, lower and upper concentration
        * also: add button to add the component to the list below
        * and create new component button, if no required component
    */
    const Scheme = Yup.object().shape({
        component: Yup.number().min(1, t('messages.form.required')),

        typical_conc: Yup.number()
            .min(0.0001, t('messages.form.too-small'))
            .max(100, t('messages.form.too-high')),

        lower_conc: Yup.number()
            .min(0.0001, t('messages.form.too-small'))
            .max(100, t('messages.form.too-high')),

        upper_conc: Yup.number()
            .min(0.0001, t('messages.form.too-small'))
            .max(100, t('messages.form.too-high'))
            .moreThan(Yup.ref('lower_conc'), t('messages.form.composition.more-than-lower-conc')),
    });

    const myFormik = useFormik({
        validationSchema: Scheme,
        initialValues: {
            component: 0,
            typical_conc: "",
            lower_conc: "",
            upper_conc: ""
        },
        onSubmit: values => {
            let newComposition = {...composition};
            newComposition[state.activeTab].unshift(values);
            setComposition(newComposition);
        }
    })

    /*
        Header containing list of components saved in SICHEM
        and inputs to enter concentration details

        * the same component is used for all three composition elements
    */
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

                <Col xs='7'>
                    <Form.Group as={Row}>
                        <Form.Label column xs={{span: 12}}>
                            { t('data.composition.concentration') }:
                        </Form.Label>

                        <Col xs='3'>
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

                        <Col xs='6'>
                            <Row noGutters>
                                <Col>
                                    <Form.Control
                                        name="lower_conc"
                                        type="number"
                                        placeholder={t('data.composition.lower_conc')}
                                        size="sm"
                                        onChange={myFormik.handleChange}
                                        value={myFormik.values.lower_conc}
                                        isInvalid={!!myFormik.errors.lower_conc}
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
                                        isInvalid={!!myFormik.errors.upper_conc}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { myFormik.errors.upper_conc }
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Col>
                        
                        <Col className="text-right">
                            <Button 
                                variant="danger" size="sm"
                                onClick={myFormik.handleSubmit}
                            >
                                <FontAwesomeIcon icon="plus" />
                            </Button>
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );

    // handles delete of a component from composition
    const handleDelete = id => {
        let newComposition = {...composition};
        let components = newComposition[state.activeTab];
        components = components.filter(o => o.component !== id);
        newComposition[state.activeTab] = components;
        setComposition(newComposition);
    }


    // list of components added to composition | additives | impurities
    const componentList = (
        <div className="border-top pt-3 mt-4" style={{ overflow: "auto", maxHeight: 400 }}>

            <div className="mb-3 font-weight-bold text-secondary" style={{ fontSize: 18 }}>
                { t('data.composition.list-of-components')}:
            </div>

            <Table striped borderless>
                <tbody>{
                composition[state.activeTab].map(
                    (item, inx) => (
                        <tr key={inx}>
                            <td xs='1' className="align-middle">
                                <Button variant="light" size="sm" onClick={() => handleDelete(item.component)}>
                                    <FontAwesomeIcon icon="trash-alt" />
                                </Button>
                            </td>
                            <td className="align-middle">
                                <div className="font-weight-bold">{ 
                                    entContext.components
                                        .find(
                                            o => o.id === parseInt(item.component)
                                        ).reference 
                                }</div>
                            </td>
                            <td className="align-middle">
                                { item.typical_conc ? 
                                    <span>{ item.typical_conc }%</span> 
                                    : <span className="text-muted">{ t('unknown') }</span> }
                            </td>
                            <td className="align-middle">
                                {
                                    item.lower_conc ?
                                    <span>
                                        ({ item.lower_conc } - { item.upper_conc } %)
                                    </span>
                                    : ""
                                }
                            </td>
                        </tr>
                    )
                )
            }</tbody>
            </Table>

            {
                composition[state.activeTab].length === 0 ?
                    <Alert
                        variant="warning"
                    >
                        { t('messages.no-data-for-this-page')}
                    </Alert> : ""
            }
        </div>
    )

    const helpInfo = (
        <div>
            {
                state.showHelp ?
                    <Alert
                        variant="info"
                        dismissible
                        onClose={() => setState({...state, showHelp: false})}
                    >{ t('messages.composition-help') }</Alert>
                : ""
            }
        </div>
    )


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
                    <Tabs 
                        className="tabs-customized"
                        defaultActiveKey="constituents"
                        onSelect={ val => setState({ ...state, activeTab: val }) }
                    >
                        <Tab
                            eventKey="constituents"
                            title={t('data.composition.constituents')}
                        > 
                            <div {...styling.tabContent}>
                                <div>{ helpInfo }</div>
                                <div>{ ComponentDiv }</div>
                                <div>{ componentList }</div>
                            </div>
                        </Tab>
                        <Tab
                            eventKey="additives"
                            title={ t('data.composition.additives') }
                        >
                            <div {...styling.tabContent}>
                                <div>{ helpInfo }</div>
                                <div>{ ComponentDiv }</div>
                                <div>{ componentList }</div>
                            </div>
                        </Tab>
                        <Tab
                            eventKey="impurities"
                            title={t('data.composition.impurities') }
                        >
                            <div {...styling.tabContent}>
                                <div>{ helpInfo }</div>
                                <div>{ ComponentDiv }</div>
                                <div>{ componentList }</div>
                            </div>
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