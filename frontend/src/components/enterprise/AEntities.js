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
        activeWorkerTiming: false           // timing modal open for worker id
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





    // Workers -----------------------------------------------------------------------------------

    // Component Schedule in componenents/enterprise/aentity/Schedule.js
    // is used to define schedule for each worker
    // props.recordSchedule returns schedule that is stored in state
    const handleTiming = values => {
        let timings = {...state.timings};
        timings[state.activeWorkerTiming] = values;
        setState({
            ...state,
            timings: timings,
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
            return <Badge variant="info">
                    {t(`days.${day}`)}
                </Badge>
        }

        let duration = Object.keys(state.timings[id][day]).length / 2;
        let durationIllustrated = Object.keys(state.timings[id][day]).map(
            item => (
                <span style={{
                    color: "red"
                }}> | </span>
            )
        );
        return(
            <Row>
                <Col md="2">
                    <Badge variant="info">
                        {t(`days.${day}`)}
                    </Badge>
                </Col>
                <Col md="4">{durationIllustrated}</Col>
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
    const cas = (
        <div>
            CAS
        </div>
    )





    console.log(state.timings)


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
