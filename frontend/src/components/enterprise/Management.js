import React, { useContext } from 'react';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';


// enterprise component
// showing details about enterprise (e.g. name, UID, address ...)
// allows management of users (if admin)
// addition of new users (if admin)
export default function Management(props) {

    const context = useContext(EnterpriseContext);
    const { t } = useTranslation();


    // form scaling configuration
    const scaling = {
        label: { xs: 12, md: 4, lg: 2 },
        field: { xs: 12, md: 8, lg: 4 },
        button: {
            xs: 12,
            md: { offset: 4, span: 8 },
            lg: { offset: 2, span: 4 }
        }
    }

    console.log(context.ent)

    // validation of the form
    const Schema = Yup.object().shape();
    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {...context.ent},
        onSubmit: values => {
            console.log(values);
        }
    })


    return(
        <div style={{
            background: "#ffffff",
            minHeight: 700,
            height: "95vh",
            padding: 25
        }}>
            <h3>{t('management.page-title')}</h3>
            <br />
            
            <div>
                <h5>{t('management.subtitle-1')}</h5>
                <hr />

                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column {...scaling.label}>
                            {t('management.company-name')}:
                        </Form.Label>
                        <Col {...scaling.field}>
                            <Form.Control
                                type="text"
                                readOnly
                                value={myformik.values.name}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column {...scaling.label}>
                            {t('management.uid')}:
                        </Form.Label>
                        <Col {...scaling.field}>
                            <Form.Control
                                type="text"
                                readOnly
                                value={myformik.values.uid}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column {...scaling.label}>
                            {t('management.address')}:
                        </Form.Label>
                        <Col {...scaling.field}>
                            <Form.Control
                                type="text"
                                value={myformik.values.address}
                                onChange={myformik.handleChange}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column {...scaling.label}>
                            {t('management.city')}:
                        </Form.Label>
                        <Col {...scaling.field}>
                            <Form.Control
                                type="text"
                                value={myformik.values.city}
                                onChange={myformik.handleChange}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column {...scaling.label}>
                            {t('management.state')}:
                        </Form.Label>
                        <Col {...scaling.field}>
                            <Form.Control
                                type="text"
                                value={myformik.values.state}
                                onChange={myformik.handleChange}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col {...scaling.button}>
                            <Button type="submit" className="w-100">
                                {t('submit')}
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </div>
    )
}