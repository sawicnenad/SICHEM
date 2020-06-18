import React, { useState, useContext } from 'react';
import {useTranslation} from 'react-i18next';
import Logo from '../media/logo_light.png'
import { Button, Form, Modal, Navbar, Nav, Toast } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NewUser from '../components/login/NewUser';
import axios from 'axios';
import { ApiRequestsContext } from '../contexts/ApiRequestsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



function Login(props) {
    const { t } = useTranslation();
    const [state, setState] = useState({
        msgSuccess: false,
        msgFailed: false
    });
    const context = useContext(ApiRequestsContext);

    const Schema = Yup.object().shape({
        username: Yup.string()
          .min(5, 'Too Short!')
          .max(50, 'Too Long!')
          .required('Required'),
        password: Yup.string()
          .min(8, 'Too Short!')
          .max(50, 'Too Long!')
          .required('Required')
      });

    return (
        <div style={{
                height: "100vh",
                background: `url(${require("../media/background.jpg")})`,
                backgroundSize: 'cover'
            }}>
            <Navbar bg="light" className="px-5">
                <Nav>
                    <Nav.Item className="pt-1">
                        <FontAwesomeIcon icon="globe" size="2x" color="silver" />
                    </Nav.Item>
                    {['de', 'fr', 'it', 'en'].map(item => (
                        <Nav.Item key={item}>
                            <Nav.Link link="#" eventKey={item}>
                                {item}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Navbar>
            <div className="container m-auto pt-4">

                <div className="row justify-content-center h-100">
                    <div className="col-lg-5">
                        <div className="text-center mb-3">
                            <img src={ Logo } alt="" className="w-50" />
                        </div>

                        <Formik
                            validationSchema={Schema}
                            initialValues={{ username: "", password: "" }}
                            onSubmit={values => {
                                axios.post(
                                    `${context.API}/token-obtain/`,
                                    values
                                ).then(
                                    res => {
                                        localStorage.setItem('token-access', res.data.access);
                                        localStorage.setItem('token-refresh', res.data.refresh);
                                        props.history.push('/enterprise');
                                    }
                                ).catch(
                                    () => setState({ ...state, msgFailed: true })
                                )
                            }}
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                values,
                                errors,
                            }) => (
                                <Form
                                    className="p-4 bg-white shadow-lg"
                                    onSubmit={ handleSubmit }
                                    style={{ 
                                        borderRadius: 5,
                                        marginTop: "10vh"
                                    }}
                                >
                                    <Form.Group>
                                        <Form.Label>{t('login.username')}</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="username"
                                            value={values.username}
                                            onChange={handleChange}
                                            isInvalid={!!errors.username}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>{t('login.password')}</Form.Label>
                                        <Form.Control
                                            required
                                            type="password"
                                            name="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            isInvalid={!!errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>


                                    <Button type="submit" variant="primary" className="w-100 mt-3">
                                        { t('login.login') }
                                    </Button>

                                    <div className="mt-3 text-center text-secondary">
                                        --------- {t('login.or')} ----------
                                    </div>

                                    <Button
                                        variant="danger" className="w-100 mt-3"
                                        onClick={ () => setState({...state, newUser: true}) }>
                                        { t('login.open-account') }
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                {/* new user registration */}
                <Modal
                    show={state.newUser}
                    onHide={ () => setState({ ...state, newUser: false }) }
                    style={{ marginTop: 50 }}
                >
                    <Modal.Header closeButton>
                        {t('login.new-user')}
                    </Modal.Header>

                    <Modal.Body>
                        <NewUser
                            onSignedUp={() => setState({
                                ...state,
                                newUser: false,
                                msgSuccess: true
                            })} />
                    </Modal.Body>
                </Modal>
            </div>

            {/* notifications */}
            <Toast
                show={state.msgSuccess}
                onClose={() => setState({ ...state, msgSuccess: false })}
                autohide
                delay={5000}
                style={{
                    position: "absolute",
                    top: "1%",
                    right: "1%",
                    width: 400
                }}
            >
                <Toast.Header>
                    <img
                        src={require('../media/icons/check-circle.svg')}
                        alt="" className="mr-2" width={24}
                    />
                    <span className="text-success mr-auto font-weight-bold">{t('messages.request.success')}</span>
                </Toast.Header>

                <Toast.Body>
                    <span className="text-secondary">{t('login.sign-up.msg-success')}</span>
                </Toast.Body>
            </Toast>

            <Toast
                show={state.msgFailed}
                onClose={() => setState({ ...state, msgFailed: false })}
                autohide
                delay={5000}
                style={{
                    position: "absolute",
                    top: "1%",
                    right: "1%",
                    width: 400
                }}
            >
                <Toast.Header>
                    <img
                        src={require('../media/icons/alert-square-fill.svg')}
                        alt="" className="mr-2" width={24}
                    />
                    <span className="text-danger mr-auto font-weight-bold">{t('messages.request.failed')}</span>
                </Toast.Header>

                <Toast.Body>
                    <span className="text-secondary">{t('login.msg-failed')}</span>
                </Toast.Body>
            </Toast>
        </div>
    )
}
export default Login;
