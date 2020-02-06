import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Form, Row, Col, Button, Accordion, Card, FormControl } from 'react-bootstrap';
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
    const [exactOrRangeFields, setExactOrRangeFields] = useState({
        ...props.exactOrRangeFields
    })

    // plus button for multi fields
    const handlePlusMultiFieldClick = name => {
        let newMultiFields = {...multiFields};
        newMultiFields[name].push("");
        setMultiFields(newMultiFields);
    }

    // switch between exact and range value entries
    const handleExactOrRangeChange = name => {
        let newState = {...exactOrRangeFields};
        newState[name] = !newState[name];
        setExactOrRangeFields(newState);
    }

    const specialOnChange = e => {
        let fieldName = e.target.name.split('__')[0];
        let inx = e.target.name.split('__')[1];

        if (props.multiFields[fieldName] !== undefined) {
            let newMultiFields = {...multiFields};
            newMultiFields[fieldName][inx] = e.target.value;
            setMultiFields(newMultiFields);
        }
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

    // one field (only field without label or other additional elements)
    // based on its fieldType argument
    const myField = field => {
        switch(field.fieldType) {
            case "after-select-list":
                return(
                    field.elements.map(
                        item => (
                            <Row key={item.name}>
                                <Col xs={8} md={4}>
                                    <Form.Group as={Row}>
                                        <Form.Label column {...scaling.label}>
                                            { t(item.label) }:
                                        </Form.Label>
                                        <Form.Control 
                                            {...scaling.field}
                                            name={item.name}
                                            type="text"
                                            onChange={formik.handleChange}
                                            value={formik.values[item.name]}
                                            isInvalid={!!formik.errors[field.name]}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={4} md={2}>
                                    <Form.Control
                                        className="border-warning"
                                        name={item.afterName}
                                        as="select"
                                        value={formik.values[item.afterName]}
                                        onChange={formik.handleChange}
                                        isInvalid={!!formik.errors[item.afterName]}
                                    >
                                        {
                                            field.afterOptions[item.afterOptions].map(
                                                option => (
                                                    <option value={option.value} key={option.value}>
                                                        { option.label }
                                                    </option> 
                                                )
                                            )
                                        }
                                    </Form.Control>
                                </Col>
                            </Row>
                        )
                    )
                )
            case "checkbox-list":
                return(
                    field.elements.map(
                        item => (
                            <Form.Check
                                {...field.props}
                                name={item.name}
                                label={t(item.label)}
                                onChange={formik.handleChange}
                            />)
                    )
                );
            case "after-input-select": 
                return(
                    <Row>
                        <Col xs={4}>
                            <Form.Control
                                { ...field.props }
                                value={formik.values[field.props.name]}
                                onChange={
                                    field.specialOnChange ? 
                                    specialOnChange : formik.handleChange
                                }
                                isInvalid={!!formik.errors[field.props.name]}
                            />
                        </Col>

                        <Col xs={5}>
                            <Form.Group as={Row}>
                                <Form.Label column className="text-right">
                                    {t(field.labelAfterInput)}:
                                </Form.Label>
                                <Col xs={8}>
                                    <Form.Control
                                        className="border-warning"
                                        type="text"
                                        name={field.afterInput}
                                        placeholder={t(field.afterInputPlaceholder)}
                                        value={formik.values[field.props.name]}
                                        onChange={
                                            field.specialOnChange ? 
                                            specialOnChange : formik.handleChange
                                        }
                                        isInvalid={!!formik.errors[field.props.name]}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col xs={3}>
                            <Form.Control
                                className="border-warning"
                                name={field.afterSelect}
                                as="select"
                                value={formik.values[field.after]}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors[field.after]}
                            >
                                {
                                    field.afterOptions.map(
                                        item => (
                                            <option value={item.value} key={item.value}>
                                                { item.label }
                                            </option> 
                                        )
                                )}
                            </Form.Control>
                        </Col>
                    </Row>
                )
            case "after-select":
                return(
                    <Row>
                        <Col xs={8} md={4}>
                            <Form.Control
                                { ...field.props }
                                value={formik.values[field.props.name]}
                                onChange={
                                    field.specialOnChange ? 
                                    specialOnChange : formik.handleChange
                                }
                                isInvalid={!!formik.errors[field.props.name]}
                            />
                        </Col>

                        <Col xs={4} md={2}>
                            <Form.Control
                                className="border-warning"
                                name={field.after}
                                as="select"
                                value={formik.values[field.after]}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors[field.after]}
                            >
                                {
                                    field.afterOptions.map(
                                        item => (
                                            <option value={item.value} key={item.value}>
                                                { item.label }
                                            </option> 
                                        )
                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Row>
                );
            case "custom": 
                return(
                    <div>
                        {props.custom[field.component]}
                    </div>
                )
            case "exact-or-range":
                return(
                    <div>
                        {
                            exactOrRangeFields[field.props.name] ?
                            <Row>
                                <Col>
                                    <Form.Control
                                        { ...field.props }
                                        name={field.props.name + "__exact"}
                                        value={formik.values[field.props.name]}
                                        onChange={
                                            field.specialOnChange ? 
                                            specialOnChange : formik.handleChange
                                        }
                                        isInvalid={!!formik.errors[field.props.name]}
                                    />
                                </Col>
                                
                                <Col className="text-right">
                                    <Button
                                        variant="light"
                                        onClick={() => handleExactOrRangeChange(field.props.name)}
                                    >
                                        {
                                            exactOrRangeFields[field.props.name] ?
                                            t('data.buttons.range-value')
                                            : t('data.buttons.exact-value')
                                        }
                                    </Button>
                                </Col>
                            </Row>
                            :
                            <Row>
                                <Col>
                                    <Form.Control
                                        { ...field.props }
                                        name={field.props.name + "__lower"}
                                        value={formik.values[field.props.name]}
                                        onChange={
                                            field.specialOnChange ? 
                                            specialOnChange : formik.handleChange
                                        }
                                        isInvalid={!!formik.errors[field.props.name]}
                                    />
                                </Col>
                                <Col xs={1} style={{fontSize: 20}} className="pt-1 text-center">
                                    -
                                </Col>
                                <Col>
                                    <Form.Control
                                        { ...field.props }
                                        name={field.props.name + "__upper"}
                                        value={formik.values[field.props.name]}
                                        onChange={
                                            field.specialOnChange ? 
                                            specialOnChange : formik.handleChange
                                        }
                                        isInvalid={!!formik.errors[field.props.name]}
                                    />
                                </Col>
                                <Col className="text-right">
                                    <Button
                                        variant="light"
                                        onClick={() => handleExactOrRangeChange(field.props.name)}
                                    >
                                        {
                                            exactOrRangeFields[field.props.name] ?
                                            t('data.buttons.range-value')
                                            : t('data.buttons.exact-value')
                                        }
                                    </Button>
                                </Col>
                            </Row>
                        }
                    </div>
                );
            case "select":
                return(
                    <Form.Control
                        { ...field.props }
                        value={formik.values[field.props.name]}
                        onChange={
                            field.specialOnChange ? 
                            specialOnChange : formik.handleChange
                        }
                        isInvalid={!!formik.errors[field.props.name]}
                    >
                        {
                            field.optgroups ?
                            field.options.map(
                                item => 
                                    <optgroup label={ t(item.label) } key={item.label}>
                                        {
                                            item.options.map(
                                                option => 
                                                    <option value={option.value} key={option.value}>
                                                        {t(option.label)}
                                                    </option>
                                            )
                                        }
                                    </optgroup>
                            )
                            : 
                            field.options.map(
                                item => 
                                    <option value={item.value} key={item.value}>
                                        { t(item.label) }
                                    </option>
                            )
                        }
                    </Form.Control>
                );
            case "multi":
                return(
                    <div className={
                            multiFields[field.props.name].length > 1 ?
                            "p-4 border border-warning" : ""
                    }>
                        {multiFields[field.props.name].map(
                        (e,inx) => (
                            <Form.Control
                                key={inx}
                                className={ inx !== 0 ? "mt-2": "" }
                                { ...field.props }
                                name={`${field.props.name}__${inx}`}
                                value={multiFields[field.props.name][inx]}
                                onChange={
                                    field.specialOnChange ? 
                                    specialOnChange : formik.handleChange
                                }
                                isInvalid={!!formik.errors[field.props.name]}
                            />
                        )
                    )}</div>
                );
            default:
                return(
                    <Form.Control
                        { ...field.props }
                        value={formik.values[field.props.name]}
                        onChange={
                            field.specialOnChange ? 
                            specialOnChange : formik.handleChange
                        }
                        isInvalid={!!formik.errors[field.props.name]}
                    />
                )

        }
    }


    // based on the list of field names for each item in return method
    // and those defined in json file -> create form controls
    const createFields = fields => (
        <div>
            { fields.map(item => 
                (
                    data.fields[item].fieldType === "title" ?
                    <div {...data.fields[item].props } style={{ fontSize: 18 }}>
                        <strong>{ t(data.fields[item].title) }</strong>
                    </div>
                    : <Form.Group as={ Row } key={item}>
                        {
                            data.fields[item].label ?
                            <Form.Label column {...scaling.label}>
                                { t(data.fields[item].label) }:
                            </Form.Label> : <div />
                        }

                        <Col {...scaling.field} {...data.fields[item].scaling}>
                            
                            { myField(data.fields[item]) }

                            <Form.Control.Feedback type="invalid">
                                {formik.errors[item]}
                            </Form.Control.Feedback>
                        </Col>
                        {
                            data.fields[item].fieldType === "multi" ?
                            <Col>
                                <Button 
                                    size="sm"
                                    className="mt-1"
                                    variant="light"
                                    onClick={ () => handlePlusMultiFieldClick(item) }
                                >
                                    <FontAwesomeIcon icon="plus" />
                                </Button>
                            </Col>
                            : <div />
                        }
                    </Form.Group>)
            )}
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
        <div className="container my-3">
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