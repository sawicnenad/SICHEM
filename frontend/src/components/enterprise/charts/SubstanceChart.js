import React, { useContext } from 'react';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import MyChart from './MyChart';
import { useTranslation } from 'react-i18next';





// shows fractions of unassessed and assessed substances
// how many have low, medium or high risk to the health
export default function SubstanceChart() {

    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);
    const substances = context.substances;
    const aentities = context.aentities;
    let cas = [];

    // gets all cas from aentities
    for (let i in aentities) {
        cas = cas.concat(aentities[i]['cas_of_aentity']);
    }


    let noAssignedCA = 0;
    let nonAssessed = 0;
    let noTox = 0;
    let low = 0;
    let medium = 0;
    let high = 0;


    for (let i in substances) {
        // filter all cas that contain a substance
        let subInCA = cas.filter(o => o.substance === substances[i].id);
        if (subInCA.length === 0) {
            noAssignedCA++;
            continue;
        }

        // if CA contain substance
        // get risk that was evaluated
        // but first check if it has Tox value specified
        if (!substances[i]['reg_dnel_lt_i_sys']) {
            noTox++;
            continue;
        }
        let toxValue = substances[i]['reg_dnel_lt_i_sys'];

        // here proceeds code if CA includes substance and there is tox value
        // check if any model was used to assess the exposure
        let isAssessed = false;
        for (let ca in subInCA) {
            // if it finds any model that includes
            let exposure = subInCA[ca].exposure;
            let artExposure = exposure.filter(o => o['exposure_model'] === 'art');

            if (artExposure.lenght > 0) {
                artExposure = artExposure[0];
                if (artExposure.status === 'finished') {
                    let risk = artExposure['exposure_reg'] / toxValue;
                    if (risk >= 1) high++;
                    else if (risk >= 0.9) medium++;
                    else low++;
                    continue;
                }
            }

            let smExposure = exposure.filter(o => o['exposure_model'] === 'sm');
            if (smExposure.lenght > 0) {
                smExposure = smExposure[0];
                if (smExposure.status === 'finished') {
                    let risk = smExposure['exposure_reg'] / toxValue;
                    if (risk >= 1) high++;
                    else if (risk >= 0.9) medium++;
                    else low++;
                    continue;
                }
            }

            let traExposure = exposure.filter(o => o['exposure_model'] === 'tra');
            if (traExposure.lenght > 0) {
                traExposure = traExposure[0];
                if (traExposure.status === 'finished') {
                    let risk = traExposure['exposure_reg'] / toxValue;
                    if (risk >= 1) high++;
                    else if (risk >= 0.9) medium++;
                    else low++;
                    continue;
                }
            }

            nonAssessed++;
        }
    }


    // chart data
    const data = [
        {
            label: t('enterprise-home.charts.chart.no-tox'),
            value: noTox
        }, {
            label: t('enterprise-home.charts.chart.no-ca-assigned'),
            value: noAssignedCA
        }, {
            label: t('enterprise-home.charts.chart.not-assessed'),
            value: nonAssessed
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
                colors={[
                    '#f7f7f7',
                    '#eae4e4',
                    '#eae4e4',
                    '#5cb85c',
                    '#f0ad4e',
                    '#d9534f'
                ]} 
            />
            <p className="text-muted mt-3 text-center">
                {t('enterprise-home.charts.chart3.title')}
            </p>
        </div>
    )
}