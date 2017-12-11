import {cache, CACHE_KEYS} from "./cache";

/**
 * Get key/value pairs from the query string
 * @returns {string[]}
 */
const getUrlVars = () => {
    return window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
};

/**
 * Save query string key/value pairs to sessionStorage
 */
const handleQueryString = () => {
    const hashes = getUrlVars();
    hashes.map((hash) => {
        const vals = hash.split("=");
        cache.set(`presidium.${vals[0]}`, vals[1]);
    })
};

const checkSessionStorageConfig = () => {
    const articleTitles = [...document.querySelectorAll('.article-title')];
    if (cache.get(CACHE_KEYS.EDIT_BUTTON) === true) return showEditHover(articleTitles);
    removeEditHover(articleTitles);
};

const showEditHover = (articleTitles) => {
    articleTitles.map((elem) => {
        if (!elem.classList.contains('edit')) elem.classList.add('edit');
    });
};

const removeEditHover = (articleTitles) => {
    articleTitles.map((elem) => {
        if (elem.classList.contains('edit')) elem.classList.remove('edit');
    });
};


export {
    handleQueryString,
    checkSessionStorageConfig
};













