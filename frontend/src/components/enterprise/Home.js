import React, { useContext } from 'react';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    Row,
    Col,
    Button
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
    
    const dataEntryButtonVariant = "outline-danger";

    return (
        <div>

            {/* Data entry */}
            <div className="p-2 text-muted rounded mt-4 shadow">
                <div className="text-center border-bottom mb-3 text-muted">
                    <h4>{ t('enterprise.home.data-entry') }</h4>
                </div>
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
                            number={context.substances.length}
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
            </div>


            {/* Exposure assessment */}
            <div className="p-2 text-muted rounded mt-5 shadow">
                <div className="text-center border-bottom mb-3 text-muted">
                    <h4>{ t('enterprise.home.exposure-assessment') }</h4>
                </div>
                <Row>
                    <Col>
                        <Button 
                            variant="outline-danger"
                            onClick={() => props.history.push('/enterprise/a-entities')}
                        >
                            {t('enterprise.home.aentities')}
                        </Button>
                    </Col>

                    <Col>
                        <Button 
                            variant="outline-danger"
                            onClick={() => props.history.push('/enterprise/exposure')}
                        >
                            {t('enterprise.home.exposure')}
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
