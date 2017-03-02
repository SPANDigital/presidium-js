import React from 'react';
import { loadMenu } from './components/menu/menu';
import { init as initModal} from './components/image/modal';

var presidium = {
    menu : {
        load : loadMenu,
    }
};

window.presidium = presidium;

initModal();
