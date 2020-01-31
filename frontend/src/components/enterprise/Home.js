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
    
    return (
        <div className="container-lg px-5 py-3">

            {/* Company details */}
            <div className="border p-2 text-muted border-info rounded">
                <Row>
                    <Col>
                        <table className="h-100">
                            <tbody>
                                <tr>
                                    <td className="align-middle pl-5">
                                        <FontAwesomeIcon icon="building" size="3x" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>

                    <Col>
                        <div>
                            { t('enterprise.home.ent-name') }
                        </div>
                        <div className="font-weight-bold mt-1">
                            { context.ent.name }
                        </div>
                    </Col>

                    <Col>
                        <div>
                            { t('enterprise.home.ent-uid') }
                        </div>
                        <div className="font-weight-bold mt-1">
                            { context.ent.uid }
                        </div>
                    </Col>

                    <Col>
                        <div>{ context.ent.address }</div>
                        <div>{ context.ent.city }</div>
                        <div>{ context.ent.state }</div>
                    </Col>
                </Row>
            </div>


            {/* Data entry */}
            <div className="border p-2 text-muted border-danger rounded mt-5">
                <div className="text-center border-bottom mb-3 text-danger">
                    <h4>{ t('enterprise.home.data-entry') }</h4>
                </div>
                <Row>
                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="th"
                            iconColor="silver"
                            number={0}
                            buttonTitle={t('workplaces')}
                            buttonColor="danger"
                        />
                    </Col>

                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="user"
                            iconColor="silver"
                            number={0}
                            buttonTitle={t('workers')}
                            buttonColor="danger"
                        />
                    </Col>

                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="flask"
                            iconColor="silver"
                            number={context.substances.length}
                            buttonTitle={t('chemicals')}
                            buttonColor="danger"
                            link="/enterprise/chemicals"
                        />
                    </Col>

                    <Col xs={6} md={3} className="mt-2">
                        <Statistics
                            icon="fire"
                            iconColor="silver"
                            number={0}
                            buttonTitle={t('uses')}
                            buttonColor="danger"
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}
