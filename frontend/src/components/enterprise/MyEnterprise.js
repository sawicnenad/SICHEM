import React, { useState } from 'react';
import { Alert, Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';

function MyEnterprise() {
    const { t } = useTranslation();
    const [state, setState] = useState({
        modalNewUser: false,
        modalNewEnt: false
    })

    // two cards: new member of existing or create new enterprise
    const cards = [
        {
            border: "primary",
            icon: require('../../media/icons/people.svg'),
            title: t('enterprise.my-enterprise.card-new-member-title'),
            text: t('enterprise.my-enterprise.card-new-member-text'),
            action: "#"
        }, {
            border: "danger",
            icon: require('../../media/icons/building.svg'),
            title: t('enterprise.my-enterprise.card-new-ent-title'),
            text: t('enterprise.my-enterprise.card-new-ent-text'),
            action: "#"
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
                <h3 className="text-muted mb-4">
                    { t('enterprise.my-enterprise.options-header') }
                </h3>

                <Row>
                    {cards.map(item => (
                        <Col xs={6} lg={4}>
                            <Card border={item.border}>
                                <Card.Img 
                                    style={{ height: 125 }}
                                    src={item.icon}
                                    variant="top"
                                />

                                <Card.Body>
                                    <Card.Title>
                                        { item.title }
                                    </Card.Title>

                                    <Card.Text className="text-muted text-justify" style={{ height: 80 }}>
                                        { item.text }
                                    </Card.Text>
                                </Card.Body>

                                <Button variant={item.border}>
                                    { t('confirm') }
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* registration modals */}
            <Modal
                show={true}
                onHide={() => setState({ ...state, modalNewEnt: false })}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        { t('enterprise.my-enterprise.card-new-ent-title') }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <NewEntForm />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">
                        { t('cancel') }
                    </Button>
                    <Button variant="danger">
                        { t('confirm') }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default MyEnterprise;




function NewEntForm(props) {
    const { t } = useTranslation();

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
        <Formik
            validationSchema={Schema}
            onSubmit={values => {
                console.log(values)
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
                </Form>
            )} 
        </Formik>
    )
}