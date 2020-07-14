import React, { useState, useEffect, useContext } from 'react';
import DataForm from '../data-forms/DataForm';
import aentityJSON from '../../../json/data-forms/aentity.json';
import CATable from './CATable';
import CAForm from './CAForm';
import { Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import RequestNotification from '../../notifications/RequestNotification';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import WorkersList from './WorkersList';
import WorkerTable from './WorkerTable';



/*
    AEntity is a component used to set assessment entities
    for a given workplace

    * Workers with their schedules
    * CAs combinations with Substances or Mixtures with their schedule
*/
export default function AEntity(props) {

    const [ state, setState ] = useState({
        successMsg: false,
        errorMsg: false,
    })
    // data is used to store temporary data of assessment entity
    const [ data, setData ] = useState({});

    const { t } = useTranslation();
    const aentityID = parseInt(props.match.params.id);
    const context = useContext(EnterpriseContext);

    // use effect to set temprary data of assessment entities in state
    // following each change of the data in Workers and CA components
    // the state is updated and prepared for a final submit - axios request
    useEffect(() => {
        // if aentityID not found return 'page not found'
        if (!aentityID && aentityID !== 0) {
            setState({
                ...state,
                pageNotFound: true,
                loaded: true
            });
            return;
        }

        // else set initial state 
        // try to get initial data if ID valid
        const data = context.aentities.find(o => o.id === aentityID);
        if (!data) {
            setState({ pageNotFound: true, loaded: true });
            return;
        }
        setData(data);
        setState({ ...state, loaded: true });
    }, [ props ])
    console.log(data)







    // if page not found --------------------------------------
    if (state.pageNotFound && state.loaded) {
        return(
            <div>
                <Alert variant="danger">
                    <Alert.Heading>
                        {t('messages.page-not-found')}
                    </Alert.Heading>
                    <hr/>
                    {t('messages.no-data-for-this-page')}
                </Alert>
            </div>
        )
    }
    // while loading
    if (!state.loaded) {
        return <div>loading...</div>
    }
    // -------------------------------------------------------








    // CUSTOM FIELDS 
    // * Workers
    // * Contributing activities


    // Workers -----------------------------------------------------------------------------------

    // function receives updated list of workers
    // from WorkersList and updates data accordingly
    const updateWorkers = workers => {
        let newData = {...data};
        newData['workers_of_aentity'] = workers;
        setData(newData);
    }


    // First element is modal containing all workers added to SICHEM
    // The second part lists selected for this workplace in a table
    // also allowing the end-user to specify their week schedule
    const Workers = (
        <div>
            <WorkersList 
                workers={data['workers_of_aentity']}
                aentityID={aentityID}
                handleSubmit={updateWorkers}
            /><br/>

            {
                data['workers_of_aentity'].length === 0 ?
                <Alert
                    variant="warning"
                >{t('messages.no-data-for-this-page')}</Alert>
                : <WorkerTable 
                    workers={data['workers_of_aentity']}
                />
            }
        </div>
    )



    

    // Contributing activities ---------------------------------------------------------------------

    // updates list of CA/Substance/Mixture = assessment entities
    // in data based on the corresponding values received from form
    // defined in CAForm component

    // * It is important to avoid assessment entities that include
    // the same CA/Substance or CA/Mixture combinations
    const updateCAs = values => {
        console.log(values);
    }

    // Custom field that includes form to add new assessment entity
    // and a list of added entities for which the end users specify schedules
    const CA = (
        <div>
            <CAForm handleSubmit={updateCAs}/>
            <CATable aentityID={aentityID} />
        </div>
    )




    return(
        <div>
             <DataForm
                noZebraStyle={true}
                data={aentityJSON}
                scaling={{ label: { md: 3 }, field: { md: 7 } }}
                formik={false}
                title={t('data.aentity.form-title')}
                close='/enterprise/a-entities'
                handleDelete={() => console.log("delete")}
                noDeleteButton
                custom={{
                    workers: Workers,
                    cas: CA
                }}
            />



            {/* Notifications */}
            <RequestNotification
                success
                show={state.successMsg}
                msgSuccess={t('messages.aentity-updated')}
                onClose={() => setState({ ...state, successMsg: false })}
            />

            <RequestNotification
                show={state.errorMsg}
                onClose={() => setState({ ...state, errorMsg: false })}
            />
        </div>
    )
}