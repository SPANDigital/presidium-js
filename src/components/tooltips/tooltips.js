import axios from 'axios';
import { slugify } from '../../util/slug';

const parser = new DOMParser();

/**
 * Prints an error message and replaces <a title='presidium-tooltip'/> with
 * the term's text.
 * @param {object} error
 * @param {object} terms
 */
function tooltipError(error, terms) {
    console.log(error);
    terms.forEach((term) => {
        console.log(`[presidium-js] Could not create the tooltip: ${term.innerText}`);
        term.replaceWith(term.innerText);
    });
}

/**
 * Helper function that manipulates the DOM by adding the tooltip & attributes.
 *
 * @param term {object} - The HTML element that has been flagged as a tooltip.
 * @param content {object} - The content as a HTML element.
 * @param url {string}
 */
export function addToDom(term, content, url) {
    const tooltip = document.createElement('span');
    tooltip.setAttribute('class', 'tooltips-text');
    tooltip.appendChild(content.querySelector('p'));

    term.setAttribute('href', url);
    term.setAttribute('class', 'tooltips-term');
    term.removeAttribute('title');
    term.appendChild(tooltip);
}

/**
 * Parses page HTML, creates tooltip if the article can be found.
 *
 * @param {object} term - The HTML element that has been flagged as a tooltip.
 * @param {string} page - HTML page from which the tooltip content comes.
 * @param {string} url  - The page's URL.
 */
export function createTooltip(term, page, url) {

    let title = url.substr(url.lastIndexOf('/') + 1).replace('#', '')
    let match = parser.parseFromString(page, "text/html").querySelector(`span.anchor[id="${title}"]`);

    if (match) {
        try {
            addToDom(term, match.parentElement.querySelector('article'), url);
        } catch(error) {
            tooltipError(error, [term])
        }
    } else {
        tooltipError(`Term: ${title}, has no match.`, [term]);
    }
}

/**
 * The initializer that searches for glossary terms in the current page
 * marked by: <a title='presidium-tooltip'>...</a>.
 * @param {object} config - Configuration parameters passed when the
 * component is loaded.
 */
export function loadTooltips(config = {}) {
    presidium.tooltips.config = config;
    const glossaryTerms = document.querySelectorAll(`a[title=presidium-tooltip][href="${'#'}"]`);
    const linkTerms = document.querySelectorAll(`a[title=presidium-tooltip][href^="${config.baseurl}"]`);

    if (glossaryTerms.length > 0) {
        axios.get(`${config.baseurl}/glossary/`).then((response) => {
            glossaryTerms.forEach((term) => {
                let url = `${config.baseurl}/glossary/#${slugify(term.innerText)}`;
                createTooltip(term, response.data, url);
            });
        }).catch((error) => {
            tooltipError(error, glossaryTerms)
        });
    }

    linkTerms.forEach((term) => {
        const url = term.getAttribute('href');
        axios.get(url).then((response) => {
            createTooltip(term, response.data, url);
        }).catch((error) => { tooltipError(error, [term]) });
    });
}

