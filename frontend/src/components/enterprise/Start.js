import React from 'react';
import { Icon, Row, Col, Button, Statistic, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';


const styling = {
    dataEntryBlock: {
        border: "1px solid #d9d9d9",
        borderRadius: 2.5,
        marginTop: 25
    },
    dataEntryHeader: {
        fontSize: 20,
        letterSpacing: 2,
        fontWeight: 500,
        width: "100%",
        textAlign: "center",
        padding: 10,
        color: "#262626",
        background: "#f5f5f5"
    },
    dataEntryRow: {
        padding: 10,
        textAlign: "center",
        marginTop: 15,
        marginBottom: 15
    },
    dataEntryIcon: {
        fontSize: 105,
        color: "#595959"
    },
    dataEntryLinks: {
        width: "100%",
        marginTop: 25
    }
}

const dataEntryElements = [
    {
        statisticTitle: 'substances',
        title: "chemicals",
        link: "#",
        icon: "experiment",
        info: "info"
    }, {
        statisticTitle: "workplaces",
        title: "workplaces",
        link: "#",
        icon: "border",
        info: "info"
    }, {
        statisticTitle: "workers",
        title: "workers",
        link: "#",
        icon: "user",
        info: "info"
    }, {
        statisticTitle: "contributing-activities",
        title: "uses",
        link: "#",
        icon: "control",
        info: "info"
    }
]


function Start() {
    const { t } = useTranslation();

    return (
        <div>
           <div style={styling.dataEntryBlock}>
                <div style={styling.dataEntryHeader}>
                    { t('enterprise.start.data-entry.title') }
                </div>

                <Row type="flex" justify="start" style={styling.dataEntryRow}>
                    <Col md={{span: 4}} xs={{span: 0}}>
                        <Icon type="database" style={styling.dataEntryIcon} />
                    </Col>

                    <Col md={{span: 18}} xs={{span: 24}}>
                        <Row type="flex" justify="center" gutter={8}>
                            {dataEntryElements.map(
                                (item, inx) => (
                                    <Col sm={{ span: 6 }} key={inx}>
                                        <div style={{ textAlign: "center" }}>
                                            <Statistic
                                                value={3}
                                                title={
                                                <span>
                                                    <span>
                                                        { t(item.statisticTitle) }
                                                    </span> <Tooltip 
                                                                title={ t(`enterprise.start.data-entry.${item.info}`) }
                                                            >
                                                                <Icon type="info-circle" />
                                                            </Tooltip>
                                                </span>
                                                }
                                                prefix={<Icon type={ item.icon } /> } 
                                            />
                                            <Button 
                                                style={styling.dataEntryLinks}
                                                size="large"
                                                type="primary"
                                                ghost
                                            >
                                                <span>{ t(item.title) }</span>
                                            </Button>
                                        </div>
                                    </Col>
                                )
                            )}
                        </Row>
                    </Col>
                </Row>
           </div>
        </div>
    )
}
export default Start;