import React from 'react';
import ReactDOM from "react-dom";
import {HashRouter as Router,Redirect, Switch, Route} from 'react-router-dom';
import 'antd/dist/antd.less';
import {IndexStore} from './api.js';
import NotFound from './notfound';

import Login from './login.js';
import App from './App.js';
import Main from './main';



ReactDOM.render((
    <Router>
        <Switch>
            <Redirect exact from='/' to='/signin'/>
            <Route path="/signin" component={Login}/>
            <Route path="/main" component={Main}/>
            <Route component={NotFound}/>
        </Switch>
    </Router>
), document.getElementById('root'));


