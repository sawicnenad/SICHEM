import React, { useContext, useState } from 'react';
import { Card, CardColumns, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




// lists added workers to the workplace
// allows specification of their week schedule
export default function WorkerList(props) {

    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);

    return(
        <div>
            <CardColumns>{
                props.workers.map(
                    worker => (
                        <Card key={worker.worker}>
                            <Card.Header>
                                { context.workers.find(o => o.id === worker.worker).reference }
                            </Card.Header>
                            <Card.Body style={{ textAlign: "center "}}>
                                <Card.Title>
                                    <div style={{ fontSize: 32 }}>
                                        <FontAwesomeIcon icon="user" />
                                    </div>
                                </Card.Title>

                                <Card.Text>
                                    { context.workers.find(o => o.id === worker.worker).name }
                                </Card.Text>

                                <Button
                                    variant="outline-danger"
                                    onClick={() => props.handleSchedule(true, worker.worker)}
                                >
                                    <FontAwesomeIcon icon="calendar-alt" /> <span>
                                        {t('data.aentity.schedule.title')}
                                    </span>
                                </Button>
                            </Card.Body>
                        </Card>
                    )
                )
            }</CardColumns>
        </div>
    )
}