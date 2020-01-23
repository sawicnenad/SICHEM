import React, { useState, useEffect } from 'react';


// holds enterprise data only
// suppliers, substances, mixtures ...
export const EnterpriseContext = React.createContext();


function EnterpriseContextProvider(props) {
    const [state, setState] = useState({});

    useEffect(() => {
        // check if user is member of an enterprise 
        // if not this information will not be part of context
        // and the browser will redirect page to one to assing enterprise

        
    }, [])

    return (
        <EnterpriseContext.Provider value={...state}>
            { props.children }
        </EnterpriseContext.Provider>
    )
}
export default EnterpriseContextProvider;