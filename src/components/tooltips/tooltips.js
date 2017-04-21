import axios from 'axios';
import localforage from 'localforage';

/* TODO: Remove baseurl, and any project specific variables that could instead be pulled from the config. */

/* Sourced from https://gist.github.com/andrei-m/982927 */
function levenshtein(a, b) {
    if(a.length == 0) return b.length;
    if(b.length == 0) return a.length;

    // swap to save some memory O(min(a,b)) instead of O(a)
    if(a.length > b.length) {
        const tmp = a;
        a = b;
        b = tmp;
    }

    const row = [];
    // init the row
    for(var i = 0; i <= a.length; i++){
        row[i] = i;
    }

    // fill in the rest
    for(var i = 1; i <= b.length; i++){
        let prev = i;
        for(let j = 1; j <= a.length; j++){
            let val;
            if(b.charAt(i-1) == a.charAt(j-1)){
                val = row[j-1]; // match
            } else {
                val = Math.min(row[j-1] + 1, // substitution
                    prev + 1,     // insertion
                    row[j] + 1);  // deletion
            }
            row[j - 1] = prev;
            prev = val;
        }
        row[a.length] = prev;
    }

    return row[a.length];
}

/**
 * @param key
 * Helper that checks if the value is cached, otherwise performs a GET.
 * Returns: promise object.
 */
function getAndOrSet(key) {
    /* TODO: Abstract this out into its own function. */
    return localforage.getItem(key, function (err, responseData) {

        if(err === null){ /* API only returns null on failure. */
            console.log("[presidium-js] The response is empty or expired.");
            /* Make the asynchronous call - the key must always be a valid URL.*/
            axios.get(key).then(function(response) {
                responseData = response.data;
                /* Thereafter, save in local storage. */
                localforage.setItem(key, responseData, function (err) {
                    if (err) {
                        console.log("[presidium-js] Problem setting value: "+ err );
                    }
                });
            }).catch((error) => {
                console.log("[presidium-js] GET request with url: " +
                    + key +", failed with status" +
                    " code: "+ error.status);
            });
        }
        return responseData;
    });
}

/**
 *
 * @param term
 */
function automaticTooltips(term) {
    /* Create a tooltip - if and only if - a glossary entry exists for the
     term. */

    /* API call for glossary data. */
    getAndOrSet('/amp-docs/amp-metrics-docs/glossary.json').then((data) => {
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
            term.target = '_blank';
            term.className = 'tooltips-term';
            term.removeAttribute('title');
            term.appendChild(tooltip);
        }
    });
}

/**
 * If this element has a link that matches the base URL for this project,
 * then create a 'link' tooltip. External URLs are not supported.
 * @param {string} term - The HTML element that has been flagged as a tooltip.
 * @param {string} url - The URL supplied to article for the content
 */
function createLinkTooltips(term, url) {

    /* Make an API call to get the page data. */
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

            //debugger;
            //let newC = document.createElement('p');
            //newC.innerText

            tooltip.appendChild(content.getElementsByTagName('p')[0]);

            term.href = url;
            term.target = '_blank';
            term.className = 'tooltips-term';
            term.removeAttribute('title');
            term.appendChild(tooltip);
        }
    });

}

/**
 * A helper that searches for glossary terms in the current page marked by:
 * <em>...</em>. Injects html to allow for hover and linking of content.
 */
export function init() {

    /* Search for tooltip candidates. */
    const links = document.getElementsByTagName('a');
    const pageTerms = [...links].filter((link) => {
        return link.title === "presidium-tooltip";
    });

    /* For each term inject HTML into the DOM. */
    for (let term of pageTerms) {
        const url = term.getAttribute('href');

        if (url) { /* Url is not an empty string. */
            /* Set up special tooltips for specific articles NOT in /glossary */
            createLinkTooltips(term, url);
        } else { /* No url provided search /glossary. */
            /* Set up tooltips for those that have glossary entries. */
            automaticTooltips(term);
        }
    }
}