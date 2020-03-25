import React, { useContext, useState } from 'react';
import data from '../../../json/data-forms/substance.json';
import supplierJSON from '../../../json/data-forms/supplier.json';
import DataForm from './DataForm.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext';
import RequestNotification from '../../notifications/RequestNotification';
import { Form, Row, Col, Button, Modal, Alert } from 'react-bootstrap';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext.js';
import Composition from './Composition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HazardProfile from './HazardProfile.js';






// create new substance
// edit existing substance
export default function Substance(props) {

    const [state, setState] = useState({
        deleteMsg: false,
        failedMsg: false,
        newSubMsg: false,
        updatedMsg: false,
        supplierModal: false,
        newSuppMsg: false,
        regStatusCH: false,
        regStatusEU: false
    });
    
    const { t } = useTranslation();

    /*
        contexts:
            - API - to get API URL for requests
            - entContext - contains enterprise data
    */
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);
    const subID = props.match.params.id ;

    const headers = {
        headers: {
            Pragma: "no-cache",
            Authorization: 'Bearer ' + localStorage.getItem('token-access')
        }
    }

    /*
        Handle delete of substance
        * button in DataForm.js
    */
    const handleDelete = () => {
        axios.delete(
            `${APIcontext.API}/substances/${subID}/`,
            headers
        ).then(
            () => {
                /*
                    first remove substance from enterprise context data
                    then show notification and redirect to url showing all substances
                */
                props.history.push('/enterprise/chemicals/substances');
                let substances = [...entContext.substances];
                substances = substances.filter(o => o.id !== parseInt(subID)); 
                entContext.refreshState('substances', substances);
            }
        ).catch(
            () => setState({ ...state, failedMsg: true })
        )
    }


    /*
        BUTTON CLICKS | FIELD CHANGES
    */
    const handleFieldButtonClicks = (clickType, fieldName) => {
        let value = JSON.parse( myformik.values[fieldName] );

        switch(clickType) {
            case 'multi':
                value.push('');
                break;
            case 'range':
                value.push('');
                break;
            case 'exact':
                value.pop();
        }

        value = JSON.stringify( value );
        myformik.setFieldValue(fieldName, value, false);
    }




    /*
        For multi and range fields we need special way
        to handle changes and record them in formik-
    */
    const handleChangeSpecial = (name, value, inx) => {

        // multi fields
        if (inx !== undefined) {
            let currentValue = JSON.parse(myformik.values[name]);
            currentValue[inx] = value;
            let newValue = JSON.stringify(currentValue);
            myformik.setFieldValue(name, newValue, false);
            return;
        }

        // files
        myformik.setFieldValue(name, value);
    }





    /*
        Form configuration YUP and FORMIK
    */

    // Yup is used to define constraints for the fields
    const Schema = Yup.object().shape({
        reference: Yup.string()
            .min(2, t('messages.form.too-short'))
            .max(255, t('messages.form.too-long'))
            .required(t('messages.form.required')),
        supplier: Yup.string()
            .required(t('messages.form.required'))
    });




    /*
        formik (see below) requires initial values 
        for each field...
        
        for some fields that are very special such as
        those where we add fields dynamically, we need
        json format
    */
    let substance = "";
    if (subID !== '0') {
        let id = parseInt(props.match.params.id);
        substance = entContext.substances.find(o => o.id === id);
    }

    let initialValues = {};
    for (let field in data.fields) {

        if (data.fields[field].fieldType === 'file') {
            if (substance[field]) {
                initialValues[field] = substance[field];
            } else {
                continue;
            }
        }

        // multi add fields
        if ( 
            ['multi', 'exact-or-range']
                .indexOf(data.fields[field].fieldType) !== -1
            ) {
            initialValues[field] = '[""]';

            if ( substance[field] ) {
                initialValues[field] = substance[field];
            }
            continue;
        }

        // checkbox list
        if (data.fields[field].fieldType === 'checkbox-list') {
            let elements = data.fields[field].elements;
            for (let e in elements) {
                initialValues[ elements[e].name ] = substance[ elements[e].name ];
            }
            continue;
        }

        // after select list (e.g. DNEL values)
        if (data.fields[field].fieldType === 'after-select-list') {
            let elements = data.fields[field].elements;
            for (let e in elements) {
                initialValues[ elements[e].name ] = substance[ elements[e].name ];
                initialValues[ elements[e].afterName ] = substance[ elements[e].afterName ];
            }
            continue;
        }

        if (data.fields[field].fieldType === 'custom') {
            if (field === 'hazard') {
                initialValues.physical_hazard = substance.physical_hazard === "" ? 
                                                    [] : JSON.parse(substance.physical_hazard);
                initialValues.health_hazard = substance.health_hazard === "" ? 
                                                    [] : JSON.parse(substance.health_hazard);
                initialValues.environmental_hazard = substance.environmental_hazard === "" ? 
                                                    [] : JSON.parse(substance.environmental_hazard);
                initialValues.additional_hazard = substance.additional_hazard === "" ? 
                                                    [] : JSON.parse(substance.additional_hazard);
            }
            // because supplier is also custom field
            if ([   'supplier',
                    'enterprise',
                    'reg_status_ch',
                    'reg_status_eu'
                ].indexOf(field) !== -1) {
                    initialValues[field] = substance[field]
            }
            continue;
        }

        // REMAINING FIELDS

        initialValues[field] = "";

        // load data for an existing substance
        if (props.match.params.id !== '0') {
            initialValues[field] = substance[field];
        }
    }

    // instead of using Formik component
    // we use formik hook
    // this allows us to access values
    // outside return method
    const validURL = str => {
        let pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return !!pattern.test(str);
      }

    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {
            ...initialValues
        },
        validateOnChange: false,
        onSubmit: values => {
            // form data
            let dataForm = new FormData();
            for (let val in values) {

                // for hazards, must be stringified before appended
                if ([
                        'physical_hazard',
                        'health_hazard',
                        'environmental_hazard',
                        'additional_hazard'
                    ].indexOf(val) !== -1) {
                        dataForm.append(val, JSON.stringify(values[val]));
                        continue;
                    }
                
                // for files | images
                if (validURL( values[val] ) && data.fields[val].fieldType === 'file') {
                    continue;
                }

                dataForm.append(val, values[val]);
            }
            dataForm.append('enterprise', entContext.ent.id);

            axios.put(
                `${APIcontext.API}/substances/${props.match.params.id}/`,
                dataForm,
                {headers: {
                    "Content-Type": "multipart/form-data",
                    Pragma: "no-cache",
                    Authorization: 'Bearer ' + localStorage.getItem('token-access')
                }}
            ).then(() => setState({ ...state, updatedMsg: true })
            ).catch(() => setState({ ...state, failedMsg: true }))
        }
    })

    // SCALING
    const scaling = {
        label: {
            md: { span: 3 },
            lg: { span: 2, offset: 1 }
        }, 
        field: { md: 7 },
        fieldSm: { md: 4 }
    }



    /* 
        CUSTOM FIELDS
        those not in json
    */

    /*
        * Suppliers
    */
    const suppSchema = Yup.object().shape({
        origin: Yup.string()
            .required(t('messages.form.required')),
        name: Yup.string()
            .required(t('messages.form.required')),
        address: Yup.string()
            .required(t('messages.form.required'))
    });

    const suppFormik = useFormik({
        validationSchema: suppSchema,
        onSubmit: values => {
            axios.post(
                APIcontext.API + '/suppliers/',
                {...values, enterprise: entContext.ent.id},
                headers
            ).then(
                res => {
                    setState({
                        ...state,
                        newSuppMsg: true,
                        supplierModal: false
                    });
                    let suppliers = [...entContext.suppliers];
                    suppliers.push(res.data);
                    entContext.refreshState('suppliers', suppliers);
                    myformik.setFieldValue("supplier", res.data.id);
                }
            ).catch(
                () => setState({...state, failedMsg: true})
            )
        },
        initialValues: {
            origin: "",
            name: "",
            address: "",
            info: ""
        }
    })

    const Supplier = (
        <div>
            <Form.Group as={Row}>

                <Form.Label column {...scaling.label}>
                    { t(data.fields.supplier.label) }
                </Form.Label>

                <Col {...scaling.field}>
                    <Form.Control
                        as="select"
                        name="supplier"
                        value={myformik.values.supplier}
                        isInvalid={!!myformik.errors.supplier}
                        onChange={myformik.handleChange}
                    >
                        <option value='' disabled></option>
                        {
                            entContext.suppliers.map(
                                item => (
                                    <option value={item.id} key={item.id}>
                                        {item.name} ({item.address}) 
                                    </option>
                                )
                            )
                        }
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        { myformik.errors.supplier }
                    </Form.Control.Feedback>
                </Col>

                <Col>
                    <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => setState({...state, supplierModal: true})}
                    >{ t('create-new') }
                    </Button>
                </Col>
            </Form.Group>
            <Modal
                show={state.supplierModal}
                onHide={() => setState({...state, supplierModal: false})}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('data.substance.supplier-header')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DataForm
                        noZebraStyle={true}
                        data={supplierJSON}
                        scaling={{ label: { xs: 12 }, field: { xs: 12 } }}
                        formik={suppFormik}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setState({...state, supplierModal: false})}
                    >{t('cancel')}
                    </Button>
                    <Button variant="danger" onClick={suppFormik.handleSubmit}>
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );


    /*
        * Compositions are children of Substance
    */
    const handleCompositionDelete = id => {
        axios.delete(
            `${APIcontext.API}/compositions/${id}/`,
            headers
        ).then(
            () => {
                setState({ ...state, deleteMsg: true });
                let compositions = [ ...entContext.compositions ];
                compositions = compositions.filter(o => o.id !== id);
                entContext.refreshState('compositions', compositions);
            }
        ).catch(
            () => setState({ ...state, failedMsg: true })
        )
    }

    const compList = entContext.compositions.filter(o => o.substance === parseInt(subID));
    const CompositionField = (
        <div>
            <Row className="pb-2">
                <Col {...scaling.label}>
                    {t('compositions')}:
                </Col>
                <Col {...scaling.field}>
                    <div>
                        <Composition 
                            substance={subID}
                            composition={state.composition}
                        />
                    </div>
                    {
                        compList.length > 0 ?
                            <div>
                                <div className="mt-3 text-muted font-weight-bold">
                                    {t('data.substance.composition-list')}:
                                </div>

                                {compList.map(
                                    item => (
                                        <div key={item.id} className="mt-2">
                                            <Button 
                                                onClick={ () => handleCompositionDelete(item.id) }
                                                size="sm" variant="outline-dark" className="border-0"
                                            >
                                                <FontAwesomeIcon icon="trash-alt" />
                                            </Button>
                                            <Button 
                                                size="sm" variant="outline-danger" className="ml-2"
                                                onClick={() => setState({ ...state, composition: item.id })}
                                            >
                                                { t('open') }
                                            </Button>
                                            <span className="text-muted ml-3 align-middle">
                                                { item.reference }
                                            </span>
                                        </div>
                                    )
                                )
                            }</div>
                            : <div className="pt-3">
                                <Alert variant="warning">
                                    {t('data.substance.no-compositions-msg')}
                                </Alert>
                            </div>
                    }
                </Col>
            </Row>
            
        </div>
    )

    /*
        Hazard Profile component
    */
    const hazardProfile = (
        <div>
            <HazardProfile
                scaling={scaling}
                formik={myformik}
            />
        </div>
    )



    /*
        Regulatory status CH and EU
        only two corresponding model fields in django

        we open for each a modal in order to configure
        the regulatory statuses for both CH and EU
    */
    const reg1Schema = Yup.object().shape({
        sub_type: Yup.string().required( t('messages.form.required') ),
        status: Yup.string().required( t('messages.form.required') )
    })
    
    // regCHformik uses values from myformik
    // so we have parse it
    let reg_status_ch = {
        sub_type: "",
        is_notified: false,
        status: "",
        other_processes_dscr: ""
    };

    if (myformik.values.reg_status_ch) {
        reg_status_ch = JSON.parse(myformik.values.reg_status_ch);
    }

    const regCHformik = useFormik({
        validationSchema: reg1Schema,
        initialValues: reg_status_ch,
        onSubmit: values => {
            myformik.setFieldValue('reg_status_ch', JSON.stringify(values));
            setState({ ...state, regStatusCH: false })
        }
    })

    const regStatusCH = (
        <div className="pb-2">
            <Row>
                <Col {...scaling.label}>
                    { t('data.substance.reg-status-ch.label') }:
                </Col>

                <Col {...scaling.field}>
                    <Button 
                        onClick={() => setState({ ...state, regStatusCH: true })}
                        variant="outline-danger" size="sm"
                    > { t('edit') }
                    </Button>

                    <Alert
                        hidden={myformik.values.reg_status_ch !== ""}
                        className="my-2"
                        variant="warning"
                    >       { t('messages.not-configured') }
                    </Alert>

                    <div 
                        hidden={myformik.values.reg_status_ch === ""}
                        className="mt-2 font-weight-bold"
                    >
                        {
                            reg_status_ch.sub_type === "new-substance"
                            ?
                            <div>
                                <FontAwesomeIcon icon="check-square" color="#5cb85c" />
                                <span className="ml-2">
                                    { t('data.substance.reg-status-ch.new-substance') }
                                </span>
                            </div>
                            : <div>
                                { t('data.substance.reg-status-ch.existing-substance') }
                            </div>
                        }

                        {
                            reg_status_ch.sub_type === "new-substance" &&
                            reg_status_ch.is_notified ?
                                <div>
                                    <FontAwesomeIcon icon="check-square" color="#5cb85c" />
                                    <span className="ml-2">
                                        { t('data.substance.reg-status-ch.is-notified') }
                                    </span>
                                </div>
                                : <div />
                        }

                        {
                            reg_status_ch.sub_type === "new-substance" &&
                            !reg_status_ch.is_notified ?
                                <div>
                                    <FontAwesomeIcon icon="window-close" color="#d9534f" />
                                    <span className="ml-2">
                                        { t('data.substance.reg-status-ch.is-notified') }
                                    </span>
                                </div>
                                : <div />
                        }

                        {
                            reg_status_ch.status !== 'other-processes' ?
                            <div>
                                {t(`data.substance.reg-status-ch.${reg_status_ch.status}`)}
                            </div>
                            : <div className="font-weight-normal mt-3">
                                { reg_status_ch.other_processes_dscr }
                            </div>
                        }
                    </div>
                </Col>
            </Row>

            <Modal
                show={state.regStatusCH}
                onHide={() => setState({ ...state, regStatusCH: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        { t('data.substance.reg-status-ch.label') }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                { t('data.substance.reg-status-ch.type-of-substance') }
                            </Form.Label>

                            <Form.Control
                                required
                                as="select"
                                name="sub_type"
                                value={regCHformik.values.sub_type}
                                onChange={regCHformik.handleChange}
                                isInvalid={regCHformik.errors.sub_type}
                            >
                                <option value="" disabled selected></option>
                                <option value="existing-substance">
                                    {t('data.substance.reg-status-ch.existing-substance')}
                                </option>
                                <option value="new-substance">
                                    {t('data.substance.reg-status-ch.new-substance')}
                                </option>
                            </Form.Control>

                            <Form.Control.Feedback type="invalid">
                                {regCHformik.errors.sub_type}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group hidden={regCHformik.values.sub_type !== "new-substance"}>
                            <Form.Check
                                name="is_notified"
                                label={ t('data.substance.reg-status-ch.is-substance-notified') }
                                checked={regCHformik.values.is_notified}
                                onChange={regCHformik.handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                { t('data.substance.reg-status-ch.status') }
                            </Form.Label>

                            <Form.Control
                                required
                                name="status"
                                as="select"
                                value={regCHformik.values.status}
                                onChange={regCHformik.handleChange}
                                isInvalid={!!regCHformik.errors.status}
                            >
                                <option value="" disabled selected></option>
                                <optgroup label={t('data.substance.reg-status-ch.authorization')}>
                                    <option value="auth-1">
                                        { t('data.substance.reg-status-ch.auth-1') }
                                    </option>
                                    <option value="auth-2">
                                        { t('data.substance.reg-status-ch.auth-2') }
                                    </option>
                                </optgroup>

                                <optgroup label={t('data.substance.reg-status-ch.restriction')}>
                                    <option value="auth-svhc-annex-3">
                                        { t('data.substance.reg-status-ch.restriction-1') }
                                    </option>
                                </optgroup>

                                <optgroup label={t('data.substance.reg-status-ch.harmonized-classification')}>
                                    <option value="auth-svhc-annex-3">
                                        { t('data.substance.reg-status-ch.harmonized-classification-1') }
                                    </option>
                                </optgroup>

                                <optgroup label={t('data.substance.reg-status-ch.protection-young-people')}>
                                    <option value="auth-svhc-annex-3">
                                        { t('data.substance.reg-status-ch.protection-young-people-1') }
                                    </option>
                                </optgroup>

                                <optgroup label={t('data.substance.reg-status-ch.maternety-protection')}>
                                    <option value="auth-svhc-annex-3">
                                        { t('data.substance.reg-status-ch.maternety-protection-1') }
                                    </option>
                                </optgroup>

                                <option value="other-processes">
                                    { t('data.substance.reg-status-ch.other-processes') }
                                </option>
                            </Form.Control>

                            <Form.Control.Feedback type="invalid">
                                {regCHformik.errors.status}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group hidden={regCHformik.values.status !== 'other-processes'}>
                            <Form.Label>
                                { t('data.substance.reg-status-ch.other-processes-dscr') }
                            </Form.Label>
                            <Form.Control 
                                name="other_processes_dscr"
                                as="textarea"
                                type="text"
                                value={regCHformik.values.other_processes_dscr}
                                onChange={regCHformik.handleChange}
                            />
                        </Form.Group>

                        
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={() => setState({...state, regStatusCH: false})}
                    >{t('close')}</Button>
                    <Button
                        variant="danger"
                        onClick={regCHformik.handleSubmit}
                    >
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )


    // EU regulatory status
    const reg2Schema = Yup.object().shape({})

    let reg_status_eu = {
        is_registered: false,
        full_registered: null,
        status: "",
        other_processes_dscr: "",
        clp: "",
        clp_other_processes_dscr: "",
        other_directive: "",
        other_directive_dscr: ""
    }

    if (myformik.values.reg_status_eu) {
        reg_status_eu = JSON.parse(myformik.values.reg_status_eu);
    }

    const regEUformik = useFormik({
        validationSchema: reg2Schema,
        initialValues: reg_status_eu,
        onSubmit: values => {
            myformik.setFieldValue('reg_status_eu', JSON.stringify(values));
            setState({ ...state, regStatusEU: false })
        }
    })

    const regStatusEU = (
        <div>
           <Row>
                <Col {...scaling.label}>
                    { t('data.substance.reg-status-eu.label') }:
                </Col>

                <Col {...scaling.field}>
                    <Button 
                        onClick={() => setState({ ...state, regStatusEU: true })}
                        variant="outline-danger" size="sm"
                    > { t('edit') }
                    </Button>

                    <Alert
                        hidden={myformik.values.reg_status_eu !== ""}
                        className="my-2"
                        variant="warning"
                    >       { t('messages.not-configured') }
                    </Alert>

                    <div 
                        hidden={myformik.values.reg_status_eu === ""} 
                        className="font-weight-bold"
                    >
                        <div className="mb-2 mt-4 text-muted">
                            { t('data.substance.reg-status-eu.reach') }:
                        </div>
                        {
                            reg_status_eu.is_registered
                            ?
                            <div>
                                <FontAwesomeIcon icon="check-square" color="#5cb85c" />
                                <span className="ml-2">
                                    { t('data.substance.reg-status-eu.is-registered') }
                                </span>
                            </div>
                            : <div />
                        }


                        {
                            reg_status_eu.full_registered
                            ?
                            t('data.substance.reg-status-eu.full-registered')
                            : t('data.substance.reg-status-eu.intermediate-registered')
                        }

                        <div>
                            {t(`data.substance.reg-status-eu.${reg_status_eu.status}`)}
                        </div>

                        <div>
                            <i>
                                { reg_status_eu.other_processes_dscr }
                            </i>
                        </div>

                        <div className="mb-2 mt-4 text-muted">
                            { t('data.substance.reg-status-eu.clp-title') }:
                        </div>

                        {
                            reg_status_eu.clp === 'clp-1' ?
                            <div>
                                { t('data.substance.reg-status-eu.clp-1') }
                            </div>
                            : <div>
                                { reg_status_eu.clp_other_processes_dscr }
                            </div>
                        }

                        <div className="mb-2 mt-4 text-muted">
                            { t('data.substance.reg-status-eu.other-processes-title') }:
                        </div>

                        {
                            reg_status_eu.other_directive !== 'other' ?
                            <div>
                                { t(`data.substance.reg-status-eu.${reg_status_eu.other_directive}`) }
                            </div>
                            : <div>
                                { reg_status_eu.other_directive_dscr }
                            </div>
                        }
                    </div>
                </Col>
            </Row>

            <Modal
                show={state.regStatusEU}
                onHide={ () => setState({...state, regStatusEU: false}) }
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        { t('data.substance.reg-status-eu.label') }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>

                        <div className="my-2">
                            <strong>{ t('data.substance.reg-status-eu.reach') }</strong>
                        </div>

                        <Form.Group>
                            <Form.Check
                                label={ t('data.substance.reg-status-eu.is-registered') }
                                name="is_registered"
                                checked={regEUformik.values.is_registered}
                                onChange={regEUformik.handleChange}
                            />
                        </Form.Group>

                        <Form.Group hidden={regEUformik.values.is_registered === false}>
                            <Form.Check
                                label={ t('data.substance.reg-status-eu.full-registered') }
                                type="radio"
                                name="full_registered"
                                checked={regEUformik.values.full_registered}
                                onChange={() => regEUformik.setFieldValue('full_registered', true)}
                            />
                            <Form.Check
                                label={ t('data.substance.reg-status-eu.intermediate-registered') }
                                type="radio"
                                name="full_registered"
                                checked={regEUformik.values.full_registered === false}
                                onChange={() => regEUformik.setFieldValue('full_registered', false)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                { t('data.substance.reg-status-eu.status') }:
                            </Form.Label>

                            <Form.Control
                                name="status"
                                as="select"
                                value={regEUformik.values.status}
                                onChange={regEUformik.handleChange}
                            >
                                <optgroup label={ t('data.substance.reg-status-eu.evaluation') }>
                                    <option value="eval-1">
                                        {t('data.substance.reg-status-eu.eval-1')}
                                    </option>
                                    <option value="eval-2">
                                        {t('data.substance.reg-status-eu.eval-2')}
                                    </option>
                                </optgroup>

                                <optgroup label={ t('data.substance.reg-status-eu.auth') }>
                                    <option value="auth-1">
                                        {t('data.substance.reg-status-eu.auth-1')}
                                    </option>
                                    <option value="auth-2">
                                        {t('data.substance.reg-status-eu.auth-2')}
                                    </option>
                                </optgroup>

                                <optgroup label={ t('data.substance.reg-status-eu.restriction') }>
                                    <option value="restriction">
                                        {t('data.substance.reg-status-eu.restriction-1')}
                                    </option>
                                </optgroup>

                                <option value="other">
                                    {t('data.substance.reg-status-eu.other-processes')}
                                </option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group hidden={regEUformik.values.status !== 'other'}>
                            <Form.Label>
                                { t('data.substance.reg-status-eu.other-processes-dscr') }:
                            </Form.Label>
                            <Form.Control
                                name="other_processes_dscr"
                                type="text"
                                as="textarea"
                                value={regEUformik.values.other_processes_dscr}
                                onChange={regEUformik.handleChange}
                            />
                        </Form.Group>

                        <div className="my-2">
                            <strong>{t('data.substance.reg-status-eu.clp-title')}</strong>
                        </div>

                        <Form.Group>
                            <Form.Label>
                                { t('data.substance.reg-status-eu.clp-title') }
                            </Form.Label>

                            <Form.Control
                                as="select"
                                name="clp"
                                value={regEUformik.values.clp}
                                onChange={regEUformik.handleChange}
                            >
                                <option value="clp-1">
                                    { t('data.substance.reg-status-eu.clp-1') }
                                </option>
                                <option value="other">
                                    { t('data.substance.reg-status-eu.other-processes-clp') }
                                </option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group hidden={regEUformik.values.clp !== 'other'}>
                            <Form.Label>
                                { t('data.substance.reg-status-ch.other-processes-dscr') }
                            </Form.Label>
                            <Form.Control 
                                name="clp_other_processes_dscr"
                                as="textarea"
                                type="text"
                                value={regEUformik.values.clp_other_processes_dscr}
                                onChange={regEUformik.handleChange}
                            />
                        </Form.Group>

                        <div className="my-2">
                            <strong>{t('data.substance.reg-status-eu.other-processes-title')}</strong>
                        </div>

                        <Form.Group>
                            <Form.Label>
                                { t('data.substance.reg-status-eu.other-directive') }:
                            </Form.Label>

                            <Form.Control
                                name="other_directive"
                                as="select"
                                value={regEUformik.values.other_directive}
                                onChange={regEUformik.handleChange}
                            >   
                                <option value="directive-1">
                                    { t('data.substance.reg-status-eu.directive-1') }
                                </option>
                                <option value="directive-1">
                                    { t('data.substance.reg-status-eu.directive-2') }
                                </option>
                                <option value="other">
                                    { t('data.substance.reg-status-eu.other-processes') }
                                </option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group hidden={regEUformik.values.other_directive !== 'other'}>
                            <Form.Label>
                                { t('data.substance.reg-status-eu.other-processes-dscr') }
                            </Form.Label>

                            <Form.Control
                                type="text"
                                as="textarea"
                                name="other_directive_dscr"
                                onChange={regEUformik.handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={() => setState({...state, regStatusEU: false})}
                    >{t('close')}</Button>
                    <Button
                        variant="danger"
                        onClick={regEUformik.handleSubmit}
                    >
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )


    /*
        RETURN
        - DataForm generic component for all other
        data related componenents (e.g. Mixtures)
    */
    return (
        <div>
            <DataForm
                data={data}
                scaling={scaling}
                formik={myformik}
                title={t('data.substance.title')}
                handleChangeSpecial={handleChangeSpecial}
                handleFieldButtonClicks={handleFieldButtonClicks}
                close='/enterprise/chemicals/substances'
                handleDelete={handleDelete}
                custom={{
                    composition: CompositionField,
                    supplier: Supplier,
                    hazard: hazardProfile,
                    regStatusCH: regStatusCH,
                    regStatusEU: regStatusEU
                }}
            />
            
            {/* notifications */}
            <RequestNotification
                show={state.failedMsg}
                onClose={() => setState({ ...state, failedMsg: false })}
            />

            <RequestNotification
                success
                show={state.newSubMsg}
                msgSuccess={t('messages.substance-added')}
                onClose={() => setState({ ...state, successMsg: false })}
            />

            <RequestNotification
                success
                show={state.updatedMsg}
                msgSuccess={t('messages.substance-updated')}
                onClose={() => setState({ ...state, updatedMsg: false })}
            />

            {/* supplier messages */}
            <RequestNotification
                success
                show={state.newSuppMsg}
                msgSuccess={t('messages.supplier-added')}
                onClose={() => setState({ ...state, newSuppMsg: false })}
            />

            {/* composition delete messages */}
            <RequestNotification
                success
                show={state.deleteMsg}
                msgSuccess={t('messages.deleted')}
                onClose={() => setState({ ...state, deleteMsg: false })}
            />
        </div>
    )
}