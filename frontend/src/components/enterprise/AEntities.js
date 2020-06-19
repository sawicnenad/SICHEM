import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button, FormControl, Col, Row
} from 'react-bootstrap';




export default function AEntities(){
    const {t} = useTranslation();

    return(
        <Row>
            <Col>
                <FormControl placeholder={t('search')}/>
            </Col>
            
            <Col style={{ textAlign: 'right' }}>
                <Button
                    variant="danger"
                >
                    { t('create-new') }
                </Button>
            </Col>
        </Row>
    )
}