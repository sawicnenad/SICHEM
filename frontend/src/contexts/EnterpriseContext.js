import React, { useState, useEffect, useContext } from 'react';
import { ApiRequestsContext } from './ApiRequestsContext';
import axios from 'axios';

// holds enterprise data only
// suppliers, substances, mixtures ...
export const EnterpriseContext = React.createContext();


function EnterpriseContextProvider(props) {
    const context = useContext(ApiRequestsContext);
    const [state, setState] = useState({
        loaded: false
    });

    useEffect(() => {
        // check if user is member of an enterprise
        // if not this information will not be part of context
        // and the browser will redirect page to one to assing enterprise
        const headers = {
            headers: {
                Pragma: "no-cache",
                Authorization: 'Bearer ' + localStorage.getItem('token-access')
            }};

        const Ent = axios.get(`${context.API}/enterprise/enterprises/`, headers);
        const Subs = axios.get(`${context.API}/substances/`, headers);
        const Supps = axios.get(`${context.API}/suppliers/`, headers);
        const Compositions = axios.get(`${context.API}/compositions/`, headers);
        const Components = axios.get(`${context.API}/components/`, headers);
        const Mix = axios.get(`${context.API}/mixtures/`, headers);
        const Workplaces = axios.get(`${context.API}/workplaces/`, headers);
        const Uses = axios.get(`${context.API}/uses/`, headers);
        const Workers = axios.get(`${context.API}/workers/`, headers);
        const AEntity = axios.get(`${context.API}/a-entities/`, headers);

        Promise.all([
                    Ent,
                    Subs,
                    Supps,
                    Compositions,
                    Components,
                    Mix,
                    Workplaces,
                    Workers,
                    Uses,
                    AEntity])
            .then(
                res => setState({
                    ent: res[0].data,
                    substances: res[1].data,
                    suppliers: res[2].data,
                    compositions: res[3].data,
                    components: res[4].data,
                    mixtures: res[5].data,
                    workplaces: res[6].data,
                    workers: res[7].data,
                    uses: res[8].data,
                    aentities: res[9].data,
                    loaded: true
                }) )
            .catch(
                e => {
                    console.log(e);
                    setState({ loaded: true })
                }
            )
    }, [context])
    console.log(state)
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
