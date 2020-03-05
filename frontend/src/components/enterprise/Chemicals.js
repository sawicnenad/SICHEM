import React, { useState, useContext } from 'react';
import { Tabs, Tab, Button, Modal, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';


export default function Chemicals(props) {
    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);
    const APIcontext = useContext(ApiRequestsContext);
    const [ state, setState ] = useState({});





    // SUBSTANCES ...............................................
    // create label value pairs and element titles
    const substances = () => {
        let data = [];
        let subs = context.substances;

        for (let i in subs) {
            data.push(
                {
                    id: subs[i].id,
                    title: subs[i].reference,
                    data: [
                        {
                            label: t('data.substance.physical-state'),
                            value: t(`data.substance.physical-state-option.${subs[i].physical_state}`)
                        }, {
                            label: t('data.substance.iupac'),
                            value: subs[i].iupac
                        }, {
                            label: t('data.substance.cas_nr'),
                            value: subs[i].cas_nr
                        }, {
                            label: t('data.substance.ec_nr'),
                            value: subs[i].ec_nr
                        }, {
                            label: t('data.substance.molecular_formula'),
                            value: subs[i].molecular_formula
                        }, {
                            label: t('data.substance.last_update'),
                            value: subs[i].last_update
                        }
                    ]
                }
            )
        }
        return data;
    }

    /*
        every create button in data list component has different event on click
        e.g. for substances, it opens a modal to create new substance instance
        where user must state a reference name before the corresponding page opens
    */
    const SubstanceSchema = Yup.object().shape({
        reference: Yup
                    .string()
                    .required(t('messages.form.required'))
                    .min(2, t('messages.form.too-short'))
                    .max(50, t('messages.form.too-long')),
        supplier: Yup
                    .number()
                    .min(1, t('messages.form.required'))
    });

    const substanceFormik = useFormik({
        validationSchema: SubstanceSchema,
        initialValues: {
            reference: ""
        },
        onSubmit: values => {
            const data = {...values, enterprise: context.ent.id};
            axios.post(
                `${APIcontext.API}/substances/`,
                data,
                {headers: {
                    Pragma: "no-cache",
                    Authorization: 'Bearer ' + localStorage.getItem('token-access')
                }}
            ).then(
                res => {
                    // refresh context data in state
                    let substances = [...context.substances];
                    substances.push(res.data);
                    context.refreshState('substances', substances);

                    props.history.push(`/enterprise/substance/${res.data.id}`);
                }
            ).catch(
                e => console.log(e)
            )
        }
    })

    const SubstanceCreateButton = (
        <div className="text-right">
            <Button 
                variant="danger"
                onClick={() => setState({...state, newSubstanceModal: true })}
            >
                { t('create-new') }
            </Button>

            <Modal
                show={state.newSubstanceModal}
                onHide={() => setState({ ...state, newSubstanceModal: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {t('data.substance.create-new-modal-title')}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label>
                            {t('data.substance.reference')}:
                        </Form.Label>

                        <Form.Control
                           required
                           name="reference"
                           type="text"
                           isInvalid={substanceFormik.errors.reference}
                           value={substanceFormik.values.reference}
                           onChange={substanceFormik.handleChange}
                        />

                        <Form.Control.Feedback type="invalid">
                            { substanceFormik.errors.reference }
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={() => setState({...state, newSubstanceModal: false })}
                    >
                        { t('cancel') }
                    </Button>
                    <Button variant="danger" onClick={substanceFormik.handleSubmit}>
                        { t('save') }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )








    return (
        <div className="container-lg px-5 py-3">
            
            <Tabs fill defaultActiveKey={props.match.params.view} className="tabs-customized">
                {[
                    {
                        eventKey: "suppliers",
                        title: t('suppliers'),
                        component: "Suppliers"
                    }, {
                        eventKey: "substances",
                        title: t('substances'),
                        component: <DataList 
                                        name="substances"
                                        data={ substances() }
                                        api={`${APIcontext.API}/substances/`}
                                        link='/enterprise/substance/'
                                        delMsg={t('messages.substance-delete-msg')}
                                        createButton={SubstanceCreateButton}
                                    />
                    }, {
                        eventKey: "mixtures",
                        title: t('mixtures'),
                        component: "Mixtures"
                    }
                ].map(
                    item => (
                        <Tab
                            key={item.eventKey}
                            eventKey={item.eventKey}
                            title={item.title}
                        >
                            <div className="mt-4">
                                {item.component}
                            </div>
                        </Tab>
                    )
                )
                }
            </Tabs>
        </div>
    )
}