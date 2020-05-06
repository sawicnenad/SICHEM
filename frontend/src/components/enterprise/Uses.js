import React, { useContext, useState } from 'react';
import DataList from './DataList';
import { useTranslation } from 'react-i18next';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    Button, Modal, Form
} from 'react-bootstrap';
import axios from 'axios';



/*
    Use maps
    - holding general information on the use
    - contributing activities
    - and corresponding SWEDs for the cont.activities


    when /enterprise/uses -> shows only list of uses
    when /enterprise/uses/id -> shows form to edit given use
*/
export default function Uses(props) {

    const [ state, setState ] = useState({
        modal: false
    })
    const { t } = useTranslation();
    const entContext = useContext(EnterpriseContext);
    const APIcontext = useContext(ApiRequestsContext);

    
    
    // at /enterprise/uses ---------------------------------------------------
    const listOfUses = () => {
        let data = [];
        let uses = entContext.uses;

        for (let i in uses) {
            data.push(
                {
                    id: uses[i].id,
                    title: uses[i].reference,
                    data: [
                        {
                            label: t('data.use.reference'),
                            value: uses[i].reference
                        }
                    ]
                }
            )
        }
        return data;
    }

    // formik and yup for form
    // used for modal and also for data-form
    const Schema = Yup.object().shape({
        reference: Yup.string().required(t('message.form.required'))
    })

    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {
            reference: ""
        },
        onSubmit: values => {
            axios.post(
                `${APIcontext.API}/uses/`,
                {...values, enterprise: entContext.ent.id},
                {headers: {
                    Pragma: "no-cache",
                    Authorization: 'Bearer ' + localStorage.getItem('token-access')
                }}
            ).then(
                res => {
                    let use = res.data;
                    let usesList = [...entContext.uses];
                    usesList.push(use);
                    entContext.refreshState('uses', usesList);
                    setState({ ...state, successMsg: true, modal: false })
                }
            ).catch(
                e => {
                    console.log(e);
                    setState({ ...state, failedMsg: true });
                }
            )
        }
    })

    // Contains create button for new use map
    // and corresponding modal with the form
    const useCreateButton = (
        <div className="text-right">
            <Button variant="danger" onClick={() => setState({ ...state, modal: true })}>
                { t('create-new') }
            </Button>

            <Modal
                show={state.modal}
                onHide={() => setState({ ...state, modal: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{ t('data.use.modal-title') }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                {t('data.use.reference')}
                            </Form.Label>
                            <Form.Control
                                required
                                name="reference"
                                type="text"
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
                    <Button variant="secondary" 
                        onClick={() => setState({ ...state, modal: false }) }
                    >
                        {t('close')}
                    </Button>
                    <Button variant="danger" onClick={myformik.handleSubmit}>
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )


    return (
        <div className="container-lg px-5 py-3">
            <DataList 
                name="uses"
                data={ listOfUses() }
                api={`${APIcontext.API}/uses/`}
                link='/enterprise/uses/'
                delMsg={t('messages.use-delete-msg')}
                createButton={useCreateButton}
            />
        </div>
    )
}