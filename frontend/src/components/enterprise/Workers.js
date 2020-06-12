import React, { useContext, useState, useEffect } from 'react';
import DataList from './DataList';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import { useTranslation } from 'react-i18next';
import workerJSON from '../../json/data-forms/worker.json';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import DataForm from './data-forms/DataForm';
import RequestNotification from '../notifications/RequestNotification';
import {
    Button, Modal, Form, Row, Col
} from 'react-bootstrap';


const scaling = { label: { md: 3 }, field: { md: 7 } }



export default function Workers(props) {

    const [ state, setState ] = useState({
        modal: false,
        updatedMsg: false,
        failedMsg: false,
        successMsg: false,
        timing: false
    });
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);
    const { t } = useTranslation();

    const workersList = () => {
        let data = [];
        let workers = entContext.workers;

        for (let i in workers) {
            data.push(
                {
                    id: workers[i].id,
                    title: workers[i].reference,
                    data: [
                        {
                            label: t('data.worker.reference'),
                            value: workers[i].reference
                        }, {
                            label: t('data.worker.full-name'),
                            value: workers[i].name
                        }, {
                            label: t('data.worker.workplace'),
                            value: workers[i].workplace
                        }
                    ]
                }
            )
        }
        return data;
    }

    // we need formik for reference field below in modal
    const workerID = props.match.params.id;
    const values = (
        workerID !== undefined ? 
        entContext.workers.find(o => o.id === parseInt(workerID))
        : {reference: ""}
    );

    const Schema = Yup.object().shape({
        reference: Yup.string().required(t('messages.form.required'))
                                .max(50, t('messages.form.too-long'))
    })
    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: values,
        onSubmit: values => {
            let method = "post";
            let url = `${APIcontext.API}/workers/`;

            if (workerID !== undefined) {
                method = "put";
                url = url + workerID + "/";
            }

            axios({
                method: method,
                url: url,
                data: {...values, enterprise: entContext.ent.id},
                headers: {
                    Pragma: "no-cache",
                    Authorization: 'Bearer ' + localStorage.getItem('token-access')
                }}

            ).then(
                res => {
                    setState({...state, modal: false, successMsg: true});
                    let workers = [...entContext.workers];

                    if (workerID !== undefined) {
                        workers = workers.filter(o => o.id !== parseInt(workerID));
                        setState({ ...state, updatedMsg: true });
                    } else {
                        setState({ ...state, successMsg: true, modal: false });
                    }

                    workers.push(res.data);
                    entContext.refreshState('workers', workers);
                }
            ).catch(
                e => {
                    console.log(e);
                    setState({...state, modal: false, failedMsg: true})
                }
            )
        }
    })

    useEffect(() => {
        if (workerID !== undefined) myformik.setValues(values);
    }, [props])

    const createButton = (
        <div className="text-right">
            <Button variant="danger"
                onClick={() => setState({...state, modal : true })}
            >
                { t('create-new') }
            </Button>

            <Modal
                show={state.modal}
                onHide={() => setState({...state, modal : false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{ t('data.worker.modal-title') }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                {t('data.worker.reference')}:
                            </Form.Label>
                            <Form.Control
                                required
                                name="reference"
                                value={myformik.values.reference}
                                onChange={myformik.handleChange}
                                isInvalid={!!myformik.errors.reference}
                            />
                            <Form.Control.Feedback type="invalid">
                                { myformik.errors.reference }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={() => setState({...state, modal : false })}
                    >
                        { t('close') }
                    </Button>
                    <Button variant="danger" onClick={myformik.handleSubmit}>
                        { t('save') }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )

    // timing is custom component
    // used to get workers schedule over week
    const timing = (
        <Row>
            <Col {...scaling.label}>
                {t('data.worker.timing')}:
            </Col>
            <Col {...scaling.field}>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setState({ ...state, timing: true })}
                >
                    { t('edit') }
                </Button>

                <Modal
                    show={state.timing}
                    onHide={() => setState({ ...state, timing: false })}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            { t('data.worker.timing') }
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        test
                    </Modal.Body>

                    <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={() => setState({...state, timing: false })}
                    >
                        { t('close') }
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => console.log("save clicked")}
                    >
                        { t('save') }
                    </Button>
                </Modal.Footer>
                </Modal>
            </Col>
        </Row>
    )
    

    // set workplace list for the workplace field in json
    let workplaces = [...entContext.workplaces];
    let wpOptions = [];
    for (let wp in workplaces) {
        wpOptions.push({ 
            value: workplaces[wp].id, 
            label: workplaces[wp].reference
        });
    }
    workerJSON.fields.workplace.options = wpOptions;

    return (
        <div className="container-lg px-5 py-3">
            {
                props.match.params.id ?
                <DataForm
                    formClassName="p-5 mt-2 bg-light"
                    noZebraStyle={true}
                    data={workerJSON}
                    scaling={scaling}
                    formik={myformik}
                    title={t('data.worker.form-title')}
                    close='/enterprise/workers'
                    handleDelete={() => console.log("delete")}
                    custom={{
                        timing: timing
                    }}
                />
                :<DataList
                    name="workers"
                    data={ workersList() }
                    api={`${APIcontext.API}/workers/`}
                    link='/enterprise/workers/'
                    delMsg={t('messages.worker-delete-msg')}
                    createButton={createButton}
                />
            }


            {/* Notifications */}
            {/* notifications */}
            <RequestNotification
                show={state.failedMsg}
                onClose={() => setState({ ...state, failedMsg: false })}
            />

            <RequestNotification
                success
                show={state.successMsg}
                msgSuccess={t('messages.worker-added')}
                onClose={() => setState({ ...state, successMsg: false })}
            />

            <RequestNotification
                success
                show={state.updatedMsg}
                msgSuccess={t('messages.worker-updated')}
                onClose={() => setState({ ...state, updatedMsg: false })}
            />
        </div>
    )
}