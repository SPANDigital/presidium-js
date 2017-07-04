import { next } from 'rxjs/Subject';

let actions = {
    articleScroll: 'article_scroll',
    articleClick: 'article_click',
    articleLoad: 'article_load'
};

let events = {
    article: function (path, action) {
        if(path) {
            window.events.next({
                path: path,
                action: action
            });
        }
    }
};

export {events, actions};