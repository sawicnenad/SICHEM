import React from 'react';
import Assessment from './exposure/Assessment';
import { Switch, Route } from 'react-router-dom';
import Home from './exposure/Home';
import ART from './exposure/ART';



/*
    Run exposure assessment for established 
    assessment entities of a given workplace

    Renderes the following components:
        *   Assessment - specification of exposure models per entity within a workplace
        *   ART - exposure model to establish a list of input parameters for an asessment entity
        *   Stoffenmanager -||-
        *   TRAv3 -||-
        *   TREXMO+ -||-
*/
export default function Exposure(props) {
    
    // root path without 
    const rootPath = props.match.path.split(':')[0];



    return(
        <div>
            <Switch>
                <Route exact path={`${rootPath}home`} component={Home} />
                <Route exact path={`${rootPath}assessment`} component={Assessment} />
                <Route exact path={`${rootPath}art`} component={ART} />
            </Switch>
        </div>
    )
}