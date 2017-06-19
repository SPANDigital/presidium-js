import { next } from 'rxjs/Subject';

let actions = {
    articleScroll: 'article_scroll',
    articleClick: 'article_click'
};

let events = {
    article: function (id, action, url) {
        window.events.next({
            article_id: id,
            action: action,
            url: url
        });
    },
    roleFilter: function (a) {
        window.events.next({
            event: a
        });
    },
    menu: function(a) {
        window.events.next({
            event: a
        });
    }
};

export {events, actions};