import React from 'react';
import { Button, Row, Col, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


export default function DataList(props) {
    const { t } = useTranslation();

    // containing list of elements to diplay
    // e.g. list of substances
    const data = props.data;

    // title/header of each element in the list
    const title = props.title

    // labels and values that should be extracted for element body
    const labels = props.labels;

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
                                <span className="font-weight-bold float-left pt-1">
                                    { item[title] }
                                </span>
                                <span className="float-right">
                                    <Button variant="outline-dark" size="sm" className="mx-1">
                                        { t('delete') }
                                    </Button>

                                    <Button variant="outline-danger" size="sm">
                                        { t('open') }
                                    </Button>
                                </span>
                            </div>

                            <Row className="mt-3">
                                {
                                    labels.map(
                                        label => (
                                            <Col key={label}>
                                                { label }: { item[label] }
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