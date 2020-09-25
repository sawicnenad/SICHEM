import React, { useState } from 'react';
import { Row, Col, Alert, Table, Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import SWEDJSON from '../../../json/data-forms/swed.json';
import DataForm from './DataForm.js';

/*
    *Basically SWED 
    defined for each CA in Use map
    and thus used only in Use.js

    *Input parameters in SWED are part of CA model!

    *New SWED cannot be added or removed as its number
    is dictated by the number of contributing activities
*/
export default function SWED(props) {
    const { t } = useTranslation();
    const [ state, setState ] = useState({ modal : false, reference: false });

    const Schema = Yup.object().shape({
        reference: Yup.string().required(t('messages.form.required'))
    })
    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {},
        onSubmit: values => {
            props.updateSWED(values, state.reference);
            setState({ ...state, modal : false, reference : false });
        }
    })

    // when edit button is clicked it returns CA reference for editing
    const handleEdit = reference => {
        let ca = { ...props.cas.find(o => o.reference === reference) };
        myformik.setValues(ca);
        setState({ ...state, modal : true, reference: ca.reference });
    }

    return (
        <div>
            <div>
                {
                    props.cas.length === 0
                    ?
                    <Alert
                        variant="warning"
                    >{ t('messages.no-data-for-this-page') }
                    </Alert>
                    :<Table>
                        <thead>
                                <tr>
                                    <th>.</th>
                                    <th>{ t('data.use.ca.reference') }</th>
                                    <th>{ t('data.use.swed.info-process-table') }</th>
                                    <th>{ t('data.use.swed.standard-phrase-table') }</th>
                                </tr>
                        </thead>
                        <tbody>{
                            props.cas.map(
                                (ca, inx) => (
                                    <tr key={inx}>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                className="border-0"
                                                onClick={() => handleEdit(ca.reference)}
                                            >
                                                { t('edit') }
                                            </Button> 
                                        </td>
                                        <td>
                                            { ca.reference }
                                        </td>
                                        <td>
                                            { ca.info_process }
                                        </td>
                                        <td>
                                            { ca.standard_phrase }
                                        </td>
                                    </tr>
                                )
                            )
                        }</tbody>
                    </Table>
                }
            </div>

            <Modal
                show={state.modal}
                onHide={() => setState({ modal : false })}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title> {t('data.use.swed.modal-title')} </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <DataForm 
                        data={SWEDJSON}
                        formik={myformik}
                        noZebraStyle={true}
                        scaling={{ label: { md: 4 }, field: { md: 8 } }}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setState({ ...state, modal: false })}
                    >
                        {t('close')}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={myformik.handleSubmit}
                    >
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}