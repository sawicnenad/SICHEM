import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Enterprise from './views/Enterprise';
import Login from './views/Login';
import EnterpriseContextProvider from './contexts/EnterpriseContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import './css/myStyle.css';
import { 
    faCheckSquare,
    faCoffee,
    faBuilding,
    faDatabase,
    faFlask,
    faUser,
    faFire,
    faTh,
    faGlobe,
    faEllipsisV,
    faSave,
    faTrashAlt,
    faPlus,
    faTimes,
    faMinus
} from '@fortawesome/free-solid-svg-icons';
 
library.add(
    faCheckSquare,
    faCoffee,
    faBuilding,
    faDatabase,
    faFlask,
    faUser,
    faFire,
    faTh,
    faGlobe,
    faEllipsisV,
    faSave,
    faTrashAlt,
    faPlus,
    faTimes,
    faMinus
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
