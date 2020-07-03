import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import DataForm from './data-forms/DataForm';
import aentityJSON from '../../json/data-forms/aentity.json'
import { useFormik } from 'formik';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import * as Yup from 'yup';
import { Table, Badge, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Schedule from './aentity/Schedule';



const styling = {
    td: {
        fontSize: 14,
        verticalAlign: "middle"
    }
}


/*
    assessment entities for a workplace
    * workers schedule
    * cont. activity schedule
    * substances per contributing activities
*/
export default function AEntities(props){
    
    const [state, setState] = useState({
        schedule: true
    })
    const {t} = useTranslation();
    const scaling = { label: { md: 3 }, field: { md: 7 } }
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);


    const Schema = Yup.object().shape({workplace: Yup.string()})

    // used here for modal and also for dataform
    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {
            workplace: ''
        }
    })

    // list of assessment entities for DataList component
    const aentitiesList = () => {
        let data = [];
        let entities = entContext.aentities;

        for (let i in entities) {
            data.push(
                {
                    id: entities[i].id,
                    title: entContext.workplaces
                            .find(o => o.id === entities[i].workplace)
                            .reference,
                    data: [
                        {
                            label: t('data.use.reference'),
                            value: entities[i].id
                        }
                    ]})}
        return data;
    }





    
    const workers = (
        <div>
            Workers
        </div>
    )




    

    // Contributing activities ---------------------------------------------------------------------
    const cas = (
        <div>
            CAS
        </div>
    )








    return(
        <div>

            <Schedule 
                visible={state.schedule}
                onHide={() => setState({...state, schedule: false})}
            />

            {
                props.match.params.id ?
                <DataForm
                    noZebraStyle={true}
                    data={aentityJSON}
                    scaling={scaling}
                    formik={myformik}
                    title={t('data.aentity.form-title')}
                    close='/enterprise/a-entities'
                    handleDelete={() => console.log("delete")}
                    custom={{
                        workers: workers,
                        cas: cas
                    }}
                />
                :<DataList
                    name="aentities"
                    data={ aentitiesList() }
                    api={`${APIcontext.API}/a-entities/`}
                    link='/enterprise/a-entities/'
                    delMsg={t('messages.aentity-delete-msg')}
                    createButton={<div></div>}
                />
            }
        </div>
    )
}