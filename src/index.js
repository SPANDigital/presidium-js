import React from 'react';
import { loadMenu } from './components/menu/menu';
import { init as initModal} from './components/image/modal';
import { init as initTerms } from './components/glossary/terms';

var presidium = {
    menu : {
        load : loadMenu,
    }
};

window.presidium = presidium;

initModal();

initTerms();