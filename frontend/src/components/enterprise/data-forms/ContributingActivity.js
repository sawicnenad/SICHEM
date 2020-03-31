import React, { useState } from 'react';
import DataForm from './DataForm';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import caJSON from '../../../json/data-forms/ca.json';



// used as part of use map in Use.js
// does not send axios requests but returns list of cont.activities
export default function ContributingActivity(props) {
    const { t } = useTranslation();
    const [ state, setState ] = useState({
        modal: false
    })

    const Schema = Yup.object().shape({

    })

    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {},
        onSubmit: values => {
            console.log(values)
        }
    })

    return(
        <div>
            <Row>
                <Col {...props.scaling.label}>
                    { t('data.use.ca.label') }:
                </Col>

                <Col {...props.scaling.field}>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setState({...state, modal: true})}
                    >
                        {t('add-new')}
                    </Button>

                    <Modal
                        show={state.modal}
                        onHide={() => setState({...state, modal: false})}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>{ t('data.use.ca.modal-title') }</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <DataForm
                                data={caJSON}
                                formik={myformik}
                                noZebraStyle={true}
                                scaling={{ label: { xs: 12 }, field: { xs: 12 } }}
                            />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button 
                                variant="secondary"
                                onClick={() => setState({...state, modal: false})}
                            >{t('close')}</Button>
                            <Button 
                                variant="danger"
                                onClick={myformik.handleSubmit}
                            >{t('save')}</Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </div>
    )
}
