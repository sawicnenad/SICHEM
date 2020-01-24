import React, { useState, useContext } from 'react';
import {useTranslation} from 'react-i18next';
import Logo from '../media/logo_light.png'
import { Button, Form, Modal, Navbar, Nav, NavItem, NavbarBrand, Toast } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NewUser from '../components/login/NewUser';
import axios from 'axios';
import { ApiRequestsContext } from '../contexts/ApiRequestsContext';


function Login(props) {
    const { t } = useTranslation();
    const [state, setState] = useState({
        msgSuccess: false,
        msgFailed: false
    });
    const context = useContext(ApiRequestsContext);

    const SignupSchema = Yup.object().shape({
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
        <div style={{ height: "100vh" }}>
            <Navbar bg="light" className="px-3">
                <NavbarBrand>
                    {t('login.login')}
                </NavbarBrand>
                <Nav className="ml-auto">
                    <NavItem className="pt-1 mr-3">
                        <img src={require("../media/icons/display.svg")} alt="" width="32" height="32"/>
                    </NavItem>
                    {['De', 'Fr', 'It', 'En'].map(item => (
                        <Nav.Link>
                            {item}
                        </Nav.Link>
                    ))}
                </Nav>
            </Navbar>
            <div className="container m-auto pt-4">

                <div className="row justify-content-center h-100">
                    <div className="col-lg-6">
                        <div className="text-center mb-3">
                            <img src={ Logo } alt="" className="w-50" />
                        </div>
                        
                        <Formik
                            validationSchema={SignupSchema}
                            onSubmit={values => {
                                axios.post(
                                    `${context.API}/token-obtain/`,
                                    values
                                ).then(
                                    res => {
                                        localStorage.setItem('token-access', res.data.access);
                                        localStorage.setItem('token-refresh', res.data.refresh);
                                        props.history.push('/enterprise')
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
                                <Form className="border border-danger p-4 rounded" onSubmit={handleSubmit}>

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