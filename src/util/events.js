import { next } from 'rxjs/Subject';

let actions = {
    articleScroll: 'article_scroll',
    articleClick: 'article_click'
};

let events = {
    article: function (path, action) {
        window.events.next({
            path: path,
            action: action
        });
    }
};

export {events, actions};