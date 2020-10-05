import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';


export default function Password() {

    const { t } = useTranslation();


    const Schema = Yup.object().shape({
        oldPw: Yup.string().required(t('messages.form.required')),
        newPw: Yup.string().required(t('messages.form.required')),
        newPw2: Yup.string().required(t('messages.form.required'))
    });
    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {
            oldPw:  "",
            newPw:  "",
            newPw2: ""
        },
        onSubmit: values => {

        }
    })

    const scaling = {
        label: {
            xs: { span: 12 },
            md: { span: 4 },
            lg: { span: 3 }
        }, 
        field: {
            xs: { span: 12 },
            md: { span: 6 },
            lg: { span: 4 }
        },
        button: {
            xs: { offset: 3, span: 6 },
            md: { span: 6, offset: 4 },
            lg: { span: 4, offset: 3 }
        }
    }

    return(
        <div
            className="p-3 bg-light"
            style={{
                height: "94vh",
                minHeight: 700
            }}
        >
            <h3>{t('security.title')}</h3>
            <Form className="mt-4">
                <Form.Group as={Row}>
                    <Form.Label column {...scaling.label}>
                        {t('security.old-pw')}:
                    </Form.Label>
                    <Col {...scaling.field}>
                        <Form.Control
                            required
                            type="text"
                            name="oldPw"
                            value={myformik.values.oldPw}
                            onChange={myformik.handleChange}
                            isInvalid={!!myformik.errors.oldPw}
                        />
                        <Form.Control.Feedback type="invalid">
                            { myformik.errors.oldPw }
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column {...scaling.label}>
                        {t('security.new-pw')}:
                    </Form.Label>
                    <Col {...scaling.field}>
                        <Form.Control
                            required
                            type="text"
                            name="newPw"
                            value={myformik.values.newPw}
                            onChange={myformik.handleChange}
                            isInvalid={!!myformik.errors.newPw}
                        />
                        <Form.Control.Feedback type="invalid">
                            { myformik.errors.newPw }
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column {...scaling.label}>
                        {t('security.new-pw-2')}:
                    </Form.Label>
                    <Col {...scaling.field}>
                        <Form.Control
                            required
                            type="text"
                            name="newPw2"
                            value={myformik.values.newPw2}
                            onChange={myformik.handleChange}
                            isInvalid={!!myformik.errors.newPw2}
                        />
                        <Form.Control.Feedback type="invalid">
                            { myformik.errors.newPw2 }
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Row>
                    <Col {...scaling.button}>
                        <Button type="submit" variant="danger" className="w-100">
                            {t('submit')}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}