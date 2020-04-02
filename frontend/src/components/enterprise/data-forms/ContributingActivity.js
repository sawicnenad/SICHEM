import React, { useState } from 'react';
import DataForm from './DataForm';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Row, Col, Button, Modal, Alert, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import caJSON from '../../../json/data-forms/ca.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


// used as part of use map in Use.js
// does not send axios requests but returns list of cont.activities
export default function ContributingActivity(props) {
    const { t } = useTranslation();
    const [ state, setState ] = useState({
        modal: false,
        prevRef: false
    })

    const Schema = Yup.object().shape({
        reference: Yup.string().required(t('messages.form.required'))
    })

    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {},
        onSubmit: values => {
            props.addContAct(values, state.prevRef !== false, state.prevRef);
            setState({ ...state, modal : false, prevRef : false });
        }
    })

    // handles opening of modal to edit a given ca
    const handleEditModalOpen = reference => {
        let ca = { ...props.cas.find(o => o.reference === reference) };
        myformik.setValues(ca);
        setState({ ...state, modal : true, prevRef: ca.reference });
    }

    // list of contributing activities for the given Use Map
    // if no CAs added -> show alert
    const listOfCAs = (
        <div className="mt-3">
            {
                props.cas.length === 0
                ?
                <Alert
                    variant="warning"
                >
                    { t('messages.no-data-for-this-page') }
                </Alert>
                : <div>
                    <div className="text-danger font-weight-bold mb-2">
                        { t('data.use.ca.list-of-cas')}:
                    </div>
                    
                    <Table striped>
                        <thead>
                            <tr>
                                <th>
                                    .
                                </th>
                                <th>
                                    { t('data.use.ca.reference') }
                                </th>
                                <th>
                                    { t('data.use.ca.proc') }
                                </th>
                            </tr>
                        </thead>
                        <tbody>{
                            props.cas.map(
                                (item, inx) => (
                                    <tr key={inx}>
                                        <td >
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                className="border-0"
                                                onClick={() => props.deleteContAct(item.reference)}
                                            >
                                                <FontAwesomeIcon icon="trash-alt" />
                                            </Button> 
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                className="border-0"
                                                onClick={ () => handleEditModalOpen(item.reference) }
                                            >
                                                { t('edit') }
                                            </Button> 
                                        </td>
                                        
                                        <td>
                                            { item.reference }
                                        </td>

                                        <td>
                                            { item.proc ? t(`data.use.proc-options.${ item.proc }`) : "" }
                                        </td>
                                    </tr>
                                )
                            )
                        }</tbody>
                    </Table>
                </div>
            }
        </div>
    )

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
                        size="lg"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>{ t('data.use.ca.modal-title') }</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <DataForm
                                data={caJSON}
                                formik={myformik}
                                noZebraStyle={true}
                                scaling={{ label: { md: 4 }, field: { md: 8 } }}
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

                    <div>
                        { listOfCAs }
                    </div>
                </Col>
            </Row>
        </div>
    )
}
