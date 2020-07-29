import React, {useContext } from 'react';
import { EnterpriseContext } from '../../../contexts/EnterpriseContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';





// returns Use / CA / Substance (composition) / Mixture name
// because CA_of_AEntity stores only id values
// only entity instance should be provided in props
export default function AEntityTitle(props) {
    const context = useContext(EnterpriseContext);
    const entity = props.entity;
    const use = context.uses.find(o => o.id === entity.use);
    const ca = use.cas.find(o => o.id === entity.ca);

    let substance = false;
    let mixture = false;
    let composition = false;

    if (entity.substance) {
        substance = context.substances.find(o => o.id === entity.substance);

        if (entity.composition) {
            composition = context.compositions.find(o => o.id === entity.composition);
        }
    } 

    if (entity.mixture) {
        mixture = context.substance.find(o => o.id === entity.mixture);
    } 


    return (
        <div>
            <span>
                <FontAwesomeIcon icon="cogs" /> { use.reference }
            </span> | <span>
                <FontAwesomeIcon icon="cog" /> { ca.reference }
            </span> | <span>
                <FontAwesomeIcon icon="flask" /> <span>
                    { substance ? substance.reference : mixture.reference }
                </span>
            </span> {
                composition ?
                <span>({ composition.reference })</span>
                : ""
            }
        </div>
    )
}