import axios from 'axios';

/**
 * Note that all terms must correspond exactly to their glossary entry title.
 * @param {object} term - The HTML element (title) of the glossary entry.
 */
export function automaticTooltips(term) {
    /* Create a tooltip - if and only if - a glossary entry exists for the
     term. */
    axios.get(window.location.pathname + '/glossary.json').then((response) => {
        let key = term.innerText;
        if (response.data[key]) {
            const content = response.data[key].content;
            const url = response.data[key].url;

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
    axios.get(url).then((response) => {

        /* Create the HTML elements from the result. */
        let parser = new DOMParser();
        const page = parser.parseFromString(response.data, "text/html");

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