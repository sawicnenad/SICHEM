import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Form, Row, Col, Button, Accordion, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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


/*
    component for all data entries by enterprise
    substances, mixtures, uses, contributing activities

    ...to avoid long components with tens/hundreds
    form control components...we place instructions in json files
*/
export default function DataForm(props) {
    const { t } = useTranslation();
    const data = props.data;

    // multi fields are those that can be added in production
    // e.g. international names of a substance
    // they also require a different onChange method
    const [multiFields, setMultiFields] = useState({
        ...props.multiFields
    })

    // plus button for multi fields
    const handlePlusMultiFieldClick = name => {
        let newMultiFields = {...multiFields};
        newMultiFields[name].push("");
        setMultiFields(newMultiFields);
    }

    const specialOnChange = e => {
        console.log(e.target.name)
    }

    // instead of using Formik component
    // we use formik hook
    // this allows us to access values
    // outside return method
    const formik = useFormik({
        validationSchema: props.schema,
        initialValues: {
            ...props.initialValues
        },
        onSubmit: values => {
            props.handleSubmit(values)
        }
    })


    // based on the list of field names for each item in return method
    // and those defined in json file -> create form controls
    const createFields = fields => (
        <div>
            { fields.map(item => (
                <Form.Group as={ Row } key={item}>
                    <Form.Label column {...scaling.label}>
                        { t(data.fields[item].label) }:
                    </Form.Label>

                    <Col {...scaling.field}>
                        
                        {
                            data.fields[item].multi ?
                            multiFields[item].map(
                                (e,inx) => (
                                    <Form.Control
                                        key={inx}
                                        className={ inx !== 0 ? "mt-2": "" }
                                        { ...data.fields[item].props }
                                        name={`${item}${inx}`}
                                        value={multiFields[item][inx]}
                                        onChange={
                                            data.fields[item].specialOnChange ? 
                                            specialOnChange : formik.handleChange
                                        }
                                        isInvalid={!!formik.errors[item]}
                                    />
                                )
                            ) :
                            <Form.Control
                                { ...data.fields[item].props }
                                value={formik.values[item]}
                                onChange={
                                    data.fields[item].specialOnChange ? 
                                    specialOnChange : formik.handleChange
                                }
                                isInvalid={!!formik.errors[item]}
                            />
                        }

                        <Form.Control.Feedback type="invalid">
                            {formik.errors[item]}
                        </Form.Control.Feedback>
                    </Col>
                    {
                        data.fields[item].multi ?
                        <Col>
                            <Button 
                                size="sm"
                                className="mt-1"
                                variant="outline-dark"
                                onClick={ () => handlePlusMultiFieldClick(item) }
                            >
                                <FontAwesomeIcon icon="plus" />
                            </Button>
                        </Col>
                        : <div />
                    }
                </Form.Group>
            ))}
        </div>
    )
    

    const form = (
        <Form onSubmit={ formik.handleSubmit }>
            <Accordion defaultActiveKey={data.defaultActiveKey}>
            {
                data.cards.map(
                    item => (
                        <Card key={item.eventKey}>
                            <Accordion.Toggle eventKey={item.eventKey} as={Card.Header}>
                                { t( item.label ) }
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={item.eventKey}>
                                <Card.Body>
                                    {
                                        item.children ?
                                            <Accordion defaultActiveKey={item.defaultActiveKey}>
                                                {
                                                    item.children.map(
                                                        itemc => (
                                                            <Card key={itemc.eventKey}>
                                                                <Accordion.Toggle eventKey={itemc.eventKey} as={Card.Header}>
                                                                    { t( itemc.label ) }
                                                                </Accordion.Toggle>
                                                                <Accordion.Collapse eventKey={itemc.eventKey}>
                                                                    <Card.Body>
                                                                        { createFields(itemc.fields) }
                                                                    </Card.Body>
                                                                </Accordion.Collapse>
                                                            </Card>
                                                        )
                                                    )
                                                }
                                            </Accordion>
                                        : createFields(item.fields)
                                    }
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    )  
                )
            }           
            </Accordion>
        </Form>);

    // return method reads json data and creates return component
    // fields are split into different cards/collapse/accordions
    // two level nested accordions are supported (should be enough)
    return (
        <div className="container mt-3">
            <div>
                <Row>
                    <Col>
                        <span className="font-weight-bold text-muted" style={{ fontSize: 30 }}>
                            { props.title }
                        </span>
                    </Col>

                    <Col className="text-right">
                        <Button variant="dark" className="ml-1">
                            <FontAwesomeIcon icon="trash-alt" /> { t('delete') }
                        </Button>

                        <Button variant="danger" className="ml-1">
                            <FontAwesomeIcon icon="save" /> { t('save') }
                        </Button>
                    </Col>
                </Row>
            </div>

            <div className="mt-3">
                { form }
            </div>
        </div>
    )
}