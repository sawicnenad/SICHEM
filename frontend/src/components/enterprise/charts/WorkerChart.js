import React, { useContext } from 'react';
import MyChart from './MyChart';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';





// showing some worker statistics
// regarding working time ?
export default function WorkerChart() {

    const context = useContext(EnterpriseContext);
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const { t } = useTranslation();

    // well if no workerss then no need to proceed
    if (context.workers.length === 0) {
        return(
            <div className="text-muted text-center p-5 bg-light">
                <FontAwesomeIcon icon="ban" style={{ fontSize: 75 }} />
                <div className="mt-3">
                    {t('enterprise-home.charts.no-workers')}
                </div>
            </div>
        )
    }


    let time = [];
    // for each worker and each day extract exposure duration
    for (let i in context.aentities) {
        let workers = context.aentities[i]['workers_of_aentity'];

        for (let w in workers) {
            let schedule = JSON.parse(workers[w].schedule);

            for (let d in days) {
                let todayTime = schedule[ days[d] ];
                let totalTime = 0;
                let keys = Object.keys(todayTime);
                if (keys.length === 0) continue;

                for (let k in keys) {
                    if (todayTime[keys[k]]) {
                        totalTime += 30;
                    }
                }
                time.push(totalTime);
            }
        }
    }

    // chart data
    const data = [
        {
            label: t('enterprise-home.charts.chart2.short'),
            value: time.filter( e => e < 60 ).length
        }, {
            label: t('enterprise-home.charts.chart2.medium'),
            value: time.filter( e => e >= 60 && e < 480 ).length
        }, {
            label: t('enterprise-home.charts.chart2.long'),
            value: time.filter( e => e > 480 ).length
        }
    ]

    return(
        <div>
            <MyChart
                data={data}
                colors={['#5cb85c', '#f0ad4e', '#d9534f']} 
            />
            <p className="text-muted mt-3 text-center">
                {t('enterprise-home.charts.chart2.title-time')}
            </p>
        </div>
    )
}