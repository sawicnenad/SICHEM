import React, { useContext, useState } from 'react';
import useJSON from '../../../json/data-forms/use.json';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import DataForm from './DataForm';
import { useTranslation } from 'react-i18next';
import ContributingActivity from './ContributingActivity';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import RequestNotification from '../../notifications/RequestNotification';
import { Alert, Row, Col } from 'react-bootstrap'; 
import SWED from './SWED';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext.js';
import axios from 'axios';


const scaling = {
    label: {
        md: { span: 3 },
        lg: { span: 2, offset: 1 }
    }, 
    field: { md: 7 },
    fieldSm: { md: 4 }
}


/*
    while uses.js in parent folder shows all uses
    here we edit a single use and its ca and swed data
*/
export default function Use(props) {
    const { t } = useTranslation();
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);
    const useID = parseInt(props.match.params.id);
    const useValues = entContext.uses.find(o => o.id === useID);
    const [ state, setState ] = useState({ 
        sameCAnameMsg : false,
        updatedMsg: false
    });

    // const headers used later for all axios requests
    const headers = {
        headers: {
            Pragma: "no-cache",
            Authorization: 'Bearer ' + localStorage.getItem('token-access')
        }
    }

    // YUP and formik --------------------------------------------
    const Schema = Yup.object().shape({
        reference: Yup.string().required(t('messages.form.required'))
    })

    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: {...useValues},
        onSubmit: values => {
            axios.put(
                `${APIcontext.API}/uses/${useID}/`,
                values,
                headers
            ).then(
                res => {
                    let uses = [...entContext.uses];
                    uses = uses.filter(o => o.id !== useID);
                    uses.push(res.data);
                    setState({...state, updatedMsg: true});
                    entContext.refreshState('uses', uses);
                }
            ).catch(
                e => console.log(e)
            )
        }
    })

    // delete function for delete button in header
    const handleDelete = () => {

    }


    // CUSTOM FIELDS 
    // Contributing activities and SWEDs

    // handles addition of new contributing activity to use
    // passed to <ContributingActivity /> below
    const addContAct = (values, doUpdate, prevRef) => {
        let cas = [...myformik.values.cas];

        // update existing ca
        if (doUpdate === true) {
            cas = cas.filter(o => o.reference !== prevRef);
            cas.push(values);
            myformik.setFieldValue('cas', cas);
            return;
        }

        // checks if a CA with the same reference name exists
        try{
            console.log(cas.find(o => o.reference === values.reference).reference);
            setState({ ...state, sameCAnameMsg : true });
        } catch(e) {
            // only if unique CA reference name
            values = {...values, use: useID};
            cas.push(values);
            myformik.setFieldValue('cas', cas);
        }
    }

    // removes contributing activity
    // as no id is assigned yet -> because the given CA is not saved on server
    // we remove it based on the position in the list .cas
    const deleteContAct = reference => {
        let cas = [...myformik.values.cas];
        cas = cas.filter(o => o.reference !== reference);
        myformik.setFieldValue('cas', cas);
    }

    // Contributing activity custom field
    const ca = (
        <ContributingActivity 
            cas={myformik.values.cas}
            scaling={scaling}
            addContAct={addContAct}
            deleteContAct={deleteContAct}
        />
    );

    // SWED ----------------------------------

    // Function updating the SWED related data of CA
    const updateSWED = (values, reference) => {
        let cas = [...myformik.values.cas];
        let ca = cas.find(o => o.reference === reference);
        cas = cas.filter(o => o.reference !== reference);
        
        // update values of ca selected based on the reference name
        for (let key in values) {
            ca[key] = values[key];
        }
        cas.unshift(ca);
        myformik.setFieldValue('cas', cas);
    }

    const swed = (
        <SWED
            cas={myformik.values.cas}
            scaling={scaling}
            updateSWED={updateSWED}
        />
    )

    return(
        <div className="container-lg px-5 py-3">
            <DataForm
                data={useJSON}
                scaling={scaling}
                formik={myformik}
                title={t('data.use.title')}
                close='/enterprise/uses'
                handleDelete={handleDelete}
                custom={{
                    ca: ca,
                    swed: swed,
                    help: (
                        <Row>
                            <Col {...scaling.label}></Col>
                            <Col {...scaling.field}>
                                <Alert
                                variant="info"
                            >
                                {t('messages.hold-ctrl')} 
                            </Alert>
                            </Col>
                        </Row>)
                }}
            />

            {/* Notifications */}
            <RequestNotification
                show={state.sameCAnameMsg}
                msgFailed={t('messages.same-reference-name')}
                onClose={() => setState({ ...state, sameCAnameMsg : false })}
            />

            <RequestNotification
                success
                show={state.updatedMsg}
                msgSuccess={t('messages.use-updated')}
                onClose={() => setState({ ...state, updatedMsg : false })}
            />
        </div>
    )
}