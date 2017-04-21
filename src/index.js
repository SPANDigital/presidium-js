import React from 'react';
import { loadMenu } from './components/menu/menu';
import { init as initModal} from './components/image/modal';
import { init as initTooltips } from './components/tooltips/tooltips';

var presidium = {
    menu : {
        load : loadMenu,
    }
};

window.presidium = presidium;

initModal();

initTooltips();