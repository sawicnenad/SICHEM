import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataList from './DataList';
import DataForm from './data-forms/DataForm';
import aentityJSON from '../../json/data-forms/aentity.json'
import { useFormik } from 'formik';
import { ApiRequestsContext } from '../../contexts/ApiRequestsContext';
import * as Yup from 'yup';
import { Table, Badge, Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { EnterpriseContext } from '../../contexts/EnterpriseContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Schedule from './aentity/Schedule';
import axios from 'axios';
import RequestNotification from '../notifications/RequestNotification';
import CATable from './aentity/CATable';
import CAForm from './aentity/CAForm';



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
