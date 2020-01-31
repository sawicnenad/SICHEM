import React, { useContext } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';



export default function Chemicals() {
    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);

    return (
        <div className="container-lg px-5 py-3">
            
            <Tabs>
                {[
                    {
                        eventKey: "suppliers",
                        title: t('suppliers'),
                        component: "Suppliers"
                    }, {
                        eventKey: "substances",
                        title: t('substances'),
                        component: <DataList 
                                        data={context.substances}
                                        title="reference"
                                        labels={[ 'vp' ]}
                                    />
                    }, {
                        eventKey: "mixtures",
                        title: t('mixtures'),
                        component: "Mixtures"
                    }
                ].map(
                    item => (
                        <Tab 
                            key={item.eventKey}
                            eventKey={item.eventKey}
                            title={item.title}
                        >
                            <div className="mt-2">
                                {item.component}
                            </div>
                        </Tab>
                    )
                )
                }
            </Tabs>
        </div>
    )
}