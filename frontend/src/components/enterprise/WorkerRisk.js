import React, { useContext } from 'react';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import SubNav from './SubNav';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';





// this component presents risk for each worker per day and per substance
// for each worker a Card component is used to display calculated risk
// a card contains seven days of a week
// within a day we show how much a worker spends working on each activity
// what exposure was calculated using a model and what risk was found
// for risks we have three categories, low, medium and high
// every category has a representative fontawesome icon (check, warning and error)
export default function WorkerRisk(props) {

 
    
    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);
    const workers = context.workers;
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];




    // arrow function that generates HTML component
    // showing the risk and exposure for a worker
    // carring out different tasks with different substances
    // on a given day of the week
    // arguments are:
    // * worker id
    // * day
    const WorkerRiskThisDay = (id, day) => {

        // first check if any work activity is carried out the given day
        // this information is contained in worker-of-aentity - which are part of aentity
        let workersOfAEntity = [];
        for (let i in context.aentities) {
            workersOfAEntity = workersOfAEntity.concat(
                context.aentities[i]['workers_of_aentity']
            );
        }
        workersOfAEntity = workersOfAEntity.filter(o => o.worker === id);
        // will include those instances that carry out an activity on this day
        let workersOnThisDay = []; 

        // now check schedule
        for (let w in workersOfAEntity) {
            let schedule = JSON.parse(workersOfAEntity[w].schedule);
            let onThisDay = schedule[day];
            let keys = Object.keys(onThisDay)
            let isEmpty = keys.length === 0;
            let works = false;
            for (let key in keys) { if(onThisDay[ keys[key] ] === true) { works=true }}
            
            // also check if the worker executes any activity this day
            if (!isEmpty && works) { workersOnThisDay.push(workersOfAEntity[w]) }
        }

        // if no instance added to workersOnThisDay
        // then the worker not carrying out a task this day
        if (workersOnThisDay.length === 0) {
            return(
                <div>{t('risk.not-working')}</div>
            )
        }

        // if worker carries out a task on this day
        // the function continues its execution from this point on
        // and now we must check which cas-of-aentities overlap 
        // with the worker's schedule on this day
        
        // find out which cas-of-aentities correspond workers are involved in
        let casOnThisDay = [];
        for (let w in workersOnThisDay) {
            let aentityID = workersOnThisDay[w].aentity;
            let casOfAEntity = context.aentities.find(
                    o => o.id === aentityID
                )['cas_of_aentity'];

            for (let c in casOfAEntity) {
                let schedule = JSON.parse(casOfAEntity[c].schedule);
                let onThisDay = schedule[day];
                let keys = Object.keys(onThisDay)
                let isEmpty = keys.length === 0;
                let works = false;
                for (let key in keys) { if(onThisDay[ keys[key] ] === true) { works=true }}

                // also check if the worker executes any activity this day
                if (!isEmpty && works) { casOnThisDay.push(casOfAEntity[c]) }
            }            
        }
        
        // if no instance added to casOnThisDay
        // then no activity carried out on the given day
        if (casOnThisDay.length === 0) {
            return(
                <div>{t('risk.no-task')}</div>
            )
        }


        // now we have CAs that are performed on the given day
        // however we don't know yet if they overlap with workers schedule
        let risks = []; // this will include HTML components

        for (let w in workersOfAEntity) {
            let workerSchedule = JSON.parse(workersOfAEntity[w].schedule)[day];
            
            for (let c in casOnThisDay) {
                let exposureTime = 0;
                let caSchedule = JSON.parse(casOnThisDay[c].schedule)[day];
                let keys = Object.keys(caSchedule);

                for (let k in keys) {
                    if (caSchedule[ keys[k] ] && workerSchedule[ keys[k] ]) {
                        exposureTime += 30;
                    }
                }

                if (exposureTime > 0) {
                    let aentity = context.aentities.find(o => o.id === casOnThisDay[c].aentity);
                    let workplace = context.workplaces.find(o => o.id === aentity.workplace).reference;
                    let exposure = 0;
                    let risk = 0;
                    

                    // get exposure value
                    // priority is ART - SM - TRA
                    if (casOnThisDay[c].art) {
                        let art = casOnThisDay[c].exposure.find(o => o['exposure_model'] === 'art');
                        if (art.status === 'finished') {
                            exposure = parseFloat(art['exposure_reg']);
                        }
                    } else if (casOnThisDay[c].sm) {
                        let sm = casOnThisDay[c].exposure.find(o => o['exposure_model'] === 'sm');
                        if (sm.status === 'finished') {
                            exposure = parseFloat(sm['exposure_reg']);
                        }
                    } else if (casOnThisDay[c].tra) {
                        let tra = casOnThisDay[c].exposure.find(o => o['exposure_model'] === 'tra');
                        if (tra.status === 'finished') {
                            exposure = parseFloat(tra['exposure_reg']);
                        }
                    }

                    // Using exposure value and substance tox value
                    // calculate risk
                    let substanceID = casOnThisDay[c].substance;
                    let substance = context.substances.find(o => o.id === substanceID);

                    risk = exposure / substance['reg_dnel_lt_i_sys'];
                    risk = Math.round(risk * 100) / 100;

                    let icon = (
                        <FontAwesomeIcon
                            icon="check-square" 
                            className="text-success"
                            style={{ fontSize: 45 }}
                        />
                    )

                    if (risk >= 1) {
                        icon = (
                            <FontAwesomeIcon
                                icon="times-circle" 
                                className="text-danger"
                                style={{ fontSize: 45 }}
                            />
                        )
                    }

                    if (risk >= 0.9 && risk < 1) {
                        icon = (
                            <FontAwesomeIcon
                                icon="exclamation-triangle"
                                className="text-warning"
                                style={{ fontSize: 45 }}
                            />
                        )
                    }
                    
                    risks.push(
                        <div className="border p-2 text-center">
                            <div>{workplace}</div>
                            <div>{substance.reference}</div>
                            <div className="my-2">{icon}</div>
                            <div>
                                {t('risk.risk')}:
                                <Badge variant="light" style={{ fontSize: 12}}>
                                    {risk}
                                </Badge>
                            </div>
                            <div>{exposureTime} min</div>
                            <div>{exposure} mg/m<sup>3</sup></div>
                        </div>
                    )
                }
            }
        }


        return(
            <div>
                {risks.map((risk, inx) => <div key={inx}>{risk}</div>)}
            </div>
        )
    }







    return(
        <div>
            <div className="mb-2">
                <SubNav active="worker-risk" />
            </div>
            <div className="py-3">
            {
                workers.map(
                    worker => (
                        <Card key={worker.id} className="mb-3">
                            <Card.Header>
                                {worker.reference} {worker.name ? <span>({worker.name})</span> : ""}
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                {
                                    days.map(
                                        day => (
                                            <Col key={day} style={{ fontSize: 12 }}>
                                                <div className="text-center">
                                                    <Badge variant="light" style={{ fontSize: 12 }}>
                                                        {t(`days.${day}`)}
                                                    </Badge>
                                                    <div>{WorkerRiskThisDay(worker.id, day)}</div>
                                                </div>
                                            </Col>
                                        )
                                    )
                                }
                                </Row>
                            </Card.Body>
                        </Card>
                    )
                )
            }
            </div>
        </div>
    )
}