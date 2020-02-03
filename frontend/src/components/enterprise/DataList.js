import React from 'react';
import { Button, Row, Col, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function DataList(props) {
    const { t } = useTranslation();

    // containing list of elements to diplay
    // e.g. list of substances
    const data = props.data;

    const createButton = (
        <div className="text-right mb-4">
            <Button variant="danger">
                { t('create-new') }
            </Button>
        </div>
    )
    

    if (data.length === 0) {
        return (
            <div>
                <div>{ createButton }</div>
                <Alert
                    variant="warning"
                >
                    {t('messages.no-data-for-this-page')}
                </Alert>
            </div>
        )
    }

    return (
        <div>
            <div>{ createButton }</div>
            {
                data.map(
                    item => (
                        <div className="p-2 bg-light text-muted shadow-sm">
                            <div className="w-100 border-bottom pb-3" style={{ height: 35 }}>
                                <span className="font-weight-bold float-left pt-1 text-danger">
                                    { item.title }
                                </span>
                                <span className="float-right">
                                    <Button variant="outline-danger" size="sm" className="mx-1">
                                        <FontAwesomeIcon icon="trash-alt" />
                                    </Button>

                                    <Button variant="outline-dark" size="sm">
                                        { t('open') }
                                    </Button>
                                </span>
                            </div>

                            <Row className="mt-3">
                                {
                                    item.data.map(
                                        (e, inx) => (
                                            <Col key={inx} md={{ span: 4 }} className="mt-2">
                                                { e.label }: <span className="text-danger">{e.value}</span>
                                            </Col>
                                        )
                                    )
                                }
                            </Row>
                        </div>
                    )
                )
            }
    </div>)  
}