import React, { useContext } from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';





// lists added workers to the workplace
// allows specification of their week schedule
export default function WorkerTable(props) {

    const { t } = useTranslation();
    const context = useContext(EnterpriseContext);

    return(
        <Table>
            <thead>
                <tr>
                    <th>{t('worker')}</th>
                    <th>{t('data.worker.name')}</th>
                    <th>{t('data.aentity.schedule.title')}</th>
                </tr>
            </thead>
            <tbody>
                {props.workers.map(worker => (
                    <tr key={worker.worker}>
                        <td>{context.workers.find(o => o.id === worker.worker).reference}</td>
                        <td>{context.workers.find(o => o.id === worker.worker).name}</td>
                        <td></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}