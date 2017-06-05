import { next } from 'rxjs/Subject';

let eventTypes = {
    articleReadScroll: 'article_read_scroll',
    articleReadClick: 'article_read_click'
};

let events = {
    article: function (id, role, type, url) {
        window.events.next({
            article_id: id,
            selected_role_filter: role,
            event_type: type,
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

export {events, eventTypes};