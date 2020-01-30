import React, { useContext } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import axios from 'axios';

export default function NewUser(props) {
    const { t } = useTranslation();
    const context = useContext(ApiRequestsContext);

    Yup.addMethod(Yup.mixed, 'equalTo', function(ref, message) {
        const msg = message || t('messages.form.passwords-agree');
        return this.test('equalTo', msg, function (value) {
          let refValue = this.resolve(ref);
          return !refValue || !value || value === refValue;
        })
    })
    
    const SignupSchema = Yup.object().shape({
        first_name: Yup.string()
            .min(2, t('messages.form.too-short'))
            .max(25, t('messages.form.too-long'))
            .required(t('messages.form.required')),
        last_name: Yup.string()
            .min(2, t('messages.form.too-short'))
            .max(25, t('messages.form.too-long'))
            .required(t('messages.form.required')),
        email: Yup.string()
            .email(t('messages.form.invalid-email'))
            .required(t('messages.form.required')),
        username: Yup.string()
            .min(5, t('messages.form.too-short'))
            .max(25, t('messages.form.too-long'))
            .required(t('messages.form.required')),
        password: Yup.string()
            .min(8, t('messages.form.too-short'))
            .max(25, t('messages.form.too-long'))
            .required(t('messages.form.required'))
            .equalTo(Yup.ref("password2")),
        password2: Yup.string()
            .min(8, t('messages.form.too-short'))
            .max(25, t('messages.form.too-long'))
            .required(t('messages.form.required'))
            .equalTo(Yup.ref("password"))
    });

    return (
        <div>
            <Formik
                validationSchema={SignupSchema}
                initialValues={{
                    first_name: "",
                    last_name: "",
                    username: "",
                    email: "",
                    password: "",
                    password2: ""
                }}
                onSubmit={values => {
                    axios.post(
                        `${context.API}/enterprise/user-sign-up/`,
                        values
                    ).then(
                        () => props.onSignedUp()
                    ).catch(
                        () => console.log("error")
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
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>{t('login.sign-up.first-name')}</Form.Label>
                                    <Form.Control 
                                        required
                                        type="text" 
                                        name="first_name"
                                        value={values.first_name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.first_name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.first_name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group>
                                <Form.Label>{t('login.sign-up.last-name')}</Form.Label>
                                    <Form.Control 
                                        required
                                        type="text" 
                                        name="last_name"
                                        value={values.last_name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.last_name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.last_name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group>
                            <Form.Label>{t('login.sign-up.email')}</Form.Label>
                            <Form.Control 
                                required
                                type="email" 
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

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
                        <Form.Group>
                            <Form.Label>{t('login.sign-up.password-confirm')}</Form.Label>
                            <Form.Control 
                                required
                                type="password" 
                                name="password2"
                                value={values.password2}
                                onChange={handleChange}
                                isInvalid={!!errors.password2 || values.password !== values.password2}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password2}
                            </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Button type="submit" variant="danger" className="w-100 mt-3">
                            { t('login.sign-up.submit') }
                        </Button>
                        
                        </Form>
                    )} 
            </Formik>
        </div>
    )
}