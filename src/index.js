import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import Menu from './components/menu';
import reducers from './reducers';
import promise from 'redux-promise';

import 'react-widgets/lib/less/react-widgets.less';
import 'react-widgets/dist/css/react-widgets.css'

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(

    <Provider store={createStoreWithMiddleware(reducers)}>
        <Menu/>
    </Provider>,
    document.getElementById('nav-container')
);
