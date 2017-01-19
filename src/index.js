import React from 'react';
import { loadMenu } from './components/menu';

var presidium = {
    menu : {
        load : loadMenu,
    }
};

window.presidium = presidium;
