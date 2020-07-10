import React, { useState, useContext } from 'react';
import formDataJSON from '../../../json/data-forms/component.json';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
    Modal,
    Button
} from 'react-bootstrap';
import DataForm from './DataForm.js';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import RequestNotification from '../../notifications/RequestNotification';


/*
    this component is part of composition component
    * may also be used elsewhere to create/edit components
*/
export default function Component() {
    const { t } = useTranslation();
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);

    // Component form (within modal) visibility
    const [modal, setModal] = useState(false);
    const [notif, setNotif] = useState(false);


    // Yup scheme and formik for component form
    const myScheme = Yup.object().shape({
        reference: Yup.string().required(t('messages.form.required'))
    })
    
    const myFormik = useFormik({
        validationSchema: myScheme,
        initialValues: {
            reference: "",
            cas_name: "",
            cas_nr: "",
            ec_name: "",
            ec_nr: "",
            molecular_formula: "",
            iupac: ""
        },
        onSubmit: values => {
            const data = {...values, enterprise: entContext.ent.id};
            const headers = {
                headers: {
                    Pragma: "no-cache",
                    Authorization: 'Bearer ' + localStorage.getItem('token-access')
                }};
            
            axios.post(`${APIcontext.API}/components/`, data, headers)
                .then( res => {
                    let comps = [...entContext.components];
                    comps.push(res.data);
                    entContext.refreshState('components', comps);
                    setModal(false);
                    setNotif('success');
                } )
                .catch(e => {
                    console.log(e);
                    setNotif('error');
                })
        }
    })

    return (
        <div>
            <Button size="sm" variant="outline-danger" onClick={() => setModal(true)}>
                {t('new')}
            </Button>

            <Modal
                show={modal}
                onHide={() => setModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {t('data.component.title')}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <DataForm
                        noZebraStyle={true}
                        data={formDataJSON}
                        scaling={{ field: { md : 7 }, label: { md: 5 } }}
                        formik={myFormik}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModal(false)}>
                        {t('close')}
                    </Button>

                    <Button variant="danger" onClick={myFormik.handleSubmit}>
                        {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Notifications */}
            <RequestNotification
                success
                show={notif === 'success'}
                msgSuccess={t('messages.component-added')}
                onClose={() => setNotif(false)}
            />

            <RequestNotification
                show={notif === 'error'}
                onClose={() => setNotif(false)}
            />
        </div>
    )
}