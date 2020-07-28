import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Button, CardColumns } from 'react-bootstrap';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


/*
    Lists set CA combinations with
    Substances or Mixtures
*/
export default function CAList (props) {

    const { t } = useTranslation();
    const context = useContext( EnterpriseContext );
    let entities = props.entities;

    return (
        <CardColumns>
            {
                entities.map(
                    (entity, inx) => (
                        <Card key={inx} className="mb-3">
                            <Card.Header>
                                <Button 
                                    variant="outline-danger" size="sm"
                                    className="border-0"
                                    onClick={() => props.handleDelete(inx)}
                                >
                                    <FontAwesomeIcon icon="trash-alt" />
                                </Button> <span>
                                    { `${t('data.aentity.aentity')} ${inx + 1}`}
                                </span>
                            </Card.Header>
                            <Card.Body>
                                <div className="pt-1">
                                    <FontAwesomeIcon icon="cogs" 
                                    /> <span>
                                        {context.uses.find(
                                            o => o.id === parseInt(entity.use))
                                            .reference}
                                    </span>
                                </div>
                                    <div className="pt-1">
                                        <FontAwesomeIcon icon="cog" 
                                        /> <span>
                                            {context.uses
                                                .find(o => o.id === parseInt(entity.use))
                                                .cas.find(o => o.id === parseInt(entity.ca))
                                                .reference}
                                        </span>
                                    </div>
                                    <div className="pt-1">
                                        <FontAwesomeIcon icon="flask" 
                                        /> <span>
                                            {
                                                entity.substance ?
                                                context.substances
                                                    .find(o => o.id === parseInt(entity.substance))
                                                    .reference
                                                : context.mixtures
                                                    .find(o => o.id === parseInt(entity.mixture))
                                                    .reference
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <div 
                                            className="text-danger pointer-on-hover-div mt-1"
                                            onClick={() => props.handleSchedule(false, inx)}
                                        > <FontAwesomeIcon 
                                                icon="calendar-alt"
                                            /> <span>
                                                { t('data.aentity.schedule.title') }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-bottom mt-3 ">
                                        {t('exposure-models.plural')}:
                                    </div>

                                    {['art', 'sm', 'tra', 'trexmop'].map(
                                        model => (
                                            <div key={ model }>
                                                {
                                                    entity[model] ?
                                                    <FontAwesomeIcon
                                                        icon="check-square"
                                                        className="text-success"
                                                    />: 
                                                    <FontAwesomeIcon
                                                        icon="times"
                                                        className="text-danger"
                                                    />
                                                } {t(`exposure-models.${model}`)}
                                            </div>
                                        )
                                    )}
                            </Card.Body>
                        </Card>
                    )
                )
            }
        </CardColumns>
    )
}