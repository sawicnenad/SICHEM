import React, { useState, useEffect } from 'react';
import { Modal, Button, Col, Row, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';




const styling = {
    timing: {
        height: 15,
        border: '1px solid rgb(245, 240, 240)'
    }
}

/*
    Schedule of workers and contributing activities
    to know how much exposure is generated over 8-h twa
*/
export default function Schedule(props) {

    const { t } = useTranslation();
    const [state, setState] = useState({
        selection: false,
        timing: {
            mon: {}, tue: {},
            wed: {}, thu: {},
            fri: {}, sat: {},
            sun: {}
        }
    })
    useEffect(() => {
        
        if (props.timing) {
            let timing = props.timing
            if (!props.timing.mon) {
                timing = {...state.timing};
            }
            setState({
                ...state,
                timing: timing
            })
        }
    }, [props])

    const handleTimingSelection = (day, n, click) => {

        // when selecting multiple by keeping mouse button clicked
        // timing selected when mouse pointer leaves a given cell
        // when clicked -> selects a single timing
        if (state.selection || click) {

            let timingUpdated = {...state.timing};
            timingUpdated[day][n] = !timingUpdated[day][n];

            setState({
                ...state,
                timing: timingUpdated
            })
        }
    }

    const times = [...Array(48).keys()].map(
        item => (
            item < 20 ?
            `0${item/2}:00` : `${item/2}:00`
        )
    )

    const Week = (
        <Row>

            <Col md="1">
                {times.map(
                    (time, inx) => (
                        <div
                            key={inx}
                            style={{ 
                                height: styling.timing.height,
                                fontSize: 12,
                                textAlign: "right",
                                borderTop: inx % 2 === 0 ? "1px solid red": ""
                            }}
                        >
                            {
                                inx % 2 === 0 ?
                                time : ""
                            }
                        </div>
                    )
                )}
            </Col>

            {[
                'mon', 'tue',
                'wed', 'thu', 
                'fri', 'sat',
                'sun'
            ].map(
                day => (
                    <Col key={day}>
                        <div onMouseLeave={() => setState({...state, selection: false})}>
                        {
                            [...Array(48)].map(
                                (item, inx) => (
                                    <div 
                                        key={ inx } 
                                        style={styling.timing}
                                        className={
                                            `pointer-on-hover-div timing ${state.timing[day][inx] ?
                                                "bg-secondary border-0" : ""}`
                                            }
                                        onMouseDown={() => setState({...state, selection: true})}
                                        onMouseLeave={() => handleTimingSelection(day, inx)}
                                        onMouseUp={() => setState({...state, selection: false})}
                                        onClick={() => handleTimingSelection(day, inx, true)}
                                    ></div>
                                )
                            )
                        }</div>
                    </Col>
                )
            )}
        </Row>
    )


    return (
        <Modal
            show={props.visible}
            onHide={props.onHide}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {t('data.aentity.schedule.title')}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row style={{ marginBottom: 10 }}>
                    <Col md="1"></Col>
                    <Col style={{ textAlign: 'center'}}><Badge variant="dark">{t('days.mon')}</Badge></Col>
                    <Col style={{ textAlign: 'center'}}><Badge variant="dark">{t('days.tue')}</Badge></Col>
                    <Col style={{ textAlign: 'center'}}><Badge variant="dark">{t('days.wed')}</Badge></Col>
                    <Col style={{ textAlign: 'center'}}><Badge variant="dark">{t('days.thu')}</Badge></Col>
                    <Col style={{ textAlign: 'center'}}><Badge variant="dark">{t('days.fri')}</Badge></Col>
                    <Col style={{ textAlign: 'center'}}><Badge variant="warning">{t('days.sat')}</Badge></Col>
                    <Col style={{ textAlign: 'center'}}><Badge variant="danger">{t('days.sun')}</Badge></Col>
                </Row>
                { Week }
            </Modal.Body>
            
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={props.onHide}
                >
                    {t('cancel')}
                </Button>
                <Button
                    variant="danger"
                    onClick={() => props.recordTiming(state.timing)}
                >
                    {t('save')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}