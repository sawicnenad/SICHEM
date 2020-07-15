import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';



/*
    assessment entities for a workplace
    * workers schedule
    * cont. activity schedule
    * substances per contributing activities
*/
export default function AEntities(props){

    const {t} = useTranslation();
    const APIcontext = useContext(ApiRequestsContext);
    const entContext = useContext(EnterpriseContext);




    // list of assessment entities for DataList component
    const aentitiesList = () => {
        let data = [];
        let entities = entContext.aentities;

        for (let i in entities) {
            data.push(
                {
                    id: entities[i].id,
                    title: entContext.workplaces
                            .find(o => o.id === entities[i].workplace)
                            .reference,
                    data: [
                        {
                            label: t('data.aentity.list.cas'),
                            value: entities[i].cas_of_aentity.length
                        }, {
                            label: t('data.aentity.list.workers'),
                            value: entities[i].workers_of_aentity.length
                        }
                    ]})}
        return data;
    }


    return(
        <DataList
            name="aentities"
            data={ aentitiesList() }
            api={`${APIcontext.API}/a-entities/`}
            link='/enterprise/a-entities/'
            delMsg={t('messages.aentity-delete-msg')}
            noDeleteButton
            createButton={<div></div>}
        />
    )
}
