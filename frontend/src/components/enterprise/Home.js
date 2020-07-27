import React, { useContext } from 'react';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    Row,
    Col,
    Button,
    Card
} from 'react-bootstrap';



/*
    home page for enterprises
*/
export default function Home(props) {
    const context = useContext(EnterpriseContext);
    const { t } = useTranslation();


    const Statistics = values => (
        <div className="text-center">
            <div>
                <span>
                    <FontAwesomeIcon
                        icon={values.icon}
                        color={values.iconColor}
                        size="3x"
                    />
                </span>
                <span className="ml-2 display-4">
                    { values.number }
                </span>
            </div>
            <div className="mt-3">
                <Button
                    variant={values.buttonColor}
                    className="w-100"
                    onClick={() => props.history.push(values.link)}
                >
                    {values.buttonTitle}
                </Button>
            </div>
        </div>
    )
    
    const dataEntryButtonVariant = "danger";

    return (
        <div className="mt-4">

            {/* Data entry */}
            <Card>
                <Card.Header style={{ fontSize: 18 }}>
                    { t('enterprise.home.data-entry') }
                </Card.Header>
                <Card.Body>
                <Row>
                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="th"
                            iconColor="silver"
                            number={context.workplaces.length}
                            buttonTitle={t('workplaces')}
                            buttonColor={dataEntryButtonVariant}
                            link="/enterprise/workplaces"
                        />
                    </Col>

                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="user"
                            iconColor="silver"
                            number={context.workers.length}
                            buttonTitle={t('workers')}
                            link="/enterprise/workers"
                            buttonColor={dataEntryButtonVariant}
                        />
                    </Col>

                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="flask"
                            iconColor="silver"
                            number={context.substances.length + context.mixtures.length}
                            buttonTitle={t('chemicals')}
                            buttonColor={dataEntryButtonVariant}
                            link="/enterprise/chemicals/suppliers"
                        />
                    </Col>

                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="fire"
                            iconColor="silver"
                            number={context.uses.length}
                            buttonTitle={t('uses')}
                            buttonColor={dataEntryButtonVariant}
                            link="/enterprise/uses"
                        />
                    </Col>
                </Row>
                </Card.Body>
            </Card>


            {/* Exposure assessment */}
            <Card className="mt-5">
                <Card.Header style={{ fontSize: 18 }}>
                    { t('enterprise.home.exposure-assessment') }
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <Button 
                                variant="danger"
                                onClick={() => props.history.push('/enterprise/a-entities')}
                            >
                                {t('enterprise.home.aentities')}
                            </Button>
                        </Col>

                        <Col>
                            <Button 
                                variant="danger"
                                onClick={() => props.history.push('/enterprise/assessment')}
                            >
                                {t('enterprise.home.exposure')}
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    )
}
