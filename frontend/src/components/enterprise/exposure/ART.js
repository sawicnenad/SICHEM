import React from 'react';
import ARTForm from '../../../json/exposure-models/art.json';
import DataForm from '../data-forms/DataForm';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';

/*
    Advanced REACH Tool (ART)
*/
export default function ART(props) {

    const { t } = useTranslation();

    const Schema = Yup.object().shape({

    })
    const formik = useFormik({
        validationSchema: Schema,
        initialValues: {},
        onSubmit: values => {
            console.log(values);
        }
    })

    return (
        <div>
            <DataForm
                noZebraStyle={true}
                data={ARTForm}
                scaling={{ label: { md: 3 }, field: { md: 7 } }}
                formik={formik}
                title={t('data.aentity.form-title')}
                close='/enterprise/exposure/assessment'
                handleDelete={() => console.log("delete")}
                noDeleteButton
            />
        </div>
    )
}