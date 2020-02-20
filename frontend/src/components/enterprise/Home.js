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
    
    const dataEntryButtonVariant = "danger";

    return (
        <div className="container-lg px-5 py-3">

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
                            number={0}
                            buttonTitle={t('workplaces')}
                            buttonColor={dataEntryButtonVariant}
                        />
                    </Col>

                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="user"
                            iconColor="silver"
                            number={0}
                            buttonTitle={t('workers')}
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
                            link="/enterprise/chemicals/substances"
                        />
                    </Col>

                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="fire"
                            iconColor="silver"
                            number={0}
                            buttonTitle={t('uses')}
                            buttonColor={dataEntryButtonVariant}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}
