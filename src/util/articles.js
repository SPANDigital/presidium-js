import {ACTIONS, EVENTS_DISPATCH} from './events';

const mountContainerListeners = () => {
    const scrollPause = 2000;
    let timeout;
    window.addEventListener('scroll', () => {
        clearTimeout(timeout);
        timeout = setTimeout(findArticlesInView, scrollPause);
    })
}

const findArticlesInView = () => {
    let articles = [...document.querySelectorAll('.article')];
    articles.map((article) => {
        if (isInViewport(article)) {
            const articleId = article.querySelector('span[data-id]').getAttribute('data-id');
            let permalink = article.querySelector('.permalink a')
            // Section titles do not have a permalink
            if (permalink) {
                markArticleAsViewed(articleId, permalink.getAttribute('href'), ACTIONS.articleScroll);
            }
        }
    })
}

const markArticleAsViewed = (articleId, permalink = null, action = ACTIONS.articleScroll) => {
    const cachedSolution = sessionStorage.getItem('presidium.solution');
    if (!cachedSolution) return;

    const hash = `PRESIDIUM-ACTION:${articleId}:${cachedSolution || ''}`;
    const cachedAction = sessionStorage.getItem(hash)

    if (!cachedAction) {
        EVENTS_DISPATCH.ARTICLE(articleId, permalink, action, cachedSolution);
        sessionStorage.setItem(hash, action)
    }
};

/**
 * Concatenate uri with single slash
 */
const path = {
    concat: function (base, target) {
        return base +
            path.forceTrailing(base) +
            path.removeLeading(target);
    },
    forceTrailing: function (path) {
        return path == null ? '/' : (path.substr(-1) != '/' ? '/' : '');
    },
    removeLeading: function (path) {
        return path == null ? '' : (path.substr(0, 1) == '/' ? path.substr(1) : path)
    }
};

/**
 * Generic replacement for NPM slug lib
 */
const slugify = (value) => {
    return value.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Calculate if article is within viewport dimensions
 * @param element
 * @returns {boolean}
 */

 const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    const height = window.innerHeight
    if(rect.top < 0) {
        return rect.height + rect.top > height;
    }
    return rect.top + rect.height < height;
}

window.isInViewport = isInViewport;

export {
    path,
    slugify,
    isInViewport,
    markArticleAsViewed,
    mountContainerListeners
}