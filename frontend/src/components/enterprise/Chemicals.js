import React, { useState, useContext } from 'react';
import { Tabs, Tab, Button, Modal, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import DataForm from './data-forms/DataForm';
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

    

    // SUPPLIERS
    const suppliers = () => {
        let data = [];
        let suppliers = context.suppliers;

        for (let i in suppliers) {
            data.push(
                {
                    id: suppliers[i].id,
                    title: suppliers[i].name,
                    data: [
                        {
                            label: t('data.supplier.origin'),
                            value: t(`data.supplier.origin-options.${suppliers[i].origin}`)
                        }, {
                            label: t('data.supplier.address'),
                            value: suppliers[i].address
                        }, {
                            label: t('data.supplier.info'),
                            value: suppliers[i].info
                        }
                    ]
                }
            )
        }
        return data;
    }

    const SupplierCreateButton = (
        <div className="text-right">
            <Button
                variant="danger"
                onClick={() => props.history.push('/enterprise/supplier/0')}
            >
                { t('create-new') }
            </Button>

        </div>
    )



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
                            value: subs[i].physical_state ? t(`data.substance.physical-state-option.${subs[i].physical_state}`) : ""
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




    // MIXTURES
    // create list of mixtures that is representative for all mixtures
    // and is shown in DataList component
    const mixtures = () => {
        let data = [];
        let mixtures = context.mixtures;

        for (let i in mixtures) {
            data.push(
                {
                    id: mixtures[i].id,
                    title: mixtures[i].reference,
                    data: [
                        {
                            label: t('data.mixtures.reference'),
                            value: mixtures[i].reference
                        }
                    ]
                }
            )
        }
        return data;
    }

    const mixYup = Yup.object().shape({
        reference: Yup.string()
            .required(t('messages.form.required'))
            .max(50, t('messages.form.too-long'))
    })

    const mixFormik = useFormik({
        validationSchema: mixYup,
        initialValues: {
            reference: ""
        },
        onSubmit: values => {
            const data = {...values, enterprise: context.ent.id};
            axios.post(
                `${APIcontext.API}/mixtures/`,
                data,
                {headers: {
                    Pragma: "no-cache",
                    Authorization: 'Bearer ' + localStorage.getItem('token-access')
                }}
            ).then(
                res => {
                    // refresh context data in state
                    let mixtures = [...context.mixtures];
                    mixtures.push(res.data);
                    context.refreshState('mixtures', mixtures);
                    props.history.push(`/enterprise/mixture/${res.data.id}`);
                }
            ).catch(
                e => console.log(e)
            )
        }
    })

    // this one opens modal where we need to enter mixture reference name
    const MixtureCreateButton = (
        <div className="text-right">
            <Button 
                variant="danger"
                onClick={() => setState({...state, newMixtureModal: true })}
            >
                { t('create-new') }
            </Button>

            <Modal
                show={state.newMixtureModal}
                onHide={() => setState({ ...state, newMixtureModal: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        { t('data.mixture.new-mixture') }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                {t('data.mixture.reference')}:
                            </Form.Label>

                            <Form.Control
                                name="reference"
                                type="text"
                                required
                                value={mixFormik.values.reference}
                                onChange={mixFormik.handleChange}
                                isInvalid={!!mixFormik.errors.reference}
                            />

                            <Form.Control.Feedback type="invalid">
                                {mixFormik.errors.reference}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={() => setState({...state, newMixtureModal: false })}
                    >
                        { t('cancel') }
                    </Button>
                    <Button variant="danger" onClick={mixFormik.handleSubmit}>
                        { t('save') }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )






    // -------------------------- RETURN ---------------------------------------------------

    return (
        <div className="container-lg px-5 py-3">
            
            <Tabs fill defaultActiveKey={props.match.params.view} className="tabs-customized">
                {[
                    {
                        eventKey: "suppliers",
                        title: t('suppliers'),
                        component: <DataList 
                                        name="suppliers"
                                        data={ suppliers() }
                                        api={`${APIcontext.API}/suppliers/`}
                                        link='/enterprise/supplier/'
                                        delMsg={t('messages.supplier-delete-msg')}
                                        createButton={SupplierCreateButton}
                                    />
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
                        component: <DataList
                                        name="mixtures"
                                        data={ mixtures() }
                                        api={`${APIcontext.API}/mixtures/`}
                                        link='/enterprise/mixture/'
                                        delMsg={t('messages.mixture-delete-msg')}
                                        createButton={MixtureCreateButton}
                                    />
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