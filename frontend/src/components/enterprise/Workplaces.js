import React, { useContext, useState, useEffect } from 'react';
import DataList from './DataList';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import { useTranslation } from 'react-i18next';
import workplaceJson from '../../json/data-forms/workplace.json';
import {
    Button, Modal, Form
} from 'react-bootstrap';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import DataForm from './data-forms/DataForm';
import RequestNotification from '../notifications/RequestNotification';


export default function Workplaces(props) {

    const [ state, setState ] = useState({
        modal: false,
        updatedMsg: false,
        failedMsg: false,
        successMsg: false
    });
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);
    const { t } = useTranslation();

    const workplacesList = () => {
        let data = [];
        let wp = entContext.workplaces;

        for (let i in wp) {
            data.push(
                {
                    id: wp[i].id,
                    title: wp[i].reference,
                    data: [
                        {
                            label: t('data.workplace.sector'),
                            value: wp[i].sector
                        }, {
                            label: t('data.workplace.volume'),
                            value: wp[i].volume
                        }, {
                            label: t('data.workplace.info'),
                            value: wp[i].info
                        }
                    ]
                }
            )
        }
        return data;
    }

    // we need formik for reference field below in modal
    const wpID = props.match.params.id;
    const values = (
        wpID !== undefined ? 
        entContext.workplaces.find(o => o.id === parseInt(wpID))
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
            let url = `${APIcontext.API}/workplaces/`;

            if (wpID !== undefined) {
                method = "put";
                url = url + wpID + "/";
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
                    let wp = [...entContext.workplaces];

                    if (wpID !== undefined) {
                        wp = wp.filter(o => o.id !== parseInt(wpID));
                        setState({ ...state, updatedMsg: true });
                    } else {
                        setState({ ...state, successMsg: true, modal: false });
                    }

                    wp.push(res.data);
                    entContext.refreshState('workplaces', wp);
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
        if (wpID !== undefined) myformik.setValues(values);
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
                    <Modal.Title>{ t('data.workplace.modal-title') }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                {t('data.workplace.reference')}:
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
                    <Button variant="secondary" onClick={() => setState({...state, modal : false })}>
                        { t('close') }
                    </Button>
                    <Button variant="danger" onClick={myformik.handleSubmit}>
                        { t('save') }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
    return (
        <div>
            {
                props.match.params.id ?
                <DataForm
                    formClassName="p-5 mt-2 bg-light"
                    noZebraStyle={true}
                    data={workplaceJson}
                    scaling={{ label: { xs: 3 }, field: { xs: 7 } }}
                    formik={myformik}
                    title={t('data.mixture.modal-title')}
                    close='/enterprise/workplaces'
                    handleDelete={() => console.log("delete")}
                />
                :<DataList
                    name="workplaces"
                    data={ workplacesList() }
                    api={`${APIcontext.API}/workplaces/`}
                    link='/enterprise/workplaces/'
                    delMsg={t('messages.workplace-delete-msg')}
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
                msgSuccess={t('messages.workplace-added')}
                onClose={() => setState({ ...state, successMsg: false })}
            />

            <RequestNotification
                success
                show={state.updatedMsg}
                msgSuccess={t('messages.workplace-updated')}
                onClose={() => setState({ ...state, updatedMsg: false })}
            />
        </div>
    )
}