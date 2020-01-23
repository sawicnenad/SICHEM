import React from 'react';
import Navigation from '../components/enterprise/Navigation';
import { Switch, Route } from 'react-router-dom';
import Home from '../components/enterprise/Home';

/*
    view specific for enterprises
    only for paths /enterprise
*/


function Enterprise() {
    
    return(
        <div>
            <Navigation />
            <Switch>
                <Route exact path="/enterprise" component={ Home } />
            </Switch>
        </div>
    )
}
export default Enterprise;