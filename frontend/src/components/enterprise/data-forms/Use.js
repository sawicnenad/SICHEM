import React, { useContext } from 'react';
import useJSON from '../../../json/data-forms/use.json';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import DataForm from './DataForm';
import { useTranslation } from 'react-i18next';
import ContributingActivity from './ContributingActivity';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';


const scaling = {
    label: {
        md: { span: 3 },
        lg: { span: 2, offset: 1 }
    }, 
    field: { md: 7 },
    fieldSm: { md: 4 }
}


/*
    while uses.js in parent folder shows all uses
    here we edit a single use and its ca and swed data
*/
export default function Use(props) {

    const { t } = useTranslation();
    const entContext = useContext(EnterpriseContext);
    const useID = parseInt(props.match.params.id);
    const useValues = entContext.uses.find(o => o.id === useID);

    // YUP and formik --------------------------------------------
    const Schema = Yup.object().shape({
        reference: Yup.string().required(t('messages.form.required'))
    })

    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {...useValues},
        onSubmit: values => {
            console.log(values)
        }
    })

    // delete function for delete button in header
    const handleDelete = () => {

    }


    // CUSTOM FIELDS 
    // Contributing activities and SWEDs
    const ca = (
        <ContributingActivity 
            cas={useValues.cas}
            scaling={scaling}
        />
    );

    const swed = (
        <div>
            swed
        </div>
    )

    return(
        <div className="container-lg px-5 py-3">
            <DataForm
                data={useJSON}
                scaling={scaling}
                formik={myformik}
                title={t('data.use.title')}
                close='/enterprise/uses'
                handleDelete={handleDelete}
                custom={{
                    ca: ca,
                    swed: swed
                }}
            />
        </div>
    )
}