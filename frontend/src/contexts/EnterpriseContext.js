import React from 'react';


// holds enterprise data only
// suppliers, substances, mixtures ...
export const EnterpriseContext = React.createContext();


function EnterpriseContextProvider(props) {
    return (
        <EnterpriseContext.Provider value={}>
            { props.children }
        </EnterpriseContext.Provider>
    )
}
export default EnterpriseContextProvider;