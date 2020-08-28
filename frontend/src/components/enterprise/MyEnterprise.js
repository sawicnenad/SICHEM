import React, { useState, useContext } from 'react';
import { Alert, Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import branches from '../../json/branches.json';
import axios from 'axios';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import RequestNotification from '../notifications/RequestNotification.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EnterpriseContext } from '../../contexts/EnterpriseContext.js';








function MyEnterprise() {


    const { t } = useTranslation();
    const [state, setState] = useState({
        modalNewUser: false,
        modalNewEnt: false
    })






    // two cards: new member of existing or create new enterprise
    const cards = [
        {
            border: "info",
            icon: "users",
            title: t('enterprise.my-enterprise.card-new-member-title'),
            text: t('enterprise.my-enterprise.card-new-member-text'),
            action: () => setState({...state, invitationForm: true})
        }, {
            border: "danger",
            icon: "building",
            title: t('enterprise.my-enterprise.card-new-ent-title'),
            text: t('enterprise.my-enterprise.card-new-ent-text'),
            action: () => setState({...state, modalNewEnt: true})
        }
    ];




    return(
        <div>
            <Alert variant="danger">
                <strong>
                    { t('enterprise.my-enterprise.alert-no-enterprise-header') }
                </strong>
                <hr/>
                { t('enterprise.my-enterprise.alert-no-enterprise-text') }
            </Alert>

            <Alert variant="info">
                <strong>
                    { t('enterprise.my-enterprise.alert-info-header') }
                </strong>
                <hr/>
                { t('enterprise.my-enterprise.alert-info-text') }
            </Alert>

            <div className="my-5">
                <h3 className="mb-4">
                    { t('enterprise.my-enterprise.options-header') }
                </h3>

                <Row>
                    {cards.map( (item, inx) => (
                        <Col xs={6} lg={4} key={inx}>
                            <Card border={item.border}>
                                <Card.Header>
                                    <Card.Title>
                                        { item.title }
                                    </Card.Title>
                                </Card.Header>

                                <Card.Body>
                                    <div style={{ fontSize: 75, textAlign: "center" }}>
                                        <FontAwesomeIcon 
                                            icon={item.icon}
                                            className={`text-${item.border}`}
                                        />
                                    </div>
                                    <Card.Text
                                        className="text-muted text-justify"
                                        style={{ height: 75 }}
                                    >
                                        { item.text }
                                    </Card.Text>
                                </Card.Body>

                                <Card.Footer>
                                    <Button
                                        variant={item.border}
                                        onClick={item.action}
                                        className="w-100"
                                    >
                                        { t('confirm') }
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* registration modals */}
            <Modal
                show={state.modalNewEnt}
                onHide={() => setState({ ...state, modalNewEnt: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        { t('enterprise.my-enterprise.card-new-ent-title') }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <NewEntForm onClose={() => setState({...state, modalNewEnt: false})}/>
                </Modal.Body>
            </Modal>


            {/* add user using token */}
            <Modal
                show={state.invitationForm}
                onHide={() => setState({ ...state, invitationForm: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        { t('enterprise.my-enterprise.card-new-member-title') }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <InvitationForm onClose={() => setState({...state, invitationForm: false }) }
                    />
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default MyEnterprise;




/*
    the component above requires forms
    * invitation form
    * new enterprise forms

    defined below ->
*/








function InvitationForm(props) {
    const { t } = useTranslation();
    const context = useContext(ApiRequestsContext);
    const [state, setState] = useState({
        notification: false
    });

    const Schema = Yup.object().shape({
        uid: Yup.string()
            .min(8, t('messages.form.too-short') )
            .max(50, t('messages.form.too-long') )
            .required(t('messages.form.required')),
        token: Yup.string()
            .length(32, t('messages.form.length-32') )
            .required( t('messages.form.required') )
      });

      return (
        <div>
            <Formik
                validationSchema={Schema}
                initialValues={{
                    uid: "",
                    token: ""
                }}
                onSubmit={values => {
                    values.branches = JSON.stringify(values.branches);
                    axios.post(
                        `${context.API}/enterprise/add-user-to-ent/`,
                        values,
                        {
                            headers: {
                                Pragma: "no-cache",
                                Authorization: 'Bearer ' + localStorage.getItem('token-access')
                            }
                        }
                    ).then(
                        res => console.log(res)
                    ).catch(
                        e => setState({ notification: true })
                    )
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{t('enterprise.my-enterprise.form-new-ent.uid')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="uid"
                                value={values.uid}
                                onChange={handleChange}
                                isInvalid={!!errors.uid}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.uid}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t('enterprise.my-enterprise.form-invitation.token')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="token"
                                value={values.token}
                                onChange={handleChange}
                                isInvalid={!!errors.token}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.token}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <hr />
                        <div className="text-right">
                            <Button variant="secondary" className="mr-2" onClick={props.onClose}>
                                { t('cancel') }
                            </Button>
                            <Button variant="danger" type="submit">
                                { t('confirm') }
                            </Button>
                        </div>
                    </Form>
                )}


            </Formik>

            <RequestNotification
                show={ state.notification }
                onClose={ () => setState({ notification: false }) }
            />
        </div>
      );
}


// if new enterprise must be open - no invitation token

function NewEntForm(props) {
    const { t } = useTranslation();
    const context = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);
    const [state, setState] = useState({
        notification: false
    });

    const Schema = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Too Short!')
            .max(100, 'Too Long!')
            .required('Required'),
        uid: Yup.string()
            .min(8, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        address: Yup.string()
            .min(5, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        city: Yup.string()
            .min(2, 'Too Short!')
            .max(25, 'Too Long!')
            .required('Required'),
        state: Yup.string()
            .min(2, 'Too Short!')
            .max(25, 'Too Long!')
            .required('Required'),
        branch: Yup.string()
            .required('Required'),
      });

    return (
        <div>
            <Formik
                validationSchema={Schema}
                initialValues={{
                    name: "",
                    uid: "",
                    address: "",
                    city: "",
                    state: "Switzerland",
                    branch: []
                }}
                onSubmit={values => {
                    values.branch = JSON.stringify(values.branch);
                    axios.post(
                        `${context.API}/enterprise/enterprises/`,
                        values,
                        {
                            headers: {
                                Pragma: "no-cache",
                                Authorization: 'Bearer ' + localStorage.getItem('token-access')
                            }
                        }
                    ).then(
                        res => {
                            props.onClose();
                            entContext.refreshState('ent', res.data);
                            setState({ ...state, notification: true });
                        }
                    ).catch(
                        e => setState({ notification: true })
                    )
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{t('enterprise.my-enterprise.form-new-ent.name')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t('enterprise.my-enterprise.form-new-ent.uid')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="uid"
                                value={values.uid}
                                onChange={handleChange}
                                isInvalid={!!errors.uid}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.uid}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t('enterprise.my-enterprise.form-new-ent.address')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="address"
                                value={values.address}
                                onChange={handleChange}
                                isInvalid={!!errors.address}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t('enterprise.my-enterprise.form-new-ent.city')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="city"
                                value={values.city}
                                onChange={handleChange}
                                isInvalid={!!errors.city}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.sity}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t('enterprise.my-enterprise.form-new-ent.state')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="state"
                                value={values.state}
                                onChange={handleChange}
                                isInvalid={!!errors.state}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.state}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t('enterprise.my-enterprise.form-new-ent.branch')}</Form.Label>
                            <Form.Control
                                as="select"
                                multiple
                                required
                                type="text"
                                name="branch"
                                value={values.branch}
                                onChange={handleChange}
                                isInvalid={!!errors.branch}
                            >
                                {
                                    branches.map(
                                        item => (
                                            <option key={item.ekas} value={item.ekas}>
                                                {item.ekas}: { item.label }
                                            </option>
                                        )
                                    )
                                }
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.branch}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <hr />
                        <div className="text-right">
                            <Button variant="secondary" className="mr-2" onClick={props.onClose}>
                                { t('cancel') }
                            </Button>
                            <Button variant="danger" type="submit">
                                { t('confirm') }
                            </Button>
                        </div>
                    </Form>
                )}


            </Formik>

            <RequestNotification
                show={ state.notification }
                msgSuccess={ t('messages.new-ent-created') }
                onClose={ () => setState({ notification: false }) }
            />
        </div>
    )
}
