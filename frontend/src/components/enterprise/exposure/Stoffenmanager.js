import React from 'react';
import DataForm from '../data-forms/DataForm';
import StoffenmanagerForm from '../../../json/exposure-models/stoffenmanager.json';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';



/*
    STOFFENMANAGER

    - allows data entry for an arbitrary (not linked to the core data) ES
    - when id supplied in props, it loads the corresponding exposure instance
*/
export default function Stoffenmanager() {

    const { t } = useTranslation();



    const Schema = Yup.object().shape();
    const formik = useFormik({
        validationSchema: Schema,
        initialValues: {},
        onSubmit: values => {
            console.log(values)
        }
    })

    return(
        <div>
            <DataForm
                data={StoffenmanagerForm}
                scaling={{ label: { md: 3 }, field: { md: 7 } }}
                formik={formik}
                title={t('sm.form-title')}
                closeFun={() => console.log("closeFun")}
                handleDelete={() => null}
                noDeleteButton
            />
        </div>
    )
}