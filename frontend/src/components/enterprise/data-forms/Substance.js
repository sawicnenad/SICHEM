import React, { useContext, useState } from 'react';
import data from '../../../json/data-forms/substance.json';
import DataForm from './DataForm.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext';
import RequestNotification from '../../notifications/RequestNotification';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext.js';

// create new substance
// edit existing substance
export default function Substance(props) {
    const [state, setState] = useState({
        failedMsg: false
    });
    
    const { t } = useTranslation();

    /*
        contexts:
            - API - to get API URL for requests
            - entContext - contains enterprise data
    */
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);






    /*
        BUTTON CLICKS | FIELD CHANGES | SUBMISSION 
    */

    const handleFieldButtonClicks = (clickType, fieldName) => {
        
    }


    /*
        For multi and range fields we need special way
        to handle changes and record them in formik
    */
    const handleChangeSpecial = e => {
        console.log(e.target.value)
    }


    // Submit data to server-----------------------
    const handleSubmit = values => {
        axios.post(
            `${APIcontext.API}/substances/`,
            values,
            {headers: {
                Pragma: "no-cache",
                Authorization: 'Bearer ' + localStorage.getItem('token-access')
            }}
        ).then(
            res => console.log("test")
        ).catch(
            () => setState({ failedMsg: true })
        )
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
    let initialValues = {};
    for (let field in data.fields) {

        // multi add fields
        if (data.fields[field].fieldType === "multi") {
            initialValues[field] = '[""]';
            continue;
        }
        initialValues[field] = "";
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
        onSubmit: values => {
            console.log(values)
        }
    })

    
    
    // label field scaling
    const scaling = {
        label: {
            md: { span: 3 },
            lg: { span: 2, offset: 1 }
        }, 
        field: { md: 7 },
        fieldSm: { md: 4 }
    }



    /* 
        custom fields
        those not in json
    */
    const Supplier = (
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
                <Button variant="outline-danger">
                    { t('create-new') }
                </Button>
            </Col>
        </Form.Group>
    );

    return (
        <div>
            <DataForm
                data={data}
                scaling={scaling}
                formik={myformik}
                title={t('data.substance.title')}
                handleChangeSpecial={handleChangeSpecial}
                handleFieldButtonClicks={handleFieldButtonClicks}
                custom={{
                    composition: <div>Composition</div>,
                    supplier: Supplier
                }}
            />

            {/* notifications */}
            <RequestNotification
                show={state.failedMsg}
                onClose={() => setState({ failedMsg: false })}
            />
        </div>
    )
}