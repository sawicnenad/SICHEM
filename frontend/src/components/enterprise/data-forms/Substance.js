import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, Col, Button, Accordion, Card, Castom } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';



// create new substance
// edit existing substance
export default function Substance(props) {
    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);

    // fields that are added during the process
    // e.g. international names of substance
    const [addFields, setAddFields] = useState({
        international_names: [0],
        other_names: [0]
    })

    let values = {};
    try {
        let newVal = context.substances
                        .find(
                            o => o.id === parseInt(props.match.params.id)
                        );
        values = newVal ? newVal : {};
    } catch (err) {
        console.log(err);
    }

    // label field scaling
    const scaling = {
        label: {
            md: {span: 3},
            lg: {span: 2, offset: 1}
        }, 
        field: {
            md: 8
        },
        fieldSm: {
            md: 4
        }
    }

    // form fields validation
    const Schema = Yup.object().shape({
        reference: Yup.string()
            .min(2, t('messages.form.too-short'))
            .max(255, t('messages.form.too-long'))
            .required(t('messages.form.required')),
    });

    const formik = (
        <Formik
                validationSchema={Schema}
                initialValues={{
                    reference: values.reference ? values.reference : "",
                    iupac: values.iupac ? values.iupac : "",
                    international_names_0: values.international_names_0 ? values.international_names_0 : ""
                }}
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

                        <Accordion defaultActiveKey="id">





                            <Card>
                                <Accordion.Toggle eventKey="id" as={Card.Header}>
                                    {t('data.sub-menu.id')}
                                </Accordion.Toggle>

                                <Accordion.Collapse eventKey="id">

                                    <Card.Body>
                                        <Accordion defaultActiveKey="naming">





                                            <Card>
                                                <Accordion.Toggle eventKey="naming" as={Card.Header}>
                                                    {t('data.sub-menu.naming')}
                                                </Accordion.Toggle>

                                                <Accordion.Collapse eventKey="naming">
                                                    <Card.Body>
                                                        {/* fields */}
                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.reference')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    type="text" 
                                                                    name="reference"
                                                                    value={values.reference}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!errors.reference}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.reference}
                                                                </Form.Control.Feedback>
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.iupac')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    as="textarea"
                                                                    type="text" 
                                                                    name="iupac"
                                                                    value={values.iupac}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row} className="border border-warning py-2">
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.international-names')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                {
                                                                    addFields.international_names.map(
                                                                        (item, inx) => (
                                                                            <Form.Control 
                                                                                key={inx}
                                                                                required
                                                                                type="text" 
                                                                                name={`international_names_${inx}`}
                                                                                value={values[`international_names_${inx}`]}
                                                                                onChange={handleChange}
                                                                                maxLength={100}
                                                                                className="my-1"
                                                                            />
                                                                        )
                                                                    )
                                                                }
                                                            </Col>
                                                            <Col className="pt-1">
                                                                <Button 
                                                                    disabled={addFields.international_names.length === 5}
                                                                    variant="dark"
                                                                    size="sm"
                                                                    onClick={
                                                                        () => {
                                                                            if (addFields.international_names.length !== 5) {
                                                                                setAddFields({ 
                                                                                    ...addFields,
                                                                                    international_names: [...addFields.international_names, 0]
                                                                                })
                                                                            }
                                                                        }
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon icon="plus" />
                                                                </Button>
                                                            </Col>
                                                        </Form.Group>


                                                        <Form.Group as={Row} className="border border-warning py-2">
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.other-names')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                {
                                                                    addFields.other_names.map(
                                                                        (item, inx) => (
                                                                            <Form.Control 
                                                                                key={inx}
                                                                                required
                                                                                type="text" 
                                                                                name={`other_names_${inx}`}
                                                                                value={values[`other_names_${inx}`]}
                                                                                onChange={handleChange}
                                                                                maxLength={100}
                                                                                className="my-1"
                                                                            />
                                                                        )
                                                                    )
                                                                }
                                                            </Col>
                                                            <Col className="pt-1">
                                                                <Button 
                                                                    disabled={addFields.other_names.length === 5}
                                                                    variant="dark"
                                                                    size="sm"
                                                                    onClick={
                                                                        () => {
                                                                            if (addFields.other_names.length !== 5) {
                                                                                setAddFields({ 
                                                                                    ...addFields,
                                                                                    other_names: [...addFields.other_names, 0]
                                                                                })
                                                                            }
                                                                        }
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon icon="plus" />
                                                                </Button>
                                                            </Col>
                                                        </Form.Group>
                                                        
                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.cas-name')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    type="text" 
                                                                    name="reference"
                                                                    value={values.cas_name}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!errors.reference}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.cas_name}
                                                                </Form.Control.Feedback>
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.cas-nr')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    type="text" 
                                                                    name="reference"
                                                                    value={values.cas_nr}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!errors.reference}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.cas_nr}
                                                                </Form.Control.Feedback>
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.ec-name')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    type="text" 
                                                                    name="reference"
                                                                    value={values.ec_name}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!errors.reference}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.ec_name}
                                                                </Form.Control.Feedback>
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.ec-nr')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    type="text" 
                                                                    name="reference"
                                                                    value={values.ec_nr}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!errors.reference}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.ec_nr}
                                                                </Form.Control.Feedback>
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.ec-dscr')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    as="textarea"
                                                                    type="text" 
                                                                    name="ec_dscr"
                                                                    value={values.ec_dscr}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.index-nr')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    type="text" 
                                                                    name="index_nr"
                                                                    value={values.index_nr}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!errors.index_nr}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.index_nr}
                                                                </Form.Control.Feedback>
                                                            </Col>
                                                        </Form.Group>
                                                        
                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.eu-registration-nr')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    type="text" 
                                                                    name="eu_registration_nr"
                                                                    value={values.eu_registration_nr}
                                                                    onChange={handleChange}
                                                                    isInvalid={!!errors.eu_registration_nr}
                                                                />
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors.eu_registration_nr}
                                                                </Form.Control.Feedback>
                                                            </Col>
                                                        </Form.Group>
                                                        
                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.other-identity-codes')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    as="textarea"
                                                                    type="text" 
                                                                    name="other_identity_codes"
                                                                    value={values.other_identity_codes}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.last-update')}:
                                                            </Form.Label>
                                                            <Col {...scaling.fieldSm}>
                                                                <Form.Control 
                                                                    required
                                                                    type="text" 
                                                                    name="last_update"
                                                                    value={values.last_update}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </Form.Group>

                                                    </Card.Body>
                                                </Accordion.Collapse>

                                            </Card>







                                            <Card>
                                                <Accordion.Toggle eventKey="molecular" as={Card.Header}>
                                                    {t('data.sub-menu.molecular')}
                                                </Accordion.Toggle>

                                                <Accordion.Collapse eventKey="molecular">
                                                    <Card.Body>

                                                        <Form.Group as={Row}>
                                                                <Form.Label column {...scaling.label}>
                                                                    {t('data.substance.molecular-formula')}:
                                                                </Form.Label>
                                                                <Col {...scaling.field}>
                                                                    <Form.Control 
                                                                        required
                                                                        type="text" 
                                                                        name="molecular_formula"
                                                                        value={values.molecular_formula}
                                                                        onChange={handleChange}
                                                                    />
                                                                </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                                <Form.Label column {...scaling.label}>
                                                                    {t('data.substance.structural-formula')}:
                                                                </Form.Label>
                                                                <Col {...scaling.field}>
                                                                    <Form.Control 
                                                                        required
                                                                        type="file" 
                                                                        name="structural_formula"
                                                                        value={values.structural_formula}
                                                                        onChange={handleChange}
                                                                    />
                                                                </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.smiles')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    as="textarea"
                                                                    type="text" 
                                                                    name="smiles"
                                                                    value={values.smiles}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.origin')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    as="select"
                                                                    type="text" 
                                                                    name="origin"
                                                                    value={values.origin}
                                                                    onChange={handleChange}
                                                                >
                                                                    <option value="organic">
                                                                        {t('data.substance.origin.organic')}
                                                                    </option>
                                                                    <option value="organometallic">
                                                                        {t('data.substance.origin.organometallic')}
                                                                    </option>
                                                                    <option value="inorganic">
                                                                        {t('data.substance.origin.inorganic')}
                                                                    </option>
                                                                </Form.Control>
                                                            </Col>
                                                        </Form.Group>
                                                        
                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.mw')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    type="text" 
                                                                    name="mw"
                                                                    value={values.mw}
                                                                    onChange={handleChange}
                                                                />
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.optical_activity_info')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    as="textarea"
                                                                    type="text" 
                                                                    name="optical_activity_info"
                                                                    value={values.optical_activity_info}
                                                                    onChange={handleChange}
                                                                    maxLength={255}
                                                                />
                                                            </Col>
                                                        </Form.Group>

                                                        <Form.Group as={Row}>
                                                            <Form.Label column {...scaling.label}>
                                                                {t('data.substance.isomer_info')}:
                                                            </Form.Label>
                                                            <Col {...scaling.field}>
                                                                <Form.Control 
                                                                    required
                                                                    as="textarea"
                                                                    type="text" 
                                                                    name="isomer_info"
                                                                    value={values.isomer_info}
                                                                    onChange={handleChange}
                                                                    maxLength={255}
                                                                />
                                                            </Col>
                                                        </Form.Group>

                                                    </Card.Body>
                                                </Accordion.Collapse>

                                            </Card>





                                            

                                        </Accordion>
                                    </Card.Body>
                                    
                                </Accordion.Collapse>
                            </Card>






                        </Accordion>
                    </Form>
                )} 
            </Formik>
    );

    return (
        <div className="container-lg my-3">

            <Row>
                <Col>
                    <span style={{ fontSize: 30, fontWeight: 500 }}>
                        {t('data.substance.title')}
                    </span>
                </Col>
                <Col className="text-right">
                    <Button variant="danger" className="m-1">
                        <FontAwesomeIcon icon="trash-alt" /> {t('delete')}
                    </Button>
                    <Button variant="outline-dark" className="m-1">
                        <FontAwesomeIcon icon="save" /> {t('save')}
                    </Button>
                </Col>
            </Row>

            <div className="mt-5">
                { formik }
            </div>
        </div>
    )
}