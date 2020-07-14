import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Button } from 'react-bootstrap';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


/*
    Lists set CA combinations with
    Substances or Mixtures
*/
export default function CATable (props) {

    const { t } = useTranslation();
    const context = useContext( EnterpriseContext );
    const cas = context.aentities.find(
                        o => o.id === props.aentityID
                    )['cas_of_aentity'];

    
    return (
        <Table>
            <thead>
                <tr>
                    <th>.</th>
                    <th>{t('data.aentity.ca-table.use')}</th>
                    <th>{t('data.aentity.ca-table.ca')}</th>
                    <th>{t('data.aentity.ca-table.substance')}</th>
                    <th>{t('data.aentity.ca-table.schedule')}</th>
                </tr>
            </thead>
            <tbody>
                {
                    cas.map(
                        (ca, inx) => (
                            <tr key={inx}>
                                <td>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="border-0"
                                        onClick={() => console.log("delete")}
                                    ><FontAwesomeIcon icon="trash-alt" />
                                    </Button>
                                </td>
                                <td>{
                                    context.uses
                                    .find(o => o.id === parseInt(ca.use))
                                    .reference
                                }</td>
                                <td>{
                                    context.uses
                                    .find(o => o.id === parseInt(ca.use))
                                    .cas
                                    .find(o => o.id === parseInt(ca.ca))
                                    .reference
                                }</td>
                                <td>{
                                    context.substances
                                    .find(o => o.id === parseInt(ca.substance))
                                    .reference
                                }</td>
                                <td>
                                    <div><Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="mb-3"
                                        
                                    >{t('set')} <FontAwesomeIcon icon="business-time" />
                                    </Button></div>

                                    <div>
                                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(
                                            day => (
                                                <div key={day}>
                                                    
                                                </div>
                                            )
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    )
                }
            </tbody>
        </Table>
    )
}