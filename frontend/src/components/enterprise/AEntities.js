import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import DataForm from './data-forms/DataForm';
import aentityJSON from '../../json/data-forms/aentity.json'
import { useFormik } from 'formik';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import { Button, Modal, Form } from 'react-bootstrap';
import * as Yup from 'yup';



export default function AEntities(props){
    const [state, setState] = useState({
        modal: false
    });
    const {t} = useTranslation();
    const scaling = { label: { md: 3 }, field: { md: 7 } }
    const APIcontext = useContext(ApiRequestsContext);

    const Schema = Yup.object().shape({
        workplace: Yup.string()
    })

    // used here for modal and also for dataform
    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {
            workplace: ''
        }
    })

    // create button opens form to create a new entity
    const createButton = (<div></div>);

    // list of assessment entities for DataList component
    const aentitiesList = () => {
        return([])
    }


    return(
        <div>
            {
                props.match.params.id ?
                <DataForm
                    formClassName="p-5 mt-2 bg-light"
                    noZebraStyle={true}
                    data={aentityJSON}
                    scaling={scaling}
                    formik={myformik}
                    title={t('data.aentity.form-title')}
                    close='/enterprise/a-entity'
                    handleDelete={() => console.log("delete")}
                />
                :<DataList
                    name="aentities"
                    data={ aentitiesList() }
                    api={`${APIcontext.API}/a-entities/`}
                    link='/enterprise/a-entities/'
                    delMsg={t('messages.aentity-delete-msg')}
                    createButton={createButton}
                />
            }
        </div>
    )
}