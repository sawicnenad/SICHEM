import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import DataForm from './data-forms/DataForm';
import aentityJSON from '../../json/data-forms/aentity.json'
import { useFormik } from 'formik';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import * as Yup from 'yup';
import { Table, Badge, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';



const styling = {
    td: {
        fontSize: 14,
        verticalAlign: "middle"
    }
}




export default function AEntities(props){
    const [state, setState] = useState({
        modal: false
    });
    const {t} = useTranslation();
    const scaling = { label: { md: 3 }, field: { md: 7 } }
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);
    const aentityID = parseInt(props.match.params.id);

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
                    ]
                }
            )
        }
        return data;
    }











    // custom fields -------------------------------------------------
    // worker schedules from context
    const workerSchedules = entContext.workerSchedules.filter(
        o => o.aentity === aentityID
    )

    // based on workerSchedules and worker id from component workers below
    // we extract if available the required timing
    const getWorkerScheduleVal = (id, day) => {
        let worker = workerSchedules.find(o => o.worker === id);
        if (!worker) return <div></div>;

        return (
            <div>
                <div>{`${worker[day+1]}-${worker[day+2]}`}</div>
                <div>{`${worker[day+3]}-${worker[day+4]}`}</div>
            </div>
        )
    }

    const workers = (
        <Table>
            <thead>
                <tr>
                    <th>{t('data.aentity.worker-active')}</th>
                    <th>{t('data.aentity.worker')}</th>
                    <th>{t('data.aentity.schedule')}</th>
                    <th>
                        <Badge variant="info">
                            {t('data.aentity.day.mon')}
                        </Badge>
                    </th>
                    <th>
                        <Badge variant="info">
                            {t('data.aentity.day.tue')}
                        </Badge>
                    </th>
                    <th>
                        <Badge variant="info">
                            {t('data.aentity.day.wed')}
                        </Badge>
                    </th>
                    <th>
                        <Badge variant="info">
                            {t('data.aentity.day.thu')}
                        </Badge>
                    </th>
                    <th>
                        <Badge variant="info">
                            {t('data.aentity.day.fri')}
                        </Badge>
                    </th>
                    <th>
                        <Badge variant="warning">
                            {t('data.aentity.day.sat')}
                        </Badge>
                    </th>
                    <th>
                        <Badge variant="danger">
                            {t('data.aentity.day.sun')}
                        </Badge>
                    </th>
                </tr>
            </thead>
            <tbody>
                {entContext.workers.map(
                    worker => (
                        <tr key={worker.id}>
                            <td style={styling.td}><input type="checkbox" /></td>
                            <td style={styling.td}>{worker.reference}</td>
                            <td style={styling.td}>
                                <Button 
                                    variant="outline-danger" size="sm"
                                    onClick={() => setState({ ...state, scheduleModal: true })}
                                >
                                    { t('set') }
                                </Button>
                            </td>
                            <td style={styling.td}>
                                {getWorkerScheduleVal(worker.id, 'mon')}
                            </td>
                            <td style={styling.td}></td>
                            <td style={styling.td}></td>
                            <td style={styling.td}></td>
                            <td style={styling.td}></td>
                            <td style={styling.td}></td>
                            <td style={styling.td}></td>
                        </tr>
                    )
                )}
            </tbody>
        </Table>
    )

    // yup and formik for worker's schedule
    const ScheduleSchema = Yup.object().shape({

    })

    const scheduleFormik = useFormik({
        validationSchema: ScheduleSchema,
        initialValues: {},
        onSubmit: values => {
            console.log(values)
        }
    })


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
                    close='/enterprise/a-entities'
                    handleDelete={() => console.log("delete")}
                    custom={{
                        workers: workers
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

            {/* set worker's schedule */}
            <Modal
                size="lg"
                show={state.scheduleModal}
                onHide={() => setState({ ...state, scheduleModal: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('data.aentity.schedule')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row style={{ marginBottom: 25, textAlign: "center" }}>
                        <Col md="1"></Col>
                        <Col md="11">
                            <Row>
                                <Col>{t('data.aentity.morning')}</Col>
                                <Col md="1"></Col>
                                <Col>{t('data.aentity.afternoon')}</Col>
                            </Row>
                        </Col>
                    </Row>
                    <Form>
                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(
                            day => (
                                <Form.Group as={Row} key={day}>
                                    <Form.Label column>{t(`data.aentity.day.${day}`)}</Form.Label>
                                    <Col md="11">
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <Form.Control 
                                                            name={`${day}1`}
                                                            type="text"
                                                            placeholder={t('data.aentity.schedule-placeholder')}
                                                            value={scheduleFormik.values[`${day}1`]}
                                                            onChange={scheduleFormik.handleChange}
                                                        />
                                                    </Col>
                                                    <Col md="">_</Col>
                                                    <Col>
                                                        <Form.Control 
                                                            name={`${day}2`}
                                                            type="text"
                                                            placeholder={t('data.aentity.schedule-placeholder')}
                                                            value={scheduleFormik.values[`${day}2`]}
                                                            onChange={scheduleFormik.handleChange}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md="1"></Col>
                                            <Col>
                                                <Row>
                                                    <Col>
                                                        <Form.Control 
                                                            name={`${day}3`}
                                                            type="text"
                                                            placeholder={t('data.aentity.schedule-placeholder')}
                                                            value={scheduleFormik.values[`${day}3`]}
                                                            onChange={scheduleFormik.handleChange}
                                                        />
                                                    </Col>
                                                    <Col md="">_</Col>
                                                    <Col>
                                                        <Form.Control 
                                                            name={`${day}4`}
                                                            type="text"
                                                            placeholder={t('data.aentity.schedule-placeholder')}
                                                            value={scheduleFormik.values[`${day}4`]}
                                                            onChange={scheduleFormik.handleChange}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Form.Group>
                            )
                        )}
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}