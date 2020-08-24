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
    faTh,
    faGlobe,
    faEllipsisV,
    faSave,
    faTrashAlt,
    faPlus,
    faTimes,
    faMinus,
    faFilePdf,
    faExchangeAlt,
    faWindowClose,
    faSignOutAlt,
    faHome,
    faLock,
    faEdit,
    faCalendarAlt,
    faUserClock,
    faBusinessTime,
    faCog,
    faCogs,
    faInfoCircle,
    faCalculator,
    faExclamationTriangle
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
    faMinus,
    faFilePdf,
    faExchangeAlt,
    faWindowClose,
    faHome,
    faSignOutAlt,
    faLock,
    faEdit,
    faUserClock,
    faBusinessTime,
    faCog,
    faCogs,
    faCalendarAlt,
    faInfoCircle,
    faCalculator,
    faExclamationTriangle
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

            <footer className="p-5 bg-light text-secondary text-center border-top">
                <div className="font-weight-bold">
                    SICHEM 2020 (version 0.3)
                </div>
                <div>
                    Nenad Savić
                </div>
                <div>
                    <a href="mailto: nenad.savic@unisante.ch">
                        nenad.savic@unisante.ch
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default App;
