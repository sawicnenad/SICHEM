
import React, { useContext } from 'react';
import MyChart from './MyChart';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



// simpy shows statistics how many
// cas pose high, medium or low risk
export default function RiskChart() {
    const context = useContext(EnterpriseContext);
    const { t } = useTranslation();

    let low = 0;
    let medium = 0;
    let high = 0;
    let notassessed = 0;


    // get all CAS
    let cas = [];
    const aentities = context.aentities;


    for (let i in aentities) {
        cas = cas.concat(aentities[i]['cas_of_aentity']);
    }


    // well if no CAs then no need to proceed
    if (cas.length === 0) {
        return(
            <div className="text-muted text-center p-5 bg-light">
                <FontAwesomeIcon icon="ban" style={{ fontSize: 75 }} />
                <div className="mt-3">
                    {t('enterprise-home.charts.no-cas')}
                </div>
            </div>
        )
    }
    
    // for each CA of aentity calculate risk
    for (let i in cas) {
        let exposure = cas[i].exposure;
        let subID = cas[i].substance;
        let substance = context.substances.find(o => o.id === subID);
        let tox = substance['reg_dnel_lt_d_sys'];
        let risk = 0;

        if (exposure.length === 0) {
            notassessed++;
            continue;
        }
        
        let art = exposure.filter(o => o['exposure_model'] === 'art');
        if (art.length === 1) {
            art = art[0];
            exposure = art['exposure_reg'];
            risk = exposure / tox;

            if (risk >= 1) high++;
            else if (risk >= 0.9) medium++;
            else low++;
            continue;
        } 

        let sm = exposure.filter(o => o['exposure_model'] === 'sm');
        if (sm.length === 1) {
            sm = sm[0];
            exposure = sm['exposure_reg'];
            risk = exposure / tox;

            if (risk >= 1) high++;
            else if (risk >= 0.9) medium++;
            else low++;
            continue;
        }
        
        let tra = exposure.filter(o => o['exposure_model'] === 'tra');
        if (tra.length === 1) {
            tra = tra[0];
            exposure = tra['exposure_reg'];
            risk = exposure / tox;

            if (risk >= 1) high++;
            else if (risk >= 0.9) medium++;
            else low++;
        } 
    }

    // chart data
    const data = [
        {
            label: t('enterprise-home.charts.chart.not-assessed'),
            value: notassessed
        }, {
            label: t('enterprise-home.charts.chart.low-risk'),
            value: low
        }, {
            label: t('enterprise-home.charts.chart.medium-risk'),
            value: medium
        }, {
            label: t('enterprise-home.charts.chart.high-risk'),
            value: high
        }
    ]

    return (
        <div>
            <MyChart 
                data={data}
                colors={['#f7f7f7', '#5cb85c', '#f0ad4e', '#d9534f']} 
            />
            <p className="text-muted mt-3 text-center">
                {t('enterprise-home.charts.chart.title-ae')}
            </p>
        </div>
    )

}