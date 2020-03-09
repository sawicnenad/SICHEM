import React, { useState, useContext } from 'react';
import supplierJSON from '../../../json/data-forms/supplier.json';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import DataForm from './DataForm';
import { useTranslation } from 'react-i18next';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext.js';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext.js';
import axios from 'axios';
import RequestNotification from '../../notifications/RequestNotification.js';


// available at /enterprise/supplier/:id
// if id === 0, new supplier -> otherwise we edit an exiting one
export default function Supplier (props) {

    const [ state, setState ] = useState({
        failedMsg: false,
        successMsg: false,
        updateMsg: false
    });

    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);
    const APIcontext = useContext(ApiRequestsContext);

    // Supplier id (if editing an existing one) is in match.params
    const supplierID = parseInt(props.match.params.id);

    // for axios request below -> on submit request in formik
    const headers = {
        headers: {
            Pragma: "no-cache",
            Authorization: 'Bearer ' + localStorage.getItem('token-access')
        }
    }

    const schema = Yup.object().shape({
        origin: Yup.string()
            .required(t('messages.form.required')),
        name: Yup.string()
            .required(t('messages.form.required')),
        address: Yup.string()
            .required(t('messages.form.required'))
    });
    
    // if :id !== 0 -> we must load from context corresponding
    // supplier data and assign them to the initial values of formik
    let initialValues = {
        origin: "",
        name: "",
        address: "",
        info: ""
    };

    if (supplierID !== 0) {
        let supplier = context.suppliers.find(o => o.id === supplierID);
        initialValues = supplier;
    }

    const myformik = useFormik({
        validationSchema: schema,
        onSubmit: values => {
            let method = 'post';
            let url = APIcontext.API + '/suppliers/';

            // well, if subID is not zero, we send put request
            if (supplierID !== 0) {
                method = 'put';
                url = `${url}${supplierID}/`;
            }
            axios[method](
                url,
                {...values, enterprise: context.ent.id},
                headers
            ).then(
                res => {
                    let suppliers = [...context.suppliers];
                    suppliers = suppliers.filter(o => o.id !== supplierID);
                    suppliers.push(res.data);
                    context.refreshState('suppliers', suppliers);

                    // send notification
                    if (supplierID === 0) {
                        setState({
                            ...state,
                            successMsg: true
                        });
                        props.history.push(`/enterprise/supplier/${res.data.id}`);
                    } else {
                        setState({
                            ...state,
                            updateMsg: true
                        });
                    }
                }
            ).catch(
                () => setState({...state, failedMsg: true})
            )
        },
        initialValues: initialValues
    })


    // request to delete supplier
    // passed to dataform component
    const handleDelete = id => {
        axios.delete(
            APIcontext.API + '/suppliers/' + supplierID + '/',
            headers
        ).then(
            () => {
                let suppliers = context.suppliers.filter(o => o.id !== supplierID);
                context.refreshState('suppliers', suppliers);
                props.history.push('/enterprise/chemicals/suppliers/');
            }
        ).catch(
            () => setState({...state, failedMsg: true})
        )
    }

    // we need fun buttons is this case
    // those in header: save, close and delete
    // thus we modify our json
    supplierJSON.noFunButtons = false;

    return (
        <div>
             <DataForm
                formClassName="p-5 mt-2 bg-light"
                noZebraStyle={true}
                data={supplierJSON}
                scaling={{ label: { xs: 3 }, field: { xs: 7 } }}
                formik={myformik}
                title={t('data.supplier.title')}
                close='/enterprise/chemicals/suppliers'
                handleDelete={handleDelete}
            />

            {/* notifications */}
            <RequestNotification
                show={state.failedMsg}
                onClose={() => setState({ ...state, failedMsg: false })}
            />

            <RequestNotification
                success
                show={state.successMsg}
                msgSuccess={t('messages.supplier-added')}
                onClose={() => setState({ ...state, successMsg: false })}
            />

            <RequestNotification
                success
                show={state.updateMsg}
                msgSuccess={t('messages.supplier-updated')}
                onClose={() => setState({ ...state, updateMsg: false })}
            />
        </div>
    )
}