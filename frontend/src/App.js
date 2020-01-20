import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Enterprise from './views/Enterprise';
import Login from './views/Login';


function App() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={ Login } />
                    <Route path="/enterprise" component={ Enterprise } />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
