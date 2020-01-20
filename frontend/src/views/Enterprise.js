import React from 'react';
import Navigation from '../components/enterprise/Navigation';
import { Switch, Route } from 'react-router-dom';
import Start from '../components/enterprise/Start';


/*
    view specific for enterprises
    only for paths /enterprise
*/


function Enterprise() {
    
    return(
        <div className="big-wrapper">
            <Navigation />
            <div className="wrapper">
                <Switch>
                    <Route path="/" component={ Start } />
                </Switch>
            </div>
        </div>
    )
}
export default Enterprise;