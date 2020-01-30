import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Enterprise from './views/Enterprise';
import Login from './views/Login';
import EnterpriseContextProvider from './contexts/EnterpriseContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
    faCheckSquare,
    faCoffee,
    faBuilding,
    faDatabase,
    faFlask,
    faUser,
    faFire,
    faTh
} from '@fortawesome/free-solid-svg-icons';
 
library.add(
    faCheckSquare,
    faCoffee,
    faBuilding,
    faDatabase,
    faFlask,
    faUser,
    faFire,
    faTh
);

function App() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={ Login } />

                    <EnterpriseContextProvider>
                        <Route path="/enterprise" component={ Enterprise } />
                    </EnterpriseContextProvider>
                    
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
