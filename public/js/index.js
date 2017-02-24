import React from 'react';
import { render } from 'react-dom';
import Layout from './components/layout';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import Styles from '../stylus/index.styl'

const target = document.getElementById('app-root');

render(
  <Router history={hashHistory}>
    <Route path="/" component={Layout}></Route>
  </Router>
, target);