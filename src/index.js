import React from 'react';
import { loadMenu } from './components/menu/menu';
import { init as initModal} from './components/image/modal';
import { loadTooltips } from './components/tooltips/tooltips';

var presidium = {
    menu : {
        load : loadMenu,
    },
    tooltips : {
        load : loadTooltips,
    }
};

window.presidium = presidium;

initModal();