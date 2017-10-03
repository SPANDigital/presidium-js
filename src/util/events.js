import {next} from 'rxjs/Subject';

const TOPICS = {
    RANKING_LOADED: 'RANKING_LOADED'
};

let ACTIONS = {
    articleScroll: 'article_scroll',
    articleClick: 'article_click',
    articleLoad: 'article_load'
};

let EVENTS_DISPATCH = {
    ARTICLE: (path, action) => {
        if (path) {
            window.events.next({
                path: path,
                action: action
            });
        }
    }
};

export {EVENTS_DISPATCH, ACTIONS, TOPICS};