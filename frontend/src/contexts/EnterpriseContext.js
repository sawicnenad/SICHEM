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
        const headers = {
            headers: {
                Pragma: "no-cache",
                Authorization: 'Bearer ' + localStorage.getItem('token-access')
            }};
        const promEnt = axios.get(`${context.API}/enterprise/enterprises/`, headers);
        const promSubs = axios.get(`${context.API}/substances/`, headers);
        const promSupps = axios.get(`${context.API}/suppliers/`, headers);

        Promise.all([promEnt, promSubs, promSupps])
            .then(
                res => setState({
                    ent: res[0].data[0],
                    substances: res[1].data,
                    suppliers: res[2].data
                }) )
            .catch(
                e => console.log(e)
            )
    }, [context])

    /*
        Data in state refresh
        in order to not fetch again updated data from the server
        * after creation of a new element
        * after an element is removed
        * ...
    */
    const refreshState = (datasetName, dataset) => {
        let newState = { ...state };
        newState[datasetName] = dataset;
        setState(newState);
    }

    return (
        <EnterpriseContext.Provider
            value={{
                ...state,
                refreshState: refreshState
            }}>
            { props.children }
        </EnterpriseContext.Provider>
    )
}
export default EnterpriseContextProvider;