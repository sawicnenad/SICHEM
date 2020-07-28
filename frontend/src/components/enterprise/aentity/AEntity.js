import React, { useState, useEffect, useContext } from 'react';
import DataForm from '../data-forms/DataForm';
import aentityJSON from '../../../json/data-forms/aentity.json';
import CAForm from './CAForm';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import RequestNotification from '../../notifications/RequestNotification';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import WorkerList from './WorkersList';
import CAList from './CAList';
import WorkersModal from './WorkersModal';
import Schedule from './Schedule';
import axios from 'axios';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext';



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
    const APIcontext = useContext(ApiRequestsContext);

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




    // final submit to the server
    const handleSubmit = () => {
        axios.put(
            `${APIcontext.API}/assessment-entities/${aentityID}/`,
            data,
            {
                headers: {
                    Pragma: "no-cache",
                    Authorization: 'Bearer ' + localStorage.getItem('token-access')
                }
            }
        ).then(
            res => {
                let updated = res.data;
                let aentities = [...context.aentities];
                aentities = aentities.filter(o => o.id !== aentityID);
                aentities.push(updated);
                setState({ ...state, successMsg: true });
                context.refreshState('aentities', aentities);
            }
        ).catch(
            e => {
                console.log(e);
                setState({ ...state, errorMsg: true });
            }
        )
    }




    /*
        ******************** Schedule **********************
        the same component instance for both workers and CAs
        based on the received arguments, the function below
        must set schedule data corresponding to the request
    */
    const handleSchedule = (isWorker, n) => {
        // n -> id of worker
        // or index of CA in the list
        let scheduleValues = {};

        if (isWorker) {
            // if worker's schedule
            let workers = [...data['workers_of_aentity']];
            let worker = workers.find(o => o.worker === n);
            scheduleValues = worker.schedule;
        } else {
            // if CA's schedule
            let cas = [...data['cas_of_aentity']];
            let ca = cas[n];
            scheduleValues = ca.schedule;
        }

        // some formatting required in case of single quote
        // also Python stores 'True' instead of 'true' required in JS
        if (typeof(scheduleValues) !== 'object') {
            scheduleValues = scheduleValues.replace(/'/g, '"');
            scheduleValues = scheduleValues.replace(/True/g, 'true');
            scheduleValues = JSON.parse(scheduleValues);
        }
        
        setState({
            ...state,
            schedule: true,
            isWorker: isWorker,
            scheduleActive: n,
            scheduleValues: scheduleValues
        });
    }


    // handles 'Save' button event in schedule
    // updates schedule values in state of this component
    const updateSchedule = values => {
        let updatedData = {...data};

        if (state.isWorker) {
            let workers = updatedData['workers_of_aentity']
            let worker = workers.find(
                o => o.worker === state.scheduleActive);
            workers = workers.filter(o => o.worker !== state.scheduleActive);
            worker.schedule = JSON.stringify(values);
            workers.push(worker);
            updatedData['workers_of_aentity'] = workers;
            setData(updatedData);
        } else {
            let entities = updatedData['cas_of_aentity'];
            entities[state.scheduleActive].schedule = JSON.stringify(values);
            updatedData['cas_of_aentity'] = entities;
            setData(updatedData);
        }

        // update state - close schedule
        setState({
            ...state,
            scheduleActive: false,
            scheduleValues: {},
            schedule: false
        })
    }



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
            <WorkersModal 
                workers={data['workers_of_aentity']}
                aentityID={aentityID}
                handleSubmit={updateWorkers}
            /><br/>

            {
                data['workers_of_aentity'].length === 0 ?
                <Alert
                    variant="warning"
                >{t('messages.no-data-for-this-page')}</Alert>
                : <WorkerList
                    workers={data['workers_of_aentity']}
                    handleSchedule={handleSchedule}
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
        // the function only adds a new CA to the list
        let updatedData = {...data};
        let updatedCAs = updatedData['cas_of_aentity'];
        values.aentity = aentityID;
        values.schedule = {};
        values['exposure_models'] = [];
        updatedCAs.push(values);
        updatedData['cas_of_aentity'] = updatedCAs;
        setData(updatedData);
    }

    // delete by index argument from the list
    const handleDelete = n => {
        let updatedData = {...data};
        let entities = updatedData['cas_of_aentity'];

        let entities2 = [];
        for (let i = 0; i < entities.length; i++) {
            if (i !== n) {
                entities2.push(entities[i]);
            }
        }
        updatedData['cas_of_aentity'] = entities2;
        setData(updatedData);
    }

    // Custom field that includes form to add new assessment entity
    // and a list of added entities for which the end users specify schedules
    const CA = (
        <div>
            <CAForm handleSubmit={updateCAs}/>
            <CAList 
                entities={data['cas_of_aentity']}
                handleSchedule={handleSchedule} 
                handleSchedule={handleSchedule}
                handleDelete={handleDelete}
            />
        </div>
    )




    return(
        <div>
             <DataForm
                noZebraStyle={true}
                data={aentityJSON}
                scaling={{ label: { md: 3 }, field: { md: 7 } }}
                formik={false}
                handleSubmit={handleSubmit}                         // because formik is false
                title={t('data.aentity.form-title')}
                close='/enterprise/a-entities'
                handleDelete={() => console.log("delete")}
                noDeleteButton
                custom={{
                    workers: Workers,
                    cas: CA
                }}
            />

            <Schedule
                visible={state.schedule}
                onHide={() => setState({ ...state, schedule: false })}
                timing={state.scheduleValues}
                updateSchedule={updateSchedule}
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