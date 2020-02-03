import React, { useContext } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';



export default function Chemicals() {
    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);


    // create label value pairs and element titles
    const substances = () => {
        let data = [];
        let subs = context.substances;

        for (let i in subs) {
            data.push(
                {
                    title: subs[i].reference,
                    data: [
                        {
                            label: t('data.substance.physical-state'),
                            value: subs[i].physical_state
                        }, {
                            label: t('data.substance.iupac'),
                            value: subs[i].iupac
                        }, {
                            label: t('data.substance.cas-nr'),
                            value: subs[i].cas_nr
                        }, {
                            label: t('data.substance.vp'),
                            value: subs[i].vp
                        }, , {
                            label: t('data.substance.molecular-formula'),
                            value: subs[i].molecular_formula
                        }
                    ]
                }
            )
        }
        return data;
    }

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
                        component: <DataList data={ substances() } />
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