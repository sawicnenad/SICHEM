import React from 'react';
import data from '../../../json/data-forms/substance.json';
import DataForm from './DataForm.js';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

// create new substance
// edit existing substance
export default function Substance(props) {
    const { t } = useTranslation();

    const multiFields = {
        international_names: [""],
        other_names: [""],
        eu_registration_nr: [""],
        other_identity_codes: [""]
    }
    const exactOrRangeFields = {
        mw: true
    }

    const initialValues = {
    };

    for (let field in data.fields) {
        initialValues[field] = "";
    }

    const handleSubmit = values => {

    }

    // Yup is used to define constraints for the fields
    const Schema = Yup.object().shape({
        reference: Yup.string()
            .min(2, t('messages.form.too-short'))
            .max(255, t('messages.form.too-long'))
            .required(t('messages.form.required')),
    });

    return (
        <div>
            <DataForm
                data={data}
                multiFields={multiFields}
                exactOrRangeFields={exactOrRangeFields}
                handleSubmit={handleSubmit}
                initialValues={initialValues}
                schema={Schema}
                title={t('data.substance.title')}
                custom={{
                    composition: <div>Composition</div>
                }}
            />
        </div>
    )
}