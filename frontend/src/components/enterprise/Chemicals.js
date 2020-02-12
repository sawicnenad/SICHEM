import React, { useContext } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';



export default function Chemicals() {
    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);
    const APIcontext = useContext(ApiRequestsContext);


    // create label value pairs and element titles
    const substances = () => {
        let data = [];
        let subs = context.substances;

        for (let i in subs) {
            data.push(
                {
                    id: subs[i].id,
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
            
            <Tabs fill>
                {[
                    {
                        eventKey: "suppliers",
                        title: <span className="text-dark font-weight-bold">
                                    {t('suppliers')}
                                </span>,
                        component: "Suppliers"
                    }, {
                        eventKey: "substances",
                        title: <span className="text-dark font-weight-bold">
                                    {t('substances')}
                                </span>,
                        component: <DataList 
                                        data={ substances() }
                                        api={`${APIcontext.API}/substances/`}
                                        createBtnLink={'/enterprise/substance/0'}
                                        delMsg={t('messages.substance-delete-msg')}
                                    />
                    }, {
                        eventKey: "mixtures",
                        title: <span className="text-dark font-weight-bold">
                                    {t('mixtures')}
                                </span>,
                        component: "Mixtures"
                    }
                ].map(
                    item => (
                        <Tab
                            key={item.eventKey}
                            eventKey={item.eventKey}
                            title={item.title}
                        >
                            <div className="mt-4">
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