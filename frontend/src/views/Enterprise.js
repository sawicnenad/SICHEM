import React, { useContext } from 'react';
import Navigation from '../components/enterprise/Navigation';
import { Switch, Route } from 'react-router-dom';
import Home from '../components/enterprise/Home';
import { EnterpriseContext } from '../contexts/EnterpriseContext';
import MyEnterprise from '../components/enterprise/MyEnterprise';
import withAuth from '../hoc/withAuth';
import Chemicals from '../components/enterprise/Chemicals';
import Substance from '../components/enterprise/data-forms/Substance';
import Supplier from '../components/enterprise/data-forms/Supplier';
import Mixture from '../components/enterprise/data-forms/Mixture';
import Workplaces from '../components/enterprise/Workplaces';
import Uses from '../components/enterprise/Uses';
import Use from '../components/enterprise/data-forms/Use';
import Workers from '../components/enterprise/Workers';
import AEntities from '../components/enterprise/AEntities';
import AEntity from '../components/enterprise/aentity/AEntity';
import Assessment from '../components/enterprise/Assessment';
import ART from '../components/enterprise/exposure/ART';
import Stoffenmanager from '../components/enterprise/exposure/Stoffenmanager';
import TRA from '../components/enterprise/exposure/TRA';


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


    // only if context.ent defined ->

    return(
        <div className="wrapper">
            <Navigation />
            <div className="container-lg">
                <Switch>
                    <Route exact path="/enterprise" component={ Home } />
                    <Route exact path="/enterprise/workers" component={ Workers } />
                    <Route exact path="/enterprise/workers/:id" component={ Workers } />
                    <Route exact path="/enterprise/workplaces" component={ Workplaces } />
                    <Route exact path="/enterprise/workplaces/:id" component={ Workplaces } />
                    <Route exact path="/enterprise/uses" component={ Uses } />
                    <Route exact path="/enterprise/uses/:id" component={ Use } />
                    <Route exact path="/enterprise/chemicals/:view" component={ Chemicals } />
                    <Route exact path="/enterprise/substance/:id" component={ Substance } />
                    <Route exact path="/enterprise/supplier/:id" component={ Supplier } />
                    <Route exact path="/enterprise/mixture/:id" component={ Mixture } />
                    <Route exact path="/enterprise/a-entities/" component={ AEntities } />
                    <Route exact path="/enterprise/a-entities/:id" component={ AEntity } />
                    <Route exact path="/enterprise/assessment" component={ Assessment } />
                    <Route exact path="/enterprise/exposure-model/art" component={ ART } />
                    <Route exact path="/enterprise/exposure-model/stoffenmanager" component={ Stoffenmanager } />
                    <Route exact path="/enterprise/exposure-model/tra" component={ TRA } />
                </Switch>
            </div>
        </div>
    )
}
export default withAuth( Enterprise );
