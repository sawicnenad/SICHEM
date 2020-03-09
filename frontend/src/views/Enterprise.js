import React, { useContext } from 'react';
import Navigation from '../components/enterprise/Navigation';
import { Switch, Route } from 'react-router-dom';
import Home from '../components/enterprise/Home';
import { EnterpriseContext } from '../contexts/EnterpriseContext';
import MyEnterprise from '../components/enterprise/MyEnterprise';
import withAuth from '../hoc/withAuth';
import Chemicals from '../components/enterprise/Chemicals';
import Substance from '../components/enterprise/data-forms/Substance';
import DataForm from '../components/enterprise/data-forms/DataForm';
import Supplier from '../components/enterprise/data-forms/Supplier';

/*
    view specific for enterprises
    only for paths /enterprise

    first it checks if the current user is member of an 
    enterpirse -> if not, the page redirects to the 
    corresponding one to finish registration process
*/


function Enterprise() {
    const context = useContext(EnterpriseContext);

    if (!context.loaded){
        return (
            <div>loading...</div>
        )
    }
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
                <Route exact path="/enterprise/chemicals/:view" component={ Chemicals } />
                <Route exact path="/enterprise/substance/:id" component={ Substance } />
                <Route exact path="/enterprise/supplier/:id" component={ Supplier } />
                <Route exact path="/enterprise/data-entry/" component={ DataForm } />
            </Switch>
        </div>
    )
}
export default withAuth( Enterprise );