import React, { useEffect, useContext } from 'react';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import SubNav from './SubNav';






export default function WorkerRisk(props) {

    const context = useContext(EnterpriseContext);

    useEffect(() => {
        console.log(context)
    }, [props])


    



    // for every assessment entity (one defined per workplace)
    // we create an object containing information about
    // worker, workplace, substance, day and calculated exposure and risk
    const aentities = context.aentities;
    let risk = [];

    for (let i in aentities) {
        let casOfAEntity = aentities[i]['cas_of_aentity'];
        let workersOfAEntity = aentities[i]['workers_of_aentity'];

        for (let w in workersOfAEntity) {
            let schedule = JSON.parse(workersOfAEntity[w].schedule);

            // if worker has no schedule set
            if (Object.keys(schedule).length === 0) {
                risk.push({
                    worker: workersOfAEntity[w].worker,
                    notWorking: true
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
                let days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                for (let d in days) {
                    // also possible that a given worker not working a given day
                    let day = days[d];
                    if (Object.keys(schedule[day]).length === 0) {
                        risk.push({
                            worker: workersOfAEntity[w].worker,
                            day: day,
                            notWorking: true
                        });
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
                    let newRisk = {
                        
                    }
                    if (casOfAEntity[c].art) {

                    }
                }
            }
        }
    }



    return(
        <div>
            <div className="mb-2">
                <SubNav active="worker-risk" />
            </div>
            <div className="py-3">
            </div>
        </div>
    )
}