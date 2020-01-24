import React, { useState, useEffect, useContext } from 'react';
import { ApiRequestsContext } from './ApiRequestsContext';
import axios from 'axios';


// holds enterprise data only
// suppliers, substances, mixtures ...
export const EnterpriseContext = React.createContext();


function EnterpriseContextProvider(props) {
    const context = useContext(ApiRequestsContext);
    const [state, setState] = useState({});

    useEffect(() => {
        // check if user is member of an enterprise 
        // if not this information will not be part of context
        // and the browser will redirect page to one to assing enterprise
        axios.get(
            `${context.API}/enterprise/enterprises/`,
            context.headers
        ).then(
            res => setState({ ent: res.data })
        ).catch(
            e => console.log(e)
        )
        
    }, [])

    return (
        <EnterpriseContext.Provider value={state}>
            { props.children }
        </EnterpriseContext.Provider>
    )
}
export default EnterpriseContextProvider;