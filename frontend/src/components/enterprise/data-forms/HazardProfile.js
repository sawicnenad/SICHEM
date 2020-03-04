import React, { Children, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, Card, Form, Row, Col, Alert } from 'react-bootstrap';
import hazardsJSON from '../../../json/hazards.json';
import hazardClassesJSON from '../../../json/hazardClasses.json';
import { useFormik } from 'formik';
import * as Yup from 'yup';


/*
    hazard profile is a component used by both
    substances and mixtures
*/
export default function HazardProfile(props) {
    const { t } = useTranslation();

    /*
        Form is a simple one field form containing
        list of hazard classes and categories

        * user selects options in a multiple select field
        and the corresponding data for signal word, 
        pictograms, disposal, reaction etc appear below
    */
    
    const form = (options, height, name) => {
        return(
            <Form.Group as={Row}>
                <Form.Label column {...props.scaling.label}>
                    { t('data.substance.hazard-class-cat') }:
                </Form.Label>

                <Col {...props.scaling.field}>
                    <Form.Control
                        as="select"
                        multiple
                        name={name}
                        value={props.formik.values[name]}
                        style={{ height: height }}
                        onChange={props.formik.handleChange}
                    >
                        {
                            options.map(
                                item => (
                                    <optgroup label={item.label}>{
                                        item.children.map(
                                            child => (
                                                <option value={child.value}>
                                                    { child.label }
                                                </option>
                                            )
                                        )
                                    }</optgroup>
                                )
                            )
                        }
                    </Form.Control>
                </Col>
            </Form.Group>
        )
    }





    /*
        Following code is related to the formating of corresponding hazard data:

            * pictograms
            * hazard statement
            * signal word
            * prevention
            * reaction
            * storage
            * disposal
    */

    const hazard = htype => {
        const selected = props.formik.values[htype];
        let signalword = "warning";

        let data = {
            pictogram: [],
            statement: [],
            hazardcode: [],
            prevention: [],
            storage: [],
            reaction: [],
            disposal: []
        }

        for (let key in data) {
            for (let i in selected){
                
                // only if not already contained
                // avoid duplicates
                let entries = [];
                try {
                    entries = hazardsJSON[selected[i]][key];
                } catch(e) { console.log(e) }

                for (let e in entries) {
                    if (data[key].indexOf(entries[e]) === -1) {
                        try{
                            data[key].push(entries[e]);
                        } catch(e) { console.log(e) }
                    }
                }
            }
        }

        data.signalword = signalword;
        return (
            <Col md={{ offset: 3 }}>
                <div>{
                    data.pictogram.map(
                        item => (
                            <img 
                                key={item}
                                src={require(`../../../media/pictograms/${item}.png`)}
                                alt=""
                                width={125}
                                className="m-2"
                            />
                        )
                    )
                }</div>

                {
                    data.statement.length > 0 ?
                        <div className="mt-3">
                            <div className="font-weight-bold text-danger">
                                { t('data.substance.hazards.hazard-statement' )}:
                            </div>
                            {
                                data.statement.map(
                                    (item, inx) => (
                                        <div key={inx} className="pl-3">
                                            {item}
                                        </div>
                                    )
                                )
                            }
                        </div> : <div />
                }

                {
                    data.hazardcode.length > 0 ?
                        <div className="mt-3">
                            <div className="font-weight-bold text-danger">
                                { t('data.substance.hazards.hazard-code' )}:
                            </div>
                            {
                                data.hazardcode.map(
                                    (item, inx) => (
                                        <div key={inx} className="pl-3">
                                            {item}
                                        </div>
                                    )
                                )
                            }
                        </div> : <div />
                }

                {
                    data.prevention.length > 0 ?
                    <div className="mt-3">
                        <div className="font-weight-bold text-danger">
                            { t('data.substance.hazards.prevention' )}:
                        </div>
                        {
                            data.prevention.map(
                                (item, inx) => (
                                    <span key={inx} className="ml-3">
                                        {item}
                                    </span>
                                )
                            )
                        }
                    </div> : <div />
                }

                {
                    data.storage.length > 0 ?
                        <div className="mt-3">
                            <div className="font-weight-bold text-danger">
                                { t('data.substance.hazards.storage' )}:
                            </div>
                            {
                                data.storage.map(
                                    (item, inx) => (
                                        <span key={inx} className="ml-3">
                                            {item}
                                        </span>
                                    )
                                )
                            }
                        </div> : <div />
                }
                    
                {
                    data.reaction.length > 0 ?
                        <div className="mt-3">
                            <div className="font-weight-bold text-danger">
                                { t('data.substance.hazards.reaction' )}:
                            </div>
                            {
                                data.reaction.map(
                                    (item, inx) => (
                                        <span key={inx} className="ml-3">
                                            {item}
                                        </span>
                                    )
                                )
                            }
                        </div> : <div />
                }

                {
                    data.disposal.length > 0 ?
                        <div className="mt-3">
                            <div className="font-weight-bold text-danger">
                                { t('data.substance.hazards.disposal' )}:
                            </div>
                            {
                                data.disposal.map(
                                    (item, inx) => (
                                        <span key={inx} className="ml-3">
                                            {item}
                                        </span>
                                    )
                                )
                            }
                        </div> : <div />
                }
            </Col>
        )
    }



    return (
        <Accordion>

            {[
                {
                    eventKey: "physical_hazard",
                    hazard: "physicalHazard",
                    height: 300,
                    label: t('data.substance.physical-hazard')
                }, {
                    eventKey: "health_hazard",
                    hazard: "healthHazard",
                    height: 300,
                    label: t('data.substance.health-hazard')
                }, {
                    eventKey: "environmental_hazard",
                    hazard: "environHazard",
                    height: 175,
                    label: t('data.substance.environmental-hazard')
                }, {
                    eventKey: "additional_hazard",
                    hazard: "otherHazard",
                    height: 75,
                    label: t('data.substance.other-hazard')
                }
            ].map(
                item => (
                    <Card key={item.eventKey}>
                        <Accordion.Toggle as={Card.Header} eventKey={item.eventKey}>
                            { item.label }
                        </Accordion.Toggle>

                        <Accordion.Collapse eventKey={item.eventKey}>
                            <Card.Body>
                                <Row>
                                    <Col md={{ offset: 3, span: 7 }}>
                                        <Alert
                                            variant="info"
                                            className="mb-4"
                                        >{t('data.substance.hazards.help-text')}
                                        </Alert>
                                    </Col>
                                </Row>
                                { form(hazardClassesJSON[item.hazard], item.height, item.eventKey) }

                                <div>
                                    { hazard(item.eventKey) }
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )
            )}
        </Accordion>
    )
}