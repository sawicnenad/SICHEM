import React, { useContext, useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';



// used as a component within CA.js
// opens a modal with a form to set schedule
export default function CAForm(props) {

    const [state, setState] = useState({});
    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);

    const Schema = Yup.object().shape({})
    const formik = useFormik({
        validationSchema: Schema,
        initialValues: {},

        onSubmit: values => {
            props.handleSubmit(values);
            setState({ ...state, show: false });
        }
    })

    // if substance includes defined compositions 
    // display the list of compositions below the substance field
    let compositions = [];
    if (formik.values.substance) {
        let substance = parseInt(formik.values.substance);
        compositions = context.compositions.filter(
                            o => o.substance === substance);
    }

    

    return(
        <div>
            <Button
                variant="danger"
                onClick={() => setState({...state, show: true})}
            >{ t('add-new') }
            </Button><br/><br/>

            <Modal
                show={state.show}
                onHide={() => setState({...state, show: false})}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{ t('data.aentity.ca-modal.title') }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                    <Form.Group>
                        <Form.Label>
                            { t('data.aentity.ca-modal.use-map') }
                        </Form.Label>

                            <Form.Control
                                name="use"
                                as="select"
                                required={true}
                                value={formik.values.use}
                                onChange={formik.handleChange}
                            >
                                <option value=""></option>
                                {
                                    context.uses.map(
                                        use => (
                                            <option key={use.id} value={use.id}>
                                                {use.reference}
                                            </option>
                                        )
                                    )
                                }
                            </Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>
                                    { t('data.aentity.ca-modal.ca') }
                                </Form.Label>

                                {
                                    formik.values.use ?
                                        <Form.Control
                                            name="ca"
                                            as="select"
                                            required={true}
                                            value={formik.values.ca}
                                            onChange={formik.handleChange}
                                        >
                                            <option value=""></option>
                                            {
                                                context
                                                .uses
                                                .find(o => o.id === parseInt(formik.values.use))
                                                .cas.map(
                                                    ca => (
                                                        <option key={ca.id} value={ca.id}>
                                                            {ca.reference}
                                                        </option>
                                                    )
                                            )
                                            }
                                        </Form.Control>
                                        : <Alert variant="danger">
                                            { t('data.aentity.ca-modal.no-use-selected-alert') }
                                        </Alert>
                                }
                            </Form.Group>

                            <Form.Group>
                                <Form.Check
                                    name="isMixture"
                                    label={ t('data.aentity.ca-modal.is-mixture') }
                                    value={formik.values.isMixture}
                                    onChange={formik.handleChange}
                                />
                            </Form.Group>

                            {
                                formik.values.isMixture ?
                                <Form.Group>
                                    <Form.Label>
                                        { t('data.aentity.ca-modal.mixture') }
                                    </Form.Label>

                                    <Form.Control
                                        name="mixture"
                                        as="select"
                                        required={true}
                                        value={formik.values.mixture}
                                        onChange={formik.handleChange}
                                    >
                                        <option value=""></option>
                                        {
                                            context.mixtures.map(
                                                mix => (
                                                    <option key={mix.id} value={mix.id}>
                                                        {mix.reference}
                                                    </option>
                                                )
                                            )
                                        }
                                    </Form.Control>
                                </Form.Group>
                                :<Form.Group>
                                    <Form.Label>
                                        { t('data.aentity.ca-modal.substance') }
                                    </Form.Label>
                                    <Form.Control
                                        name="substance"
                                        as="select"
                                        required={true}
                                        value={formik.values.substance}
                                        onChange={formik.handleChange}
                                    >
                                        <option value=""></option>
                                        {
                                            context.substances.map(
                                                sub => (
                                                    <option key={sub.id} value={sub.id}>
                                                        {sub.reference}
                                                    </option>
                                                )
                                            )
                                        }
                                    </Form.Control>
                                </Form.Group>
                            }
                            {
                                compositions.length > 0 ?
                                <Form.Group>
                                        <Form.Label>
                                            { t('data.aentity.ca-modal.composition') }
                                        </Form.Label>

                                        <Form.Control
                                            name="composition"
                                            as="select"
                                            required={true}
                                            value={formik.values.composition}
                                            onChange={formik.handleChange}
                                        >
                                            <option value=""></option>
                                            {
                                                compositions.map(
                                                    sub => (
                                                        <option key={sub.id} value={sub.id}>
                                                            {sub.reference}
                                                        </option>
                                                    )
                                                )
                                            }
                                        </Form.Control>
                                    </Form.Group>
                                : <div />
                            }

                            {/* exposure models */}
                            <Form.Group>
                                <Form.Label>{t('exposure-models.plural')}:</Form.Label>
                                {
                                    ['art', 'sm', 'tra', 'trexmop'].map(
                                        model => (
                                            <Form.Check
                                                name={model}
                                                key={model}
                                                label={t(`exposure-models.${model}`)}
                                                onChange={formik.handleChange}
                                                value={formik.values[model]}
                                            />
                                        )
                                    )
                                }
                            </Form.Group>
                        </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setState({...state, show: false})}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={formik.handleSubmit}
                    >
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}