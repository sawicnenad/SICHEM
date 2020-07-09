import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import DataForm from './data-forms/DataForm';
import aentityJSON from '../../json/data-forms/aentity.json'
import { useFormik } from 'formik';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import * as Yup from 'yup';
import { Table, Badge, Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Schedule from './aentity/Schedule';
import axios from 'axios';



/*
    assessment entities for a workplace
    * workers schedule
    * cont. activity schedule
    * substances per contributing activities
*/
export default function AEntities(props){
    
    const [state, setState] = useState({
        schedule: false,                    // workers and CA schedule
        workerModal: false,                 // workers of this assessment entity
        workers: [],                        // sent to server
        workersTemp: [],                    // workersTemp saved to workers on Ok button on modal
        timings: {},                        // timing for each worker in form id:timing
        activeWorkerTiming: false,          // timing modal open for worker id
        cas: [],                            // list of CAs added as assessment entities
        activeCATiming: false,              // timing modal open for CA
    })

    const {t} = useTranslation();
    const scaling = { label: { md: 3 }, field: { md: 7 } }
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);
    const aentityID = parseInt(props.match.params.id);

    









    // on load populate state data for the given assessment entity
    useEffect( () => {

        if (!aentityID) {
            return;
        }

        let ae = entContext
                    .aentities
                    .find( o => o.id === aentityID );

        let workersOfAEntity = ae['workers_of_aentity'];
        let cas = ae['cas_of_aentity'];
        let workers = [...state.workers];
        let timings = {...state.timings};

        for (let i = 0; i < workersOfAEntity.length; i++) {

            let id = workersOfAEntity[i].worker;
            workers.push(id);

            let schedule = workersOfAEntity[i].schedule.replace(/'/g, '\"');
            schedule = schedule.replace(/True/g, true);

            timings[id] = JSON.parse(schedule);
        }

        for (let i = 0; i < cas.length; i++) {
            let schedule = cas[i].schedule.replace(/'/g, '\"');
            schedule = schedule.replace(/True/g, true);

            cas[i].schedule = JSON.parse(schedule);
        }

        setState({
            ...state,
            workers: workers,
            timings: timings,
            cas: cas
        })
        
    }, [])











    // used here for modal and also for dataform
    const Schema = Yup.object().shape({workplace: Yup.string()})
    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {
            workplace: ''
        },
        onSubmit: () => {
            /*
                before submitting PUT request
                data must be packed
                to include both CAs and workers data
                which are used as children instances
                of assessment entity on the backend
            */
            let data = entContext.aentities.find(o => o.id === aentityID);       
            let cas = [...state.cas];
            for (let i in cas) {
                cas[i].aentity = aentityID;
                cas[i].schedule = cas[i].schedule ? cas[i].schedule : {};
            }

            let workers = [...state.workers];
            workers = workers.map(
                worker => ({
                    aentity: aentityID,
                    worker: worker,
                    schedule: {...state.timings[worker]}
                })
            )

            data['cas_of_aentity'] = cas;
            data['workers_of_aentity'] = workers;

            axios.put(
                `${APIcontext.API}/a-entities/${aentityID}/`,
                data,
                {headers: {
                        Pragma: "no-cache",
                        Authorization: 'Bearer ' + localStorage.getItem('token-access')
                }}
            ).then(
                res => console.log(res)
            ).catch(
                e => console.log(e)
            )
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





    // Workers -----------------------------------------------------------------------------------

    // Component Schedule in componenents/enterprise/aentity/Schedule.js
    // is used to define schedule for each worker
    // props.recordSchedule returns schedule that is stored in state
    const handleTiming = values => {
        
        // if ca timing
        if (state.activeCATiming !== false) {
            let cas = [...state.cas];
            cas[state.activeCATiming].schedule = values;
            
            setState({
                ...state,
                cas: cas,
                schedule: false,
                activeCATiming: false
            })
            return;
        }

        // for workers ->
        let timings = {...state.timings};
        timings[state.activeWorkerTiming] = values;
        setState({
            ...state,
            timings: timings,
            activeWorkerTiming: false,
            schedule: false
        });
    }


    // Worker as a part of worker selection modal
    const WorkerCol = props => (
        <div
            style={{
                border: "1px solid silver",
                borderRadius: 3,
                padding: 15,
                height: 120,
                textAlign: "center",
                background: "#f4f4f4"
            }}
            className="pointer-on-hover-div"
            onClick={() => handleWorkerSelection(props.id)}
        >
            <div
                className={
                    state.workersTemp.indexOf(props.id) > -1 ?
                    'text-danger' : 'text-secondary'
                }
            >
                <div style={{ fontSize: 28 }}>
                    <FontAwesomeIcon icon="user" />
                </div>

                <div>{props.reference}</div>
                <div>{props.name}</div>
            </div>
        </div>
    )

    // handle addition of the worker from the modal to state
    // it will be used to change styling of the component above
    const handleWorkerSelection = id => {
        let workers = [...state.workersTemp];

        // if worker already inside -> remove
        // else -> add
        if (workers.indexOf(id) > -1) {
            workers = workers.filter(w => w !== id);
        } else {
            workers.push(id);
        }
        setState({
            ...state,
            workersTemp: workers
        })
    }

    // creates a timing representation for table below based on schedule
    const workerTimingInTable = (id, day) => {

        if (!state.timings[id]) {
            return <div></div>
        }

        if (!state.timings[id][day]) {
            return (
                <span className="text-secondary" style={{ fontSize: 13 }}>
                    {t(`days.${day}`)}
                </span>
            )
        }

        let duration = Object.keys(state.timings[id][day]).length / 2;
        let durationIllustrated = Object.keys(state.timings[id][day]).map(
            item => (
                <span style={{
                    color: "red",
                    fontSize: 12
                }} key={item}> | </span>
            )
        );
        return(
            <Row>
                <Col md="4" lg="3">
                    <span className="text-secondary" style={{ fontSize: 13 }}>
                        {t(`days.${day}`)}
                    </span>
                </Col>
                <Col md="6" lg="5">{durationIllustrated}</Col>
                <Col>{duration > 0 ? <span>{duration}h</span> : ""}</Col>
            </Row>
        )
    }

    const workerScheduleTable = (
        <Table>
            <thead>
                <tr>
                    <th>{t('worker')}</th>
                    <th>{t('data.aentity.schedule.title')}</th>
                    <th>{t('data.aentity.schedule.warning')}</th>
                </tr>
            </thead>
            <tbody>
                {
                    state.workers.map(
                        workerID => (
                            <tr key={workerID}>
                                <td>
                                    <div>{
                                        entContext.workers
                                        .find(o => o.id === workerID)
                                        .reference}
                                    </div>
                                    <div>{
                                        entContext.workers
                                        .find(o => o.id === workerID)
                                        .name}
                                    </div>
                                </td>
                                <td>
                                    <div><Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="mb-3"
                                        onClick={() => setState({
                                            ...state,
                                            activeWorkerTiming: workerID,
                                            schedule: true
                                        })}
                                    >{t('set')} <FontAwesomeIcon icon="user-clock" />
                                    </Button></div>
                                    <div>
                                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(
                                            day => (
                                                <div key={day}>
                                                        {workerTimingInTable(workerID, day)}
                                                    </div>
                                                )
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {
                                        !state.timings[workerID] ?
                                            <Alert variant="warning">
                                                {t('messages.no-worker-schedule')}
                                            </Alert> : ""
                                    }
                                </td>
                            </tr>
                        )
                    )
                }</tbody>
        </Table>
    )


    const workers = (
        <div>
            <div>
                <Button 
                    variant="danger"
                    onClick={() => setState({
                        ...state,
                        workerModal: true,
                        workersTemp: [...state.workers]
                    })}
                >
                    {t('data.aentity.select-workers')}
                </Button>
            </div>

            <div className="mt-4">
                {
                    state.workers.length > 0 ?
                        workerScheduleTable : <Alert variant="warning">
                            {t('messages.no-data-for-this-page')}
                        </Alert>
                }
            </div>
            

            {/* Worker selection for this assessment entity - MODAL */}
            <Modal
                show={state.workerModal}
                onHide={() => setState({...state, workerModal: false})}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {t('data.aentity.select-workers')}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        {entContext.workers.map(
                            worker => (
                                <Col key={worker.id} md="3">
                                    <WorkerCol 
                                        name={worker.name}
                                        reference={worker.reference}
                                        id={worker.id}
                                    />
                                </Col>
                            )
                        )}
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setState({...state, workerModal: false})}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => setState({
                            ...state,
                            workers: [...state.workersTemp],
                            workerModal: false
                        })}
                    >
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )




    

    // Contributing activities ---------------------------------------------------------------------
    
    /* 
        formik and yup scheme required for form used to 
        set new CA for the given assessment entities
    */
    const caSchema = Yup.object().shape({})
    const caformik = useFormik({
        validationSchema: caSchema,
        initialValues: {},
        onSubmit: values => {
            console.log(values)
            let cas = [...state.cas];
            cas.push(values);
            setState({
                ...state,
                caModal: false,
                cas: cas
            })
        }
    })

    // removes a set CA from table
    const handleDeleteCAFromTable = inx => {
        console.log(inx);
    }


    // creates a timing representation for table below based on schedule
    const caTimingInTable = (inx, day) => {
        console.log(state.cas[inx])
        if (!state.cas[inx].schedule) {
            return <div></div>
        }

        if (!state.cas[inx].schedule[day]) {
            return (
                <span className="text-secondary" style={{ fontSize: 13 }}>
                    {t(`days.${day}`)}
                </span>
            )
        }

        let duration = Object.keys(state.cas[inx].schedule[day]).length / 2;
        let durationIllustrated = Object.keys(state.cas[inx].schedule[day]).map(
            (item, inx) => (
                inx > 20 ?
                "" :<span style={{
                        color: "red",
                        fontSize: 12
                    }}> | </span>
            )
        );
        return(
            <Row>
                <Col md="4">
                    <span className="text-secondary" style={{ fontSize: 13 }}>
                        {t(`days.${day}`)}
                    </span>
                </Col>
                <Col md="6">{durationIllustrated}</Col>
                <Col style={{ fontSize: 13 }}>
                    {duration > 0 ? <span>{duration}h</span> : ""}
                </Col>
            </Row>
        )
    }

    const caTable = (
        <Table>
            <thead>
                <tr>
                    <th>.</th>
                    <th>{t('data.aentity.ca-table.use')}</th>
                    <th>{t('data.aentity.ca-table.ca')}</th>
                    <th>{t('data.aentity.ca-table.substance')}</th>
                    <th>{t('data.aentity.ca-table.schedule')}</th>
                    <th>{t('data.aentity.ca-table.warning')}</th>
                </tr>
            </thead>
            <tbody>
                {
                    state.cas.map(
                        (ca, inx) => (
                            <tr key={inx}>
                                <td>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="border-0"
                                        onClick={() => handleDeleteCAFromTable(inx)}
                                    ><FontAwesomeIcon icon="trash-alt" />
                                    </Button>
                                </td>
                                <td>{
                                    entContext.uses
                                    .find(o => o.id === parseInt(ca.use))
                                    .reference
                                }</td>
                                <td>{
                                    entContext.uses
                                    .find(o => o.id === parseInt(ca.use))
                                    .cas
                                    .find(o => o.id === parseInt(ca.ca))
                                    .reference
                                }</td>
                                <td>{
                                    entContext.substances
                                    .find(o => o.id === parseInt(ca.substance))
                                    .reference
                                }</td>
                                <td>
                                    <div><Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="mb-3"
                                        onClick={() => setState({
                                            ...state,
                                            schedule: true,
                                            activeCATiming: inx
                                        })}
                                    >{t('set')} <FontAwesomeIcon icon="business-time" />
                                    </Button></div>

                                    <div>
                                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(
                                            day => (
                                                <div key={day}>
                                                    {caTimingInTable(inx, day)}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                        )
                    )
                }
            </tbody>
        </Table>
    )
    
    const cas = (
        <div>
            <Button
                variant="danger"
                onClick={() => setState({...state, caModal: true})}
            >{ t('add-new') }
            </Button>

            {/* Table listing already added CA-SUBSTANCE-MIXTURE */}
            <div className="mt-4">
            {
                state.cas.length > 0 ?
                 caTable
                 :<Alert variant="warning">
                    {t('messages.no-data-for-this-page')}
                </Alert>
            }
            </div>

            {/* Modal to add new CA-SUBSTANCE-MIXTURE */}
            <Modal
                show={state.caModal}
                onHide={() => setState({...state, caModal: false})}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{ t('data.aentity.ca-modal.title') }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                { t('data.aentity.ca-modal.use-map') }
                            </Form.Label>

                            <Form.Control
                                name="use"
                                as="select"
                                required={true}
                                value={caformik.values.use}
                                onChange={caformik.handleChange}
                            >
                                 <option value=""></option>
                                {
                                    entContext.uses.map(
                                        use => (
                                            <option key={use.id} value={use.id}>
                                                {use.reference}
                                            </option>
                                        )
                                    )
                                }
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                { t('data.aentity.ca-modal.ca') }
                            </Form.Label>

                            {
                                caformik.values.use ?
                                    <Form.Control
                                        name="ca"
                                        as="select"
                                        required={true}
                                        value={caformik.values.ca}
                                        onChange={caformik.handleChange}
                                    >
                                        <option value=""></option>
                                        {
                                            entContext
                                            .uses
                                            .find(o => o.id === parseInt(caformik.values.use))
                                            .cas.map(
                                                ca => (
                                                    <option key={ca.id} value={ca.id}>
                                                        {ca.reference}
                                                    </option>
                                                )
                                        )
                                        }
                                    </Form.Control>
                                    : <Alert variant="danger">
                                        { t('data.aentity.ca-modal.no-use-selected-alert') }
                                      </Alert>
                            }
                        </Form.Group>

                        <Form.Group>
                            <Form.Check
                                name="isMixture"
                                label={ t('data.aentity.ca-modal.is-mixture') }
                                value={caformik.values.isMixture}
                                onChange={caformik.handleChange}
                            />
                        </Form.Group>

                        {
                            caformik.values.isMixture ?
                            <Form.Group>
                                <Form.Label>
                                    { t('data.aentity.ca-modal.mixture') }
                                </Form.Label>

                                <Form.Control
                                    name="mixture"
                                    as="select"
                                    required={true}
                                    value={caformik.values.mixture}
                                    onChange={caformik.handleChange}
                                >
                                    <option value=""></option>
                                    {
                                        entContext.mixtures.map(
                                            mix => (
                                                <option key={mix.id} value={mix.id}>
                                                    {mix.reference}
                                                </option>
                                            )
                                        )
                                    }
                                </Form.Control>
                            </Form.Group>
                            :<Form.Group>
                                <Form.Label>
                                    { t('data.aentity.ca-modal.substance') }
                                </Form.Label>

                                <Form.Control
                                    name="substance"
                                    as="select"
                                    required={true}
                                    value={caformik.values.substance}
                                    onChange={caformik.handleChange}
                                >
                                    <option value=""></option>
                                    {
                                        entContext.substances.map(
                                            sub => (
                                                <option key={sub.id} value={sub.id}>
                                                    {sub.reference}
                                                </option>
                                            )
                                        )
                                    }
                                </Form.Control>
                            </Form.Group>
                        }
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setState({...state, caModal: false})}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={caformik.handleSubmit}
                    >
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )






    return(
        <div>

            <Schedule 
                visible={state.schedule}
                onHide={() => setState({...state, schedule: false})}
                recordTiming={handleTiming}
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
