import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Row, Col, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



/*
    displays a modal with a list of workers
    allows selection of a set that is later
    used to generate a table with the corresponding
    schedules -> working time over a week
*/
export default function WorkersList(props) {

    const [state, setState] = useState({ });
    const {t} = useTranslation();
    const context = useContext(EnterpriseContext);
 

    /*
        use effect sets workers from props to state
        those that are already added to the given 
        workplace and for which special styling is applied
    */
    useEffect(() => {
        setState({...state, workers: props.workers});
    }, [props])


    // set of workers IDs
    // later used to detect if the worker is already added to
    // the considered workplace 
    // if so then className border-danger text-danger
    // are used to visually separate them from the others
    let workersActive = [];
    if (state.workers) {
        workersActive = state.workers.map(item => item.worker);
    }



    // handle selection/deselection of workers in modal
    // when clicked (if inactive) it adds worker to state
    const handleSelection = id => {
        let newWorker = {
            worker: id,
            aentity: props.aentityID,
            schedule: {}
        }

        let list = [...state.workers];
        let isIncluded = list.find(o => o.worker === newWorker.worker);

        // if already included -> remove him
        if (isIncluded) {
            list = list.filter(o => o.worker !== newWorker.worker);
        } else {
            list.push(newWorker);
        }

        // update state
        setState({ ...state, workers: list });
    }



    // handles modal save button event
    // sends worker data back to parent 
    const handleSubmit = () => {
        props.handleSubmit(state.workers);
        setState({ ...state, show: false });
    }




    return(
        <div>
            <Button
                variant="danger"
                onClick={() => setState({ ...state, show: true })}
            >{ t('data.aentity.select-workers') }
            </Button>

            <Modal
                show={state.show}
                onHide={() => setState({ ...state, show: false })}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('data.aentity.list.workers')}</Modal.Title>
                </Modal.Header>


                <Modal.Body>
                    {
                        !state.workers || state.workers.length === 0 ?
                        <Alert variant="warning">{t('messages.no-data-selected')}</Alert>
                        : <div />
                    }
                    <Row>{
                        context.workers.map(
                            worker => (
                                <Col lg="4" md="6" xs="12" key={worker.id}>
                                    <div
                                        style={{ 
                                            background: "#E8E8E8",
                                            padding: 10,
                                            borderRadius: 3 
                                        }}
                                        className={
                                            workersActive.indexOf(worker.id) > -1 ?
                                            "border-danger text-danger pointer-on-hover-div" 
                                            : "pointer-on-hover-div"
                                        }
                                        onClick={() => handleSelection(worker.id)}
                                    >
                                        <Row>
                                            <Col xs="3" style={{ fontSize: 32 }}>
                                                <FontAwesomeIcon icon="user" />
                                            </Col>
                                            <Col xs="9">
                                                <div>
                                                    <div>{ worker.reference }</div>
                                                    <div>{ worker.name }</div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            )
                        )
                    }</Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary"
                        onClick={() => setState({ ...state, show: false })}
                    > {t('cancel')}
                    </Button>
                    <Button variant="danger"
                        onClick={handleSubmit}
                    > {t('save')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
