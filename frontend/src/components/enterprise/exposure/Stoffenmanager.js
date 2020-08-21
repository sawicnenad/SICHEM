import React, { useContext, useState, useEffect } from 'react';
import DataForm from '../data-forms/DataForm';
import StoffenmanagerForm from '../../../json/exposure-models/stoffenmanager.json';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ApiRequestsContext } from '../../../contexts/ApiRequestsContext';
import { Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



/*
    STOFFENMANAGER

    - allows data entry for an arbitrary (not linked to the core data) ES
    - when id supplied in props, it loads the corresponding exposure instance
*/
export default function Stoffenmanager(props) {

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
            let data = props.exposureData.find(o => o['exposure_model'] === 'sm');
            let parameters = data.parameters;
            let values = JSON.parse(parameters);

            for (let key in values) {
                if (values[key] === false && ['nf', 'ff1', 'ff2', 'bg1', 'bg2'].indexOf(key) === -1) {
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



    const Schema = Yup.object().shape();
    const formik = useFormik({
        validationSchema: Schema,
        initialValues: {},
        onSubmit: values => {
            console.log(values)
        }
    })


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

    return(
        <div>
            <DataForm
                data={StoffenmanagerForm}
                scaling={{ label: { md: 3 }, field: { md: 7 } }}
                formik={formik}
                title={t('sm.form-title')}
                closeFun={props.handleCloseButton}
                handleDelete={() => null}
                noDeleteButton
                noZebraStyle
                custom={{
                    results: Results
                }}
            />
        </div>
    )
}