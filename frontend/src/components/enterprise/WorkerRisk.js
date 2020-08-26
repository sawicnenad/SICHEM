import React, { useEffect, useContext, useState } from 'react';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import SubNav from './SubNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';






export default function WorkerRisk(props) {

 
    const context = useContext(EnterpriseContext);
    const { t } = useTranslation();

    



    // for every assessment entity (one defined per workplace)
    // we create an object containing information about
    // worker, workplace, substance, day and calculated exposure and risk
    const aentities = context.aentities;
    let risk = [];
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    for (let i in aentities) {
        let casOfAEntity = aentities[i]['cas_of_aentity'];
        let workersOfAEntity = aentities[i]['workers_of_aentity'];

        for (let w in workersOfAEntity) {
            let schedule = JSON.parse(workersOfAEntity[w].schedule);

            // if worker has no schedule set
            if (Object.keys(schedule).length === 0) {
                risk.push({
                    worker: workersOfAEntity[w].worker,
                    notWorking: true,
                    workplace: aentities[i].workplace
                });
                continue;
            } 

            // otherwise we calculate exposure and risk per day
            for (let c in casOfAEntity) {
                // evary ca has an array called exposure
                // it holds calculated exposure values using different exposure models
                // what is important here to figure out which model was used
                let schedule2 = JSON.parse(casOfAEntity[c].schedule);

                // now per day
                let substanceID = casOfAEntity[c].substance;
                let toxValue = context.substances.find(o => o.id === substanceID)['reg_dnel_lt_i_sys'];
                if (toxValue) { toxValue = parseFloat(toxValue) }

                let newRisk = {
                    worker: workersOfAEntity[w].worker,
                    exposure: {mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {}},
                    notWorking: true,
                    workplace: aentities[i].workplace,
                    substance: substanceID,
                    tox: toxValue ? toxValue : false
                }

                for (let d in days) {
                    // also possible that a given worker not working a given day
                    let day = days[d];

                    if (Object.keys(schedule[day]).length === 0) {
                        newRisk.exposure[day] = false;
                        continue;
                    }

                    // else - if working on a given day
                    let workerDay = schedule[day];
                    let activityDay = schedule2[day];
                    
                    // get all keys of the schedule
                    // when both are true - then it means that the worker
                    // is present at the workplace while an activity takes place
                    let totalTime = 0;
                    let keys = Object.keys(workerDay);

                    for (let key in keys) {
                        if (workerDay[key] === true && activityDay[key] === true) {
                            totalTime += 30;
                        }
                    }

                    // now calculate exposure and risk depending on the selected exposure model
                    // that was used to evaluate the exposure in /assessment
                    newRisk.time = totalTime;
                    
                    if (casOfAEntity[c].art) {
                        // exposure must include status finished
                        // in order to have included exposure value
                        let exposure = casOfAEntity[c].exposure.filter(
                            o => o['exposure_model'] === 'art');

                        if (exposure.length === 1) {
                            exposure = exposure[0];
                            if (exposure.status === 'finished') {
                                newRisk.exposure[day].art = parseFloat(
                                    exposure['exposure_reg']) * totalTime/480;
                                
                                // calc risk on this day
                                if (newRisk.tox) {
                                    newRisk.exposure[day].artRisk = Math.round(
                                        newRisk.exposure[day].art / newRisk.tox *100) / 100;
                                } else {
                                    newRisk.exposure[day].artRisk = false;
                                }
                            }
                        }
                    } 
                    
                    if (casOfAEntity[c].sm) {
                        // exposure must include status finished
                        // in order to have included exposure value
                        let exposure = casOfAEntity[c].exposure.filter(
                            o => o['exposure_model'] === 'sm');

                        if (exposure.length === 1) {
                            exposure = exposure[0];
                            if (exposure.status === 'finished') {
                                newRisk.exposure[day].sm = parseFloat(
                                    exposure['exposure_reg']) * totalTime/480;

                                // calc risk on this day
                                if (newRisk.tox) {
                                    newRisk.exposure[day].smRisk = Math.round(
                                        newRisk.exposure[day].sm / newRisk.tox *100) / 100;
                                } else {
                                    newRisk.exposure[day].smRisk = false;
                                }
                            }
                        }
                    }

                    if (casOfAEntity[c].tra) {
                        // exposure must include status finished
                        // in order to have included exposure value
                        let exposure = casOfAEntity[c].exposure.filter(
                            o => o['exposure_model'] === 'tra');

                        if (exposure.length === 1) {
                            exposure = exposure[0];
                            if (exposure.status === 'finished') {
                                newRisk.exposure[day].tra = parseFloat(
                                    exposure['exposure_reg']) * totalTime/480;
                                
                                // calc risk on this day
                                if (newRisk.tox) {
                                    newRisk.exposure[day].traRisk = Math.round(
                                        newRisk.exposure[day].tra / newRisk.tox *100) / 100;
                                } else {
                                    newRisk.exposure[day].traRisk = false;
                                }
                            }
                        }
                    }
                }
                risk.push(newRisk);
            }
        }
    }


    // returns icon and risk info
    const getRiskDiv = arg => {
        if (arg) {

            // risk value
            let risk = "";
            let exposure = "";
            if (arg.artRisk) {
                risk = arg.artRisk;
                exposure = arg.art;
            } else if (arg.smRisk) {
                risk = arg.smRisk;
                exposure = arg.sm;
            } else if (arg.traRisk) {
                risk = arg.traRisk;
                exposure = arg.tra;
            }

            let icon = <FontAwesomeIcon 
                            className="text-danger"
                            icon="times-circle"
                            style={{ fontSize: 40 }}
                        />;
            // risk icon
            if (risk < 1 && risk >= 0.9) {
                icon = <FontAwesomeIcon 
                        className="text-warning"
                        icon="exclamation-triangle"
                        style={{ fontSize: 40 }}
                    />;
            } else if (risk < 0.9) {
                icon = <FontAwesomeIcon 
                        className="text-success"
                        icon="check-square" 
                        style={{ fontSize: 40 }}
                    />;
            }


            return (
                <div style={{ fontSize: 12 }}>
                    <div className="pt-2">{icon}</div>
                    <br/>
                    <div>
                        <span>{t('risk')}:</span> <span>{risk}</span>
                    </div>
                    <div>
                        <span>{t('exposure.exposure')}:</span> <span>
                            {exposure} mg/m<sup>3</sup>
                        </span>
                    </div>
                </div>
            )
        }

        return(<div style={{ fontSize: 10, marginTop: 5 }}>
            {t('not-working')}
        </div>)
    }

    const RiskPerWorker = risk.map(
        (item, inx) => (
            <Card 
                key={inx}
                className="mt-3"
            >
                <Card.Header>{
                    context.workers.find(o => o.id === item.worker).reference
                }</Card.Header>
                <Card.Body>
                {
                    risk.map(
                        item => (
                            <Row key={item.worker}>
                            {
                                days.map(day => (
                                    <Col key={day} style={{ textAlign: "center" }}>
                                        <div>
                                            <Badge variant="light">
                                                { t(`days.${day}`) }
                                            </Badge>

                                            <div>
                                                { getRiskDiv(item.exposure[day]) }
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            }
                            </Row>
                        )
                    )
                }
                </Card.Body>
            </Card>
        )
    )


    return(
        <div>
            <div className="mb-2">
                <SubNav active="worker-risk" />
            </div>
            <div className="py-3">
            {
                RiskPerWorker.map(
                    item => item
                )
            }
            </div>
        </div>
    )
}