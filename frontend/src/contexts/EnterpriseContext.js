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
    const [update, setUpdate] = useState(0);

    useEffect(() => {
        // check if user is member of an enterprise
        // if not this information will not be part of context
        // and the browser will redirect page to one to assing enterprise
        const headers = {
            headers: {
                Pragma: "no-cache",
                Authorization: 'Bearer ' + localStorage.getItem('token-access')
            }};


        Promise.all([
            axios.get(`${context.API}/enterprise/enterprises/`, headers),
            axios.get(`${context.API}/substances/`, headers),
            axios.get(`${context.API}/suppliers/`, headers),
            axios.get(`${context.API}/compositions/`, headers),
            axios.get(`${context.API}/components/`, headers),
            axios.get(`${context.API}/mixtures/`, headers),
            axios.get(`${context.API}/workplaces/`, headers),
            axios.get(`${context.API}/workers/`, headers),
            axios.get(`${context.API}/uses/`, headers),
            axios.get(`${context.API}/assessment-entities/`, headers)
        ])
        .then(
            res => {
                setState({
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
            }) })
        .catch(
            e => {
                if (update < 5) {
                    setUpdate(update+1)
                }
                if (update === 5) {
                    setState({ loaded: true });
                }
            })
        }, [context, update])

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
                refreshState: refreshState,
                update: update
            }}>
            { props.children }
        </EnterpriseContext.Provider>
    )
}
export default EnterpriseContextProvider;
