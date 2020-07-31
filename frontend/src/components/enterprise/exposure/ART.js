import React, { useContext, useEffect } from 'react';
import ARTForm from '../../../json/exposure-models/art.json';
import DataForm from '../data-forms/DataForm';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext.js';
import axios from 'axios';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext.js';

/*
    Advanced REACH Tool (ART)

    - allows data entry for an arbitrary (not linked to the core data) ES
    - when id supplied in props, it loads the corresponding exposure instance
*/
export default function ART(props) {

    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);
    const APIcontext = useContext(ApiRequestsContext);

    const headers = {
        headers: {
            Pragma: "no-cache",
            Authorization: 'Bearer ' + localStorage.getItem('token-access')
        }};


    // if props contain exposure data then values are overpased
    // after parsing the values that did not pass verification 
    // has 'false' assigned and these must be removed from the object
    // this must be skiped for checkbox fields as it prevents later changes
    useEffect(() => {
        if (props.exposureData) {
            let data = props.exposureData.find(o => o['exposure_model'] === 'art');
            let values = JSON.parse(data.parameters);

            for (let key in values) {
                if (values[key] === false && ['nf', 'ff'].indexOf(key) === -1) {
                     values[key] = "" 
                }
            }
            formik.setValues(values);
        }
    }, [props])


    // validation scheme and formik
    const Schema = Yup.object().shape({});
    const formik = useFormik({
        validationSchema: Schema,
        initialValues: { nf: true, ff: false },
        onSubmit: values => {
            // id of exposure instance needed to make post request
            const id = props.exposureData.find(
                o => o['exposure_model'] === 'art').id;

            axios.post(
                `${APIcontext.API}/exposure/update-parameters/${id}`,
                values,
                headers
            ).then(
                res => (
                    console.log(res.data)
                )
            ).catch(
                e => console.log(e)
            )
        },
    })





    // -------------------------------------------------------------------
    return (
        <div>
            <DataForm
                data={ARTForm}
                scaling={{ label: { md: 3 }, field: { md: 7 } }}
                formik={formik}
                title={t('art.form-title')}
                close='/enterprise/exposure/assessment'
                handleDelete={() => null}
                noDeleteButton
            />
        </div>
    )
}