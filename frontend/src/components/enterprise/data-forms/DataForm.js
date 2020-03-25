import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, Col, Button, Accordion, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

/*
    component for all data entries by enterprise
    substances, mixtures, uses, contributing activities

    ...to avoid long components with tens/hundreds
    form control components...we place instructions in json files
*/
export default function DataForm(props) {
    const { t } = useTranslation();
    const data = props.data;

    // one field (only field without label or other additional elements)
    // based on its fieldType argument
    const myField = field => {
        switch(field.fieldType) {
            case "after-select-list":
                return(
                    field.elements.map(
                        (item, inx) => (
                            <Form.Group 
                                key={inx}
                                as={Row}
                            >
                                <Form.Label column { ...props.scaling.label }>
                                    { t(item.label) }:
                                </Form.Label>
                                <Col xs={8} md={3}>
                                    <Form.Control 
                                        {...props.scaling.field}
                                        name={item.name}
                                        type="text"
                                        onChange={props.formik.handleChange}
                                        value={props.formik.values[item.name]}
                                        isInvalid={!!props.formik.errors[field.name]}
                                    />
                                </Col>

                                <Col xs={4} md={3}>
                                    <Form.Control
                                        name={item.afterName}
                                        as="select"
                                        value={props.formik.values[item.afterName]}
                                        onChange={props.formik.handleChange}
                                        isInvalid={!!props.formik.errors[item.afterName]}
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
                            </Form.Group>
                        )
                    )
                )
            case "checkbox-list":
                return(
                    field.elements.map(
                        item => (
                            <Form.Check
                                key={item.name}
                                {...field.props}
                                name={item.name}
                                label={t(item.label)}
                                checked={props.formik.values[item.name]}
                                onChange={props.formik.handleChange}
                            />)
                    )
                );
            case "after-input-select": 
                return(
                    <Form.Group as={Row}>
                        <Form.Label column {...props.scaling.label}>
                            { t(field.label) }:
                        </Form.Label>
                        <Col xs={4} md={3}>
                            <Form.Control
                                { ...field.props }
                                value={props.formik.values[field.props.name]}
                                onChange={props.formik.handleChange}
                                isInvalid={!!props.formik.errors[field.props.name]}
                            />
                        </Col>

                        <Col xs={5} md={3}>
                            <Form.Group as={Row}>
                                <Form.Label column className="text-right" xs={4}>
                                    {t(field.labelAfterInput)}:
                                </Form.Label>
                                <Col xs={8}>
                                    <Form.Control
                                        type="text"
                                        name={field.afterInput}
                                        placeholder={t(field.afterInputPlaceholder)}
                                        value={props.formik.values[field.afterInput]}
                                        onChange={props.formik.handleChange}
                                        isInvalid={!!props.formik.errors[field.props.name]}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col xs={3} md={2}>
                            <Form.Control
                                name={field.afterSelect}
                                as="select"
                                value={props.formik.values[field.after]}
                                onChange={props.formik.handleChange}
                                isInvalid={!!props.formik.errors[field.after]}
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
                    </Form.Group>
                )
            case "after-select":
                return(
                    <Form.Group as={Row}>
                        <Form.Label column {...props.scaling.label}>
                            { t(field.label) }
                        </Form.Label>
                        <Col xs={8} md={3}>
                            <Form.Control
                                { ...field.props }
                                value={props.formik.values[field.props.name]}
                                onChange={props.formik.handleChange }
                                isInvalid={!!props.formik.errors[field.props.name]}
                            />
                        </Col>

                        <Col xs={4} md={2}>
                            <Form.Control
                                name={field.after}
                                as="select"
                                value={props.formik.values[field.after]}
                                onChange={props.formik.handleChange}
                                isInvalid={!!props.formik.errors[field.after]}
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
                    </Form.Group>
                );
            case "custom": 
                return(
                    <div>
                        {props.custom[field.component]}
                    </div>
                )
            case "exact-or-range":
                return(
                    <Form.Group as={Row}>
                        <Form.Label column {...props.scaling.label}>
                            { t(field.label) }
                        </Form.Label>

                        <Col {...props.scaling.field}>
                        {
                            JSON.parse(props.formik.values[field.props.name]).length < 2 ?
                            <Row>
                                <Col md="4">
                                    <Form.Control
                                        { ...field.props }
                                        name={field.props.name + "__exact"}
                                        value={JSON.parse(props.formik.values[field.props.name])[0]}
                                        onChange={e => props.handleChangeSpecial(field.props.name, e.target.value, 0)}
                                        isInvalid={!!props.formik.errors[field.props.name]}
                                    />
                                </Col>
                                
                                <Col className="text-left">
                                    <Button
                                        variant="light"
                                        onClick={() => props.handleFieldButtonClicks("range", field.props.name)}
                                    >
                                        <FontAwesomeIcon icon="exchange-alt" /> <span>
                                        {
                                           JSON.parse(props.formik.values[field.props.name]).length < 2 ?
                                            t('data.buttons.range-value')
                                            : t('data.buttons.exact-value')
                                        }</span>
                                    </Button>
                                </Col>
                            </Row>
                            :
                            <Row>
                                <Col>
                                    <Form.Control
                                        { ...field.props }
                                        name={field.props.name + "__lower"}
                                        value={JSON.parse(props.formik.values[field.props.name])[0]}
                                        onChange={e => props.handleChangeSpecial(field.props.name, e.target.value, 0)}
                                        isInvalid={!!props.formik.errors[field.props.name]}
                                    />
                                </Col>
                                <Col xs={1} style={{fontSize: 20}} className="pt-1 text-center">
                                    -
                                </Col>
                                <Col>
                                    <Form.Control
                                        { ...field.props }
                                        name={field.props.name + "__upper"}
                                        value={JSON.parse(props.formik.values[field.props.name])[1]}
                                        onChange={e => props.handleChangeSpecial(field.props.name, e.target.value, 1)}
                                        isInvalid={!!props.formik.errors[field.props.name]}
                                    />
                                </Col>
                                <Col className="text-left">
                                    <Button
                                        variant="light"
                                        onClick={() => props.handleFieldButtonClicks("exact", field.props.name)}
                                    >
                                        <FontAwesomeIcon icon="exchange-alt" /> <span>
                                        {
                                            JSON.parse(props.formik.values[field.props.name]).length < 2 ?
                                            t('data.buttons.range-value')
                                            : t('data.buttons.exact-value')
                                        }</span>
                                    </Button>
                                </Col>
                            </Row>
                        }
                        </Col>
                    </Form.Group>
                );
            case "select":
                return(
                    <Form.Group as={Row}>
                        <Form.Label column {...props.scaling.label}>
                            { t(field.label) }
                        </Form.Label>
                        <Col {...props.scaling.field}>
                            <Form.Control
                                { ...field.props }
                                value={props.formik.values[field.props.name]}
                                onChange={props.formik.handleChange}
                                isInvalid={!!props.formik.errors[field.props.name]}
                            >
                                {
                                    field.props.multiple ?
                                    "" : <option value="" disabled></option>
                                }
                                {
                                    field.optgroups ?
                                    field.options.map(
                                        item => 
                                            item.options ? 
                                            <optgroup label={ t(item.label) } key={item.label}>
                                                {
                                                    item.options.map(
                                                        option => 
                                                            <option value={option.value} key={option.value}>
                                                                { t(option.label) }
                                                            </option>
                                                    )
                                                }
                                            </optgroup>
                                            : <option value={item.value} key={item.value}>
                                                { t(item.label) }
                                            </option>
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
                        </Col>
                    </Form.Group>
                );
            case "multi":
                return(
                    <Form.Group as={Row}>
                        <Form.Label column {...props.scaling.label}>
                            { t(field.label) }
                        </Form.Label>
                        <Col {...props.scaling.field}>
                            {JSON.parse( props.formik.values[ field.props.name ] ).map(
                                (e,inx) => (
                                    <Form.Control
                                        key={inx}
                                        className={ inx !== 0 ? "mt-2": "" }
                                        { ...field.props }
                                        name={`${field.props.name}__${inx}`}
                                        value={ JSON.parse( props.formik.values[ field.props.name ] )[inx] }
                                        onChange={
                                            e => (
                                                props.handleChangeSpecial(field.props.name, e.target.value, inx)
                                            )}
                                    />
                                ))
                            }
                        </Col>
                        <Col>
                            <Button 
                                size="sm"
                                className="mt-1"
                                variant="secondary"
                                onClick={ () => props.handleFieldButtonClicks(field.fieldType, field.props.name) }
                            >
                                <FontAwesomeIcon icon="plus" />
                            </Button>
                        </Col>
                        
                    </Form.Group>
                );
            case "file":
                return(
                    <Form.Group as={Row}>
                        <Form.Label column {...props.scaling.label}>
                            { t(field.label) }:
                        </Form.Label>
                        <Col {...props.scaling.field} {...field.scaling}>
                            <Form.Control
                                { ...field.props }
                                value={props.formik.values[field.props.name] ? props.formik.values[field.props.name].filename : ""}
                                onChange={e =>
                                    field.fieldType === 'file' ?
                                    props.handleChangeSpecial(e.target.name, e.target.files[0])
                                    : props.formik.handleChange(e)
                                }
                                isInvalid={!!props.formik.errors[field.props.name]}
                            />

                            {
                                // IMG FILES
                                field.fileType === 'img' &&  
                                typeof(props.formik.values[field.props.name]) !== 'object' &&
                                props.formik.values[field.props.name] 
                                ? 
                                <div className="mt-4 p-2 border rounded text-center">
                                    <img 
                                        src={props.formik.values[field.props.name]}
                                        alt="" 
                                        height={100} 
                                    />
                                </div>
                                : <div />
                            }

                            {
                                // PDF FILES
                                field.fileType !== 'img' &&  
                                typeof(props.formik.values[field.props.name]) !== 'object' &&
                                props.formik.values[field.props.name] 
                                ? 
                                <div className="mt-2">
                                    <a target="_blank" href={ props.formik.values[field.props.name] }>
                                        <FontAwesomeIcon icon='file-pdf' className="mr-2" color="#dc3545" />
                                        { t('data.uploaded-file') }
                                    </a>
                                </div>
                                : <div />
                            }
                        </Col>
                    </Form.Group>
                )
            default:
                return (
                    <Form.Group as={Row}>
                        <Form.Label column {...props.scaling.label}>
                            { t(field.label) }:
                        </Form.Label>
                        <Col {...props.scaling.field} {...field.scaling}>
                            <Form.Control
                                { ...field.props }
                                value={props.formik.values[field.props.name]}
                                onChange={props.formik.handleChange}
                                isInvalid={!!props.formik.errors[field.props.name]}
                            />
                            <Form.Control.Feedback type="invalid">
                                { props.formik.errors[field.props.name] }
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                )

        }
    }

    /*
        json file contains also condition rules
        * inter-field links
        * if conditions are fulfilled
        * - shown
        * otherwise
        * - hidden
    */
    const checkVisibility = field => {
        // if no conditions defined -> field visible by default
        if (field.conditions === undefined) {
            return true;
        }

        // otherwise check if conditions are fulfilled
        const conditions = field.conditions;
        let isOK = true;

        for (let i in conditions) {
            let condField = conditions[i].field;
            let condValue = conditions[i].value;

            switch(conditions[i].type){
                default:
                    if (props.formik.values[condField] !== condValue) {
                        isOK = false;
                    }
                    break;
            }
        }

        return isOK;
    }


    // based on the list of field names for each item in return method
    // and those defined in json file -> create form controls
    const createFields = fields => (
        <div>
            { fields.map((item, inx) => 
                checkVisibility(data.fields[item]) ?
                (
                    data.fields[item].fieldType === "title" ?
                    <div {...data.fields[item].props } style={{ fontSize: 16 }} key={inx}>
                        <strong>{ t(data.fields[item].title) }</strong>
                    </div>
                    : <div 
                        key={inx}
                        className={
                            inx % 2 === 0 && !props.noZebraStyle && 
                            data.fields[item].fieldType !== "after-select-list" &&
                            data.fields[item].noBackground !== true
                            ?
                            "bg-light pt-3 pb-1" : "pt-3"
                        }>
                        { myField( data.fields[item] ) }
                    </div>) : ""
            )}
        </div>
    )
    

    const form = (
        <Form onSubmit={ props.formik.handleSubmit }>
            {
                data.noCards ?
                <div>{createFields(data.fieldsOrdered)}</div>
                :<Accordion defaultActiveKey={data.defaultActiveKey}>{
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
                }</Accordion>
            }
        </Form>);

    // return method reads json data and creates return component
    // fields are split into different cards/collapse/accordions
    // two level nested accordions are supported (should be enough)

    const funButtons = (
        data.noFunButtons ?
        <div />
        :<Row>
            <Col>
                <span className="font-weight-bold text-muted" style={{ fontSize: 30 }}>
                    { props.title }
                </span>
            </Col>

            <Col className="text-right">
                <Link to={props.close}>
                    <Button variant="light" className="ml-1 border">
                        <FontAwesomeIcon icon="times" /> { t('close') }
                    </Button>
                </Link>

                <Button variant="light" className="ml-1 border" onClick={props.handleDelete}>
                    <FontAwesomeIcon icon="trash-alt" /> { t('delete') }
                </Button>

                <Button
                    variant="danger"
                    className="ml-1"
                    onClick={props.formik.handleSubmit}
                >
                    <FontAwesomeIcon icon="save" /> { t('save') }
                </Button>
            </Col>
        </Row>);

    return (
        <div className="container my-3">
            { funButtons }
            <div className={props.formClassName ? props.formClassName : "mt-3"}>
                { form }
            </div>
        </div>
    )
}