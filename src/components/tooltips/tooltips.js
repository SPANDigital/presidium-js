import axios from 'axios';

const parser = new DOMParser();

/**
 * Helper function that manipulates the DOM by adding the tooltip & attributes.
 *
 * @param term {object} - The HTML element that has been flagged as a tooltip.
 * @param content {object} - The content as a HTML element.
 * @param url {string}
 */
export function createTooltip(term, content, url) {
    const tooltip = document.createElement('span');
    tooltip.setAttribute('class', 'tooltips-text');
    tooltip.appendChild(content.querySelector('p'));

    term.setAttribute('href', url);
    term.setAttribute('class', 'tooltips-term');
    term.removeAttribute('title');
    term.appendChild(tooltip);
}

/**
 * If this element has a link that matches the base URL for this project,
 * then create a 'link' tooltip. External URLs are not supported. Required
 * to use the url to find the term name as the string used by the content writer
 * (i.e. [...my string...]) might not contain any reference to the topic.
 *
 * @param {object} term - The HTML element that has been flagged as a tooltip.
 * @param {string} url - The URL supplied to article for the content.
 */
export function linkTooltips(term) {
    const url = term.getAttribute('href');

    axios.get(url).then((response) => {
        const page = parser.parseFromString(response.data, "text/html");

        let slugTitle = url.substr(url.lastIndexOf('/') + 1).replace('#', '');
        let match = page.querySelector(`span.anchor[id="${slugTitle}"]`);

        if (match) {
            createTooltip(term, match.parentElement.querySelector('article'), url);
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
export function loadTooltips(config = {}) {
    presidium.tooltips.config = config;
    const baseSelector = 'a[title=presidium-tooltip]';

    document.querySelectorAll(`${baseSelector}[href^="${config.baseurl}"]`).forEach((term) => {
        linkTooltips(term);
    });

    axios.get(config.baseurl + '/glossary.json').then((response) => {
        document.querySelectorAll(`${baseSelector}[href="${'#'}"]`).forEach((term) => {
            let glossary = response.data[term.innerText];
            createTooltip(term, parser.parseFromString(glossary.content, "text/html"), glossary.url);
        });
    }).catch((error) => {
        console.log("[presidium-js] Could not create glossary tooltips: " + error);
    });
}

