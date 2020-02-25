import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Component from './Component';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Modal, Button, Form, Row, Col, Tabs, Tab, Alert, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext';
import RequestNotification from '../../notifications/RequestNotification';


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
    const APIcontext = useContext(ApiRequestsContext);

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

    useEffect(() => {
        // If props.composition we are trying to edit
        let isVisible = props.composition ? true : false;
        setState({ ...state, visible: isVisible });

        // if existing composition is under editing we set values
        if (props.composition) {
            const compID = parseInt(props.composition);
            const data = entContext.compositions.find(o => o.id === compID);
            mainFormik.setValues(data);

            /*
                the lines above were used to set values to the fields
                corresponding to the Composition model on server side

                **however ! components are a separate model and are used
                as manyToMany relation with compositions

                here we thus must set initial values for composition state
            */
            let conc = JSON.parse(data.concentrations);
            setComposition(conc);
        }
    }, [props.composition])
    

    /*
        this is actual submit function
        sends data from composition to the server
    */
    const headers = {
        headers: {
            Pragma: "no-cache",
            Authorization: 'Bearer ' + localStorage.getItem('token-access')
        }
    };


    const MainScheme = Yup.object().shape({
        reference: Yup.string().required(t('messages.form.required')),
        name: Yup.string().required(t('messages.form.required'))
    });

    const mainFormik = useFormik({
        validationSchema: MainScheme,
        initialValues: {
            reference: "test",
            name: "",
            info: ""
        },
        onSubmit: values => {
            /*
                for post request
                * first save composition
                * then add composition components to the saved composition
            */
            let concentrations = JSON.stringify(composition);

            let constituents = composition.constituents.map(item => item.component);
            let additives = composition.additives.map(item => item.component);
            let impurities = composition.impurities.map(item => item.component);

            let url = `${APIcontext.API}/compositions/`;
            let method = 'post';

            // if we update an existing composition we modify request parameters
            if (props.composition) {
                url = url + props.composition + '/';
                method = 'put';
            }

            axios({
                method: method,
                url: url, 
                data: {
                    enterprise: entContext.ent.id,
                    substance: parseInt(props.substance),
                    ...values,
                    constituents: constituents,
                    additives: additives,
                    impurities: impurities,
                    concentrations: concentrations
                },
                ...headers
            }).then(
                res => console.log(res)
            ).catch(
                () => setState({ ...state, failedMsg: true })
            )
        }
    })

    // Composition details
    const CompositionDiv = (
        <Form onSubmit={mainFormik.handleSubmit}>
            <Form.Group as={Row}>
                <Form.Label column md="4">
                    { t('data.composition.reference') }:
                </Form.Label>
                <Col md="8">
                    <Form.Control
                        required
                        name="reference"
                        value={mainFormik.values.reference}
                        onChange={mainFormik.handleChange}
                        type="text"
                        isInvalid={!!mainFormik.errors.reference}
                    />
                    <Form.Control.Feedback type="invalid">
                        {mainFormik.errors.reference}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column md="4">
                    { t('data.composition.name') }:
                </Form.Label>
                <Col md="8">
                    <Form.Control
                        required
                        name="name"
                        value={mainFormik.values.name}
                        onChange={mainFormik.handleChange}
                        type="text"
                        isInvalid={!!mainFormik.errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {mainFormik.errors.name}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>
                <Form.Label column md="4">
                    { t('data.composition.info') }:
                </Form.Label>
                <Col md="8">
                    <Form.Control
                        name="info"
                        value={mainFormik.values.info}
                        onChange={mainFormik.handleChange}
                        type="text"
                        as="textarea"
                        isInvalid={!!mainFormik.errors.info}
                    />
                    <Form.Control.Feedback type="invalid">
                        {mainFormik.errors.info}
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
        </Form>
    )

    /*
        Header containing list of components saved in SICHEM
        and inputs to enter concentration details

        * the same component is used for all three composition elements
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

    const compFormik = useFormik({
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

    const ComponentDiv = (
        <Form onSubmit={compFormik.handleSubmit}>
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
                                onChange={compFormik.handleChange}
                                value={compFormik.values.component}
                                required
                                isInvalid={!!compFormik.errors.component}
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
                                { compFormik.errors.component }
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
                                value={compFormik.values.typical_conc}
                                onChange={compFormik.handleChange}
                                isInvalid={!!compFormik.errors.typical_conc}
                            />
                            <Form.Control.Feedback type="invalid">
                                { compFormik.errors.typical_conc }
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
                                        onChange={compFormik.handleChange}
                                        value={compFormik.values.lower_conc}
                                        isInvalid={!!compFormik.errors.lower_conc}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { compFormik.errors.lower_conc }
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
                                        onChange={compFormik.handleChange}
                                        value={compFormik.values.upper_conc}
                                        isInvalid={!!compFormik.errors.upper_conc}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        { compFormik.errors.upper_conc }
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Col>
                        
                        <Col className="text-right">
                            <Button 
                                variant="danger" size="sm"
                                onClick={compFormik.handleSubmit}
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
    let componentList = "";
    if (state.activeTab !== "composition") {
        componentList = (
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
    }

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
                        defaultActiveKey="composition"
                        onSelect={ val => setState({ ...state, activeTab: val }) }
                    >
                        <Tab
                            eventKey="composition"
                            title={t('data.composition.general')}
                        > 
                            <div className="mt-4">
                                { CompositionDiv }
                            </div>
                        </Tab>

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
                    <Button variant="secondary" onClick={() => setState({ ...state, visible: false })}>
                        {t('cancel')}
                    </Button>
                    <Button variant="danger" onClick={mainFormik.handleSubmit}>
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Request notifications */}
            <RequestNotification
                show={state.failedMsg}
                onClose={() => setState({ ...state, failedMsg: false })}
            />

        </div>
    )
}
export default Composition;