import React, { useContext, useState } from 'react';
import DataForm from './DataForm';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import data from '../../../json/data-forms/mixture.json';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import RequestNotification from '../../notifications/RequestNotification';
import HazardProfile from './HazardProfile';
import subFunJson from '../../../json/data-forms/subFunInMix.json';
import {
    Button, Row, Col, Alert, Modal, Form, Table
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




// scaling of label/fields in DataForm
const scaling = {
    label: {
        md: { span: 3 },
        lg: { span: 2, offset: 1 }
    }, 
    field: { md: 7 },
    fieldSm: { md: 4 }
}







export default function Mixture(props){
    const [ state, setState ] = useState({
        updatedMsg: false,
        failedMsg: false,
        modal: false
    })
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);

    const { t } = useTranslation();

    // to get corresponding data - initial values for this mixture we neee its id
    // which is contained in the url
    const mixID = parseInt( props.match.params.id );

    // const headers used later for all axios requests
    const headers = {
        headers: {
            Pragma: "no-cache",
            Authorization: 'Bearer ' + localStorage.getItem('token-access')
        }
    }

    const Schema = Yup.object().shape({
        reference: Yup.string()
                    .required(t('messages.form.required'))
                    .max(50, t('messages.form.too-long'))
    })

    // set initial values
    let mixture = {...entContext.mixtures.find(o => o.id === mixID)};
    if (mixture.pc !== "") { mixture.pc = JSON.parse(mixture.pc) }

    mixture.physical_hazard = mixture.physical_hazard ? JSON.parse(mixture.physical_hazard) : "";
    mixture.health_hazard = mixture.health_hazard ? JSON.parse(mixture.health_hazard) : "";
    mixture.environmental_hazard = mixture.health_hazard ? JSON.parse(mixture.environmental_hazard) : "";
    mixture.additional_hazard = mixture.health_hazard ? JSON.parse(mixture.additional_hazard) : "";
    mixture.components = JSON.parse(mixture.components);

    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: mixture,
        onSubmit: values => {

            let data = {...values};
            data.pc = JSON.stringify(data.pc);
            
            // hazards must be strignified also
            data.physical_hazard = JSON.stringify(data.physical_hazard);
            data.health_hazard = JSON.stringify(data.health_hazard);
            data.environmental_hazard = JSON.stringify(data.environmental_hazard);
            data.additional_hazard = JSON.stringify(data.additional_hazard);
            data.components = JSON.stringify(data.components);

            axios.put(
                `${APIcontext.API}/mixtures/${mixID}/`,
                data,
                headers
            ).then(
                res => {
                    let mixtures = [...entContext.mixtures];
                    mixtures = mixtures.filter(o => o.id !== mixID);
                    mixtures.push(res.data);
                    entContext.refreshState('mixtures', mixtures);
                    setState({...state, updatedMsg: true});
                }
            ).catch(
                e => console.log(e)
            )
        }
    })

    // delete function of the mixture
    const handleDelete = () => {
        axios.delete(
            `${APIcontext.API}/mixtures/${mixID}/`,
            headers
        ).then(
            () => {
                console.log("deleted");
                let mixtures = entContext.mixtures;
                mixtures = mixtures.filter(o => o.id !== mixID);
                entContext.refreshState('mixtures', mixtures);
                props.history.push("/enterprise/chemicals/mixtures")
            }
        ).catch(
            e => console.log(e)
        )
    }

    // hazard (as for substance)
    const hazardProfile = (
        <div>
            <HazardProfile
                scaling={scaling}
                formik={myformik}
            />
        </div>
    )


    //-----------------------------------------------------------
    // SUBSTANCE COMPONENTS OF THE MIXTURE
    const CompSchema = Yup.object().shape({
        substance: Yup.number().min(1, t('messages.form.required'))
    })

    const compformik = useFormik({
        validationSchema: CompSchema,
        initialValues: {
            substance: 0,
            typical_conc: ""
        },
        onSubmit: values => {
            let components = [...myformik.values.components];
            components = components.filter(o => o.id !== values.substance);
            components.push(values);
            myformik.setFieldValue("components", components);
            setState({ ...state, modal : false })
        }
    })

    // delete component from mixture
    const handleComponentDelete = sub => {
        let components = [...myformik.values.components];
        components = components.filter(o => o.substance !== sub);
        myformik.setFieldValue("components", components);
    }
    
    // substances or components of the mixture
    // saved as json file (stringified) in myformik.components
    const components = (
        <Row>
            <Col {...scaling.label}>
                { t('data.mixture.components') }:
            </Col>
            <Col {...scaling.field}>
                <div>
                    <Button 
                        variant="outline-danger" size="sm"
                        onClick={() => setState({ ...state, modal : true })}
                    >
                        { t('add-new') }
                    </Button>
                </div>

                <div className="mt-3">
                    {
                        myformik.values.components.length === 0
                        ?
                        <Alert variant="warning">
                            { t('data.mixture.alert-no-components') }
                        </Alert> 
                        :
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th rowSpan="2">.</th>
                                    <th rowSpan="2">{ t('data.mixture.table.component') }</th>
                                    <th colSpan="3" className="text-center">
                                        { t('data.mixture.table.concentration') }
                                    </th>
                                    <th rowSpan="2">{ t('data.mixture.table.ac') }</th>
                                    <th rowSpan="2">{ t('data.mixture.table.function') }</th>
                                </tr>
                                <tr>
                                    <th>{ t('data.mixture.table.typical-conc') }</th>
                                    <th>{ t('data.mixture.table.min-conc') }</th>
                                    <th>{ t('data.mixture.table.max-conc') }</th>
                                </tr>
                            </thead>
                            {
                                myformik.values.components.map(
                                    component => (
                                        <tr key={component.substance}>
                                            <td>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm" 
                                                    className="border-0"
                                                    onClick={() => handleComponentDelete(component.substance)}
                                                >
                                                    <FontAwesomeIcon icon="trash-alt" />
                                                </Button>
                                            </td>
                                            <td>{ entContext.substances
                                                    .find(
                                                        o => o.id === parseInt(component.substance))
                                                    .reference 
                                            }</td>
                                            <td>{ component.typical_conc }</td>
                                            <td>{ component.min_conc }</td>
                                            <td>{ component.max_conc }</td>
                                            <td>{ component.ac }</td>
                                            <td>{ 
                                                t( subFunJson
                                                    .find(o => o.value === component.function)
                                                    ?
                                                    subFunJson
                                                    .find(o => o.value === component.function).label
                                                    : "" )
                                            }</td>
                                        </tr>
                                    )
                                )
                            }
                        </Table>
                    }
                </div>
            </Col>

            <Modal
                show={state.modal}
                onHide={() => setState({...state, modal : false})}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{ t('data.mixture.modal-title') }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>{ t('data.substance.reference') }:</Form.Label>
                            <Form.Control
                                required
                                name="substance"
                                as="select"
                                value={compformik.values.substance}
                                onChange={compformik.handleChange}
                                isInvalid={!!compformik.errors.substance}
                            >
                                <option value={0}></option>
                                {
                                    entContext.substances.map(
                                        sub => (
                                            <option value={sub.id} key={sub.id}>
                                                { sub.reference }
                                            </option>
                                        )
                                    )
                                }
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {compformik.errors.substance}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Row>
                            <Form.Label column md="12">{t('data.mixture.modal.concentrations')}:</Form.Label>
                            <Col md="3">
                                <Form.Control 
                                    type="number"
                                    min={0.0001}
                                    max={100}
                                    name="typical_conc"
                                    value={compformik.values.typical_conc}
                                    onChange={compformik.handleChange}
                                    isInvalid={!!compformik.errors.typical_conc}
                                    placeholder={ t('data.mixture.modal.typical-conc') }
                                />
                            </Col>
                            <Col md="1"></Col>
                            <Col md="3">
                                <Form.Control 
                                    type="number"
                                    min={0.0001}
                                    max={100}
                                    name="min_conc"
                                    value={compformik.values.min_conc}
                                    onChange={compformik.handleChange}
                                    isInvalid={!!compformik.errors.min_conc}
                                    placeholder={ t('data.mixture.modal.min-conc') }
                                />
                            </Col>
                            <Col md="1" className="text-center">_</Col>
                            <Col md="3">
                                <Form.Control 
                                    type="number"
                                    min={0.0001}
                                    max={100}
                                    name="max_conc"
                                    value={compformik.values.max_conc}
                                    onChange={compformik.handleChange}
                                    isInvalid={!!compformik.errors.max_conc}
                                    placeholder={ t('data.mixture.modal.max-conc') }
                                />
                            </Col>
                        </Form.Row>

                        <Form.Group className="mt-3">
                            <Form.Label>{ t('data.mixture.modal.ac') }:</Form.Label>
                            <Form.Control 
                                    type="number"
                                    min={0.0001}
                                    max={40}
                                    name="ac"
                                    value={compformik.values.ac}
                                    onChange={compformik.handleChange}
                                    isInvalid={!!compformik.errors.ac}
                                    className="w-50"
                                />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{ t('data.mixture.modal.sub-function') }:</Form.Label>
                            <Form.Control
                                name="function"
                                as="select"
                                value={compformik.values.function}
                                onChange={compformik.handleChange}
                            >
                                {
                                    subFunJson.map(
                                        item => (
                                            <option value={item.value} key={item.value}>
                                                { t(item.label) }
                                            </option>
                                        )
                                    )
                                }
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{ t('data.mixture.modal.info') }:</Form.Label>
                            <Form.Control
                                as="textarea"
                                type="text"
                                name="info"
                                value={compformik.values.info}
                                onChange={compformik.handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={() => setState({...state, modal : false})}
                    >
                        { t('close') }
                    </Button>
                    <Button variant="danger" onClick={() => compformik.handleSubmit()}>
                        { t('save') }
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    )

    return(
        <div>
            <DataForm
                data={data}
                scaling={scaling}
                formik={myformik}
                title={t('data.mixture.title')}
                close='/enterprise/chemicals/mixtures'
                handleDelete={handleDelete}
                custom={{
                    components: components,
                    hazard: hazardProfile
                }}
            />

            {/* Notifications */}
            <RequestNotification
                success
                show={state.updatedMsg}
                msgSuccess={t('messages.mixture-updated')}
                onClose={() => setState({ ...state, updatedMsg: false })}
            />

            <RequestNotification
                show={state.failedMsg}
                onClose={() => setState({ ...state, failedMsg: false })}
            />
        </div>
    )
}