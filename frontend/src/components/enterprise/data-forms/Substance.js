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
        newSuppMsg: false
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
    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {
            ...initialValues
        },
        validateOnChange: false,
        onSubmit: values => {
            // form data
            let data = new FormData();
            for (let val in values) {
                if ([
                        'physical_hazard',
                        'health_hazard',
                        'environmental_hazard',
                        'additional_hazard'
                    ].indexOf(val) !== -1) {
                        data.append(val, JSON.stringify(values[val]));
                        continue;
                    }
                data.append(val, values[val]);
            }
            data.append('enterprise', entContext.ent.id);

            axios.put(
                `${APIcontext.API}/substances/${props.match.params.id}/`,
                data,
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
    console.log(myformik.values)



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
                    hazard: hazardProfile
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