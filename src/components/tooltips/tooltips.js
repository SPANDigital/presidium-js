import axios from 'axios';
import localforage from 'localforage';

/**
 * A helper function, returns true if the entry has expired or if it is
 * undefined, null, or empty.
 * @param {object} data - the cached data.
 */
export function emptyOrExpired(data) {
    return data ? new Date().getTime() > (data.timestamp + data.expire) : true;
}

/**
 * Helper that checks if the value is cached, otherwise performs a GET and set.
 * Returns: promise. TODO raise an error to catch?
 * @param {string} key
 * @param {int} expire - Expiry in milliseconds.
 */
export function getAndOrSet(key, expire=100000) {
    return localforage.getItem(key).then((response) => {
        /* If responseData is not null. */
        if (emptyOrExpired(response)) {
            /* HTTP GET and cache set. */
             console.log("[presidium-js] The response is empty or expired.");
             return axios.get(key).then((response) => {
                 const data = {
                     "key": key,
                     "value": response.data,
                     "timestamp": new Date().getTime(),
                     "expire": expire
                 };
                 localforage.setItem(key, data, (error) => {
                     if(error){
                         console.log("[presidium-js] set failed: " + error);
                     }
                 });
                 return data.value;
             }).catch((error) => {
                 console.log("[presidium-js] GET request with url: " + key +", failed with status" + " code: "+ error.response.status);
             });
         }
         return response.value;
    });
}

/**
 * Note that all terms must correspond exactly to their glossary entry title.
 * @param {object} term - The HTML element (title) of the glossary entry.
 */
export function automaticTooltips(term) {
    /* Create a tooltip - if and only if - a glossary entry exists for the
     term. */
    getAndOrSet(window.location.pathname + '/glossary.json').then((data) => {
        let key = term.innerText;
        if (data[key]) {
            const content = data[key].content;
            const url = data[key].url;

            const parser = new DOMParser();
            const glossaryContent = parser.parseFromString(content, "text/html").body.firstChild;

            /* Create the tooltip. */
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltips-text';
            tooltip.appendChild(glossaryContent);

            term.href = url;
            term.className = 'tooltips-term';
            term.removeAttribute('title');
            term.appendChild(tooltip);
        }
    }).catch((error) => {
        console.log("[presidium-js] Could not create the tooltip: " + error);
    });
}

/**
 * If this element has a link that matches the base URL for this project,
 * then create a 'link' tooltip. External URLs are not supported.
 * @param {object} term - The HTML element that has been flagged as a tooltip.
 * @param {string} url - The URL supplied to article for the content.
 */
export function linkTooltips(term, url) {
    getAndOrSet(url).then((data) => {
        /* Create the HTML elements from the result. */
        let parser = new DOMParser();
        const page = parser.parseFromString(data, "text/html");

        /* We need to use the url to get the term name, as the string used
         * by the writer (i.e. [...my string...]) might not contain any
         * reference to the topic.
         */

        /* Get the last string after '/'. */
        let slugTitle = url.substr(url.lastIndexOf('/') + 1).replace('#', ''); // Removing the 1st occurrence of # might be too restrictive.

        /* Find the span anchor with an ID that matches the article slug. */
        let match = page.querySelectorAll("span.anchor" + `[id="${slugTitle}"]`)[0];
        if (match) {
            /* Its parent is the article div, which we want to search for
             the <article> tag. */
            let content = match.parentElement.getElementsByTagName('article')[0];

            /* Create the tooltip. */
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltips-text';

            /* If the first <p> is an image do we add an extra <p>? */
            tooltip.appendChild(content.getElementsByTagName('p')[0]);

            term.href = url;
            term.className = 'tooltips-term';

            term.removeAttribute('title');
            term.appendChild(tooltip);
        }
    }).catch((error) => {
        console.log("[presidium-js] Could not create the tooltip: " + error);
    });

}

/**
 * The initializer that searches for glossary terms in the current page
 * marked by: <a title='presidium-tooltip'>...</a>. Injects html to allow for
 * hover and linking of content.
 */
export function init() {

    /* Search for tooltip candidates. */
    const links = document.getElementsByTagName('a');
    const pageTerms = [...links].filter((link) => {
        return link.title === "presidium-tooltip";
    });

    /* For each presidium tooltip term inject HTML into the DOM. */
    for (let term of pageTerms) {
        const url = term.getAttribute('href');

        /* Convention url === #: create automatic tooltips from /glossary. */
        url === "#" ? automaticTooltips(term): linkTooltips(term, url);
    }
}