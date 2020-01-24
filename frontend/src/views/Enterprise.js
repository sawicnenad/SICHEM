import React, { useContext } from 'react';
import Navigation from '../components/enterprise/Navigation';
import { Switch, Route } from 'react-router-dom';
import Home from '../components/enterprise/Home';
import { EnterpriseContext } from '../contexts/EnterpriseContext';
import MyEnterprise from '../components/enterprise/MyEnterprise';

/*
    view specific for enterprises
    only for paths /enterprise

    first it checks if the current user is member of an 
    enterpirse -> if not, the page redirects to the 
    corresponding one to finish registration process
*/


function Enterprise() {
    const context = useContext(EnterpriseContext);

    if (context.ent === undefined) {
        return (
            <div className="container pt-5">
                <MyEnterprise />
            </div>
        )
    }
    
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