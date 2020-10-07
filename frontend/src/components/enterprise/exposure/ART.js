import React, { useContext, useEffect, useState } from 'react';
import ARTForm from '../../../json/exposure-models/art.json';
import DataForm from '../data-forms/DataForm';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext.js';
import { Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/*
    Advanced REACH Tool (ART)

    - allows data entry for an arbitrary (not linked to the core data) ES
    - when id supplied in props, it loads the corresponding exposure instance
*/
export default function ART(props) {

    const { t } = useTranslation();
    const APIcontext = useContext(ApiRequestsContext);
    const [state, setState] = useState({
        exposure: {},
        missing: [],
        status: false
    });

    const headers = {
        headers: {
            Pragma: "no-cache",
            Authorization: 'Bearer ' + localStorage.getItem('token-access')
        }};


    // if props contain exposure data then values are overpased
    // after parsing the values that did not pass verification 
    // has 'false' assigned and these must be removed from the object
    // this must be skiped for checkbox fields as it prevents later changes
    useEffect(() => {
        if (props.exposureData) {
            let data = props.exposureData.find(o => o['exposure_model'] === 'art');
            if (!data) return;
            console.log(data)
            let parameters = data.parameters;
            let values = JSON.parse(parameters);

            for (let key in values) {
                if (values[key] === false && ['nf', 'ff'].indexOf(key) === -1) {
                     values[key] = "" 
                }
            }
            formik.setValues(values);

            // update state
            // needed to settle exposure data
            // exposure results and missing parameters
            let exposure = JSON.parse(data.exposure);
            let missing = JSON.parse(data.missing);
            setState({
                exposure: exposure,
                missing: missing,
                status: data.status
            });
        }
    }, [props])


    // validation scheme and formik
    const Schema = Yup.object().shape({});
    const formik = useFormik({
        validationSchema: Schema,
        initialValues: { nf: true, ff: false },
        onSubmit: values => {
            // id of exposure instance needed to make post request
            let data = {...props.exposureData.find(
                o => o['exposure_model'] === 'art')}; 

            axios.put(
                `${APIcontext.API}/exposure/exposures/${data.id}/`,
                values,
                headers
            ).then(
                res => {
                    // update state
                    // needed to settle exposure data
                    // exposure results and missing parameters
                    let exposure = JSON.parse(res.data.exposure);
                    let missing = JSON.parse(res.data.missing);
                    setState({
                        exposure: exposure,
                        missing: missing,
                        status: res.data.status
                    });
                }
            ).catch(
                e => console.log(e)
            )
        },
    })




    // Results of exposure assessment
    // this component is integral part of the last accordion card
    const Results = (
        <div>
            <div>
                <Button
                    variant="outline-danger"
                    className="w-100"
                    onClick={formik.handleSubmit}
                ><FontAwesomeIcon 
                    icon="calculator"
                /> <span>
                        {t('exposure.assessment.calculate')}
                    </span>
                </Button>
            </div>


            <div>
                <div style={{ 
                        marginTop: 25,
                        fontSize: 22,
                        textAlign: "center" 
                    }}
                >
                    <span>
                        { t('exposure.exposure') } = 
                    </span> <span>
                        { state.exposure.p95 } mg/m<sup>3</sup>
                    </span>
                </div>

                <div className="mt-2">
                    <Alert variant="info">
                        <FontAwesomeIcon icon="info-circle"
                        /> <span>
                            {t('exposure.assessment.rec-exposure-value')}
                        </span>
                    </Alert>
                </div>
            </div>
        </div>
    )





    // -------------------------------------------------------------------
    return (
        <div>
            <DataForm
                data={ARTForm}
                scaling={{ label: { md: 3 }, field: { md: 7 } }}
                formik={formik}
                title={t('art.form-title')}
                closeFun={props.handleARTcloseButton ? 
                    props.handleARTcloseButton
                    : () => props.history.push('/enterprise')
                }
                handleDelete={() => null}
                noDeleteButton
                noSaveButton={props.match ? true : false}
                custom={{ results: Results }}
            />
        </div>
    )
}