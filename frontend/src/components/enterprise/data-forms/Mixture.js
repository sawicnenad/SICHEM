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
        failedMsg: false
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

    mixture.physical_hazard =       JSON.parse(mixture.physical_hazard);
    mixture.health_hazard =         JSON.parse(mixture.health_hazard);
    mixture.environmental_hazard =  JSON.parse(mixture.environmental_hazard);
    mixture.additional_hazard =     JSON.parse(mixture.additional_hazard);

    const myformik = useFormik({
        validationSchema: Schema,
        initialValues: mixture,
        onSubmit: values => {
            values.pc = JSON.stringify(values.pc);
            
            // hazards must be strignified also
            values.physical_hazard = JSON.stringify(values.physical_hazard);
            values.health_hazard = JSON.stringify(values.health_hazard);
            values.environmental_hazard = JSON.stringify(values.environmental_hazard);
            values.additional_hazard = JSON.stringify(values.additional_hazard);

            axios.put(
                `${APIcontext.API}/mixtures/${mixID}/`,
                values,
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

    // substances or components of the mixture
    // saved as json file (stringified) in myformik.components
    const components = (
        <div>
            components
        </div>
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