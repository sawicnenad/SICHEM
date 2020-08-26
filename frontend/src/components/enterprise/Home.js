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
import MyChart from './MyChart';







/*
    home page for enterprises
*/
export default function Home(props) {
    const context = useContext(EnterpriseContext);
    const { t } = useTranslation();


    // Statistics showing numbers of workplaces, workers, substances, uses
    // appears in the first card labeled "Data entry"
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



    console.log(context)

    // Exposure models is the last card
    // we need a common appearance
    const ExposureModel = item => (
        <Col>
            <Button
                variant="outline-secondary"
                className="w-100"
                onClick={() => props.history.push(item.link)}
            >
                <div style={{ fontSize: 55 }}>
                    <FontAwesomeIcon icon="calculator" />
                </div>
                <div>{ t(item.label) }</div>
            </Button>
        </Col>
    )
        

    // Data for charts illustrating different statistics
    // based on exposure evaluations in SICHEM
    const chartData1 = [
        {
            label: t('enterprise-home.charts.chart-1.not-working'),
            value: 4
        }, {
            label: t('enterprise-home.charts.chart-1.low-risk'),
            value: 10
        }, {
            label: t('enterprise-home.charts.chart-1.medium-risk'),
            value: 1
        }, {
            label: t('enterprise-home.charts.chart-1.high-risk'),
            value: 1
        }
    ]

    const chartData2 = [
        {
            label: t('enterprise-home.charts.chart-2.not-assessed'),
            value: 1
        }, {
            label: t('enterprise-home.charts.chart-2.low-risk'),
            value: 3
        }, {
            label: t('enterprise-home.charts.chart-2.medium-risk'),
            value: 1
        }, {
            label: t('enterprise-home.charts.chart-2.high-risk'),
            value: 0
        }
    ]

    const chartData3 = [
        {
            label: t('enterprise-home.charts.chart-2.not-assessed'),
            value: 0
        }, {
            label: t('enterprise-home.charts.chart-2.low-risk'),
            value: 1
        }, {
            label: t('enterprise-home.charts.chart-2.medium-risk'),
            value: 1
        }, {
            label: t('enterprise-home.charts.chart-2.high-risk'),
            value: 0
        }
    ]
    


    return (
        <div className="py-4">
            
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
            <Card className="mt-4">
                <Card.Header style={{ fontSize: 18 }}>
                    { t('enterprise.home.exposure-assessment') }
                </Card.Header>
                <Card.Body>
                    <Row className="mb-5">
                        <Col>
                            <MyChart 
                                data={chartData1}
                                colors={['#f7f7f7', '#5cb85c', '#f0ad4e', '#d9534f']}
                            />
                        </Col>
                        <Col>
                            <MyChart 
                                data={chartData2}
                                colors={['#f7f7f7', '#5cb85c', '#f0ad4e', '#d9534f']}
                            />
                        </Col>
                        <Col>
                            <MyChart 
                                data={chartData3}
                                colors={['#f7f7f7', '#5cb85c', '#f0ad4e', '#d9534f']}
                            />
                        </Col>
                    </Row>
                    <Row>
                        
                        <Col>
                            <Button 
                                variant="outline-danger"
                                className="w-100"
                                onClick={() => props.history.push('/enterprise/a-entities')}
                            >
                                {t('enterprise.home.aentities')}
                            </Button>
                        </Col>

                        <Col>
                            <Button 
                                variant="outline-danger"
                                className="w-100"
                                onClick={() => props.history.push('/enterprise/assessment')}
                            >
                                {t('enterprise.home.exposure')}
                            </Button>
                        </Col>

                        <Col>
                            <Button 
                                variant="outline-danger"
                                className="w-100"
                                onClick={() => props.history.push('/enterprise/risk')}
                            >
                                {t('worker-risk')}
                            </Button>
                        </Col>
                    </Row>


                    
                </Card.Body>
            </Card>

            {/* exposure models */}
            <Card className="mt-4" style={{ fontSize: 18 }}>
                <Card.Header>
                    { t('exposure-models.plural') }
                </Card.Header>

                <Card.Body>
                    <Row>
                        {[
                            {
                                link: '/enterprise/exposure-model/art',
                                label: 'exposure-models.art'
                            }, {
                                link: '/enterprise/exposure-model/sm',
                                label: 'exposure-models.sm'
                            }, {
                                link: '/enterprise/exposure-model/tra',
                                label: 'exposure-models.tra'
                            }, {
                                link: '/enterprise/exposure-model/art',
                                label: 'exposure-models.trexmop'
                            }
                        ].map(
                            item => ExposureModel(item)
                        )}
                    </Row>
                </Card.Body>
            </Card>
        </div>
    )
}
