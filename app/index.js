import React from 'react';
import ReactDOM from "react-dom";
import {HashRouter as Router,Redirect, Switch, Route} from 'react-router-dom';
import 'antd/dist/antd.less';
import {Button} from 'antd';

import NotFound from './notfound';

import Login from './login.js';

const requireAuth = (nextState, replace) => {
    // 未登录，重新登录
    if (IndexStore.cuttentUser === null) {
        replace({ pathname: '/' })
    }
}


ReactDOM.render((
    <Router>
        <Switch>
            <Redirect exact from='/' to='/signin'/>
            <Route path="/signin" component={Login}/>
            <Route path="/main" component={NotFound}/>
            <Route component={NotFound}/>
        </Switch>
    </Router>
), document.getElementById('root'));


