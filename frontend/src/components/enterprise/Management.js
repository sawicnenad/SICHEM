import React, { useContext, useEffect, useState } from 'react';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { Form, Row, Col, Button, Table, Alert, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// enterprise component
// showing details about enterprise (e.g. name, UID, address ...)
// allows management of users (if admin)
// addition of new users (if admin)
export default function Management() {

    const [ users, setUsers ] = useState([]);
    const [ invitation, showInvitation ] = useState(false); // invitation for new user modal
    const [ invitedUser, setInvitedUser ] = useState(false); // recently invited user
    const context = useContext(EnterpriseContext);
    const APIcontext = useContext(ApiRequestsContext);
    const { t } = useTranslation();

    // load user details of the active enterprise
    useEffect(() => {
        axios.get(
            `${APIcontext.API}/enterprise/users/`,
            {headers: {
                Pragma: "no-cache",
                Authorization: 'Bearer ' + localStorage.getItem('token-access')
            }}
        ).then(
            res => setUsers(res.data)
        ).catch(
            e => console.log(e)
        )
    }, [])


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

    // validation of the form
    const Schema = Yup.object().shape();
    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {...context.ent},
        onSubmit: values => {
            console.log(values);
        }
    })


    // general information form
    // name, address, etc
    const EntForm = (
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
                        readOnly
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
                        readOnly
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
                        readOnly
                        value={myformik.values.state}
                        onChange={myformik.handleChange}
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Col {...scaling.button}>
                    <Button 
                        type="submit"
                        variant="danger"
                        className="w-100"
                    > {t('update')}
                    </Button>
                </Col>
            </Form.Group>
        </Form>
    );

    // admin user
    let admin = false;
    if (users.length > 0) {
        admin = users.find(o => o.id === context.ent.admin);
    }

    // Invitation form validation - yup, formik
    const invSchema = Yup.object().shape({
        email: Yup.string().email().required(t('messages.form.required'))
    });
    const invFormik = useFormik({
        validationSchema: invSchema,
        initialValues: {email: ''},
        onSubmit: values => {
            const data = {
                email: values.email,
                enterprise: context.ent.id
            }
            axios.post(
                `${APIcontext.API}/enterprise/invitations/`,
                data,
                {headers: {
                    Pragma: "no-cache",
                    Authorization: 'Bearer ' + localStorage.getItem('token-access')
                }}
            ).then(
                res => {
                    setInvitedUser(res.data);
                    showInvitation(false);
                }
            ).catch(
                e => console.log(e)
            )
        }
    })

  
    return(
        <div style={{
            background: "#ffffff",
            minHeight: 700,
            padding: 25
        }}>
            <div className="bg-light p-3">
                <h3>{t('management.page-title')}</h3>
            </div>
            <br />
            
            <div style={{ marginTop: 25 }}>
                <h5>{t('management.subtitle-1')}</h5>
                <hr />

                { EntForm }
            </div>

            <div style={{ marginTop: 50, marginBottom: 50 }}>
                <h5>{t('management.subtitle-2')}</h5>
                <hr />

                <Button
                    variant="danger"
                    className="my-2"
                    onClick={() => showInvitation(true)}
                > { t('management.invite-new') }
                </Button>

                <Alert variant="info">
                    { t('management.new-user-alert') }
                </Alert>

                {
                    invitedUser ?
                        <Alert variant="success" dismissible onClose={() => setInvitedUser(false)}>
                            { t('management.recently-invited-user') }
                            <p><strong>{invitedUser.email}</strong></p>
                            <p><span>{t('management.token')}</span>: <strong>{invitedUser.token}</strong></p>
                        </Alert> : <div />
                }

                <Table>
                    <thead>
                        <tr>
                            <th>{t('management.table.name')}</th>
                            <th>{t('management.table.email')}</th>
                            <th>{t('management.table.username')}</th>
                            <th>{t('management.table.admin')}</th>
                        </tr>
                    </thead>

                    <tbody>{
                        users.map(
                            user => (
                                <tr key={user.id}>
                                    <td>{user.first_name} {user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username}</td>
                                    <td>
                                        {
                                            admin.id === user.id ?
                                            <FontAwesomeIcon className="text-success" icon="check-square" />
                                            : <FontAwesomeIcon className="text-danger" icon="times" />
                                        }
                                    </td>
                                </tr>
                            )
                        )
                    }</tbody>
                </Table>
            </div>

            <Modal
                show={invitation}
                onHide={() => showInvitation(false)}
            >
               
                <Modal.Header closeButton>
                    <Modal.Title>{t('management.modal.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert
                        variant="info"
                    >{t('management.modal.alert')}</Alert>
                    <Form>
                        <Form.Group>
                            <Form.Label>
                                {t('management.table.email')}
                            </Form.Label>
                            <Form.Control
                                name="email"
                                type="email"
                                required
                                value={invFormik.values.email}
                                onChange={invFormik.handleChange}
                                isInvalid={!!invFormik.errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {invFormik.errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => showInvitation(false)}
                    > {t('cancel')}
                    </Button>
                    <Button variant="danger" onClick={invFormik.handleSubmit}>
                        {t('submit')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}