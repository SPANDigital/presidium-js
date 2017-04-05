import axios from 'axios';

/**
 * A helper that searches for glossary terms in the current page marked by:
 * <em>...</em>. Injects html to allow for hover and linking of content.
 */
export function init() {
    /* API call for glossary data. */
    axios.get("/amp-docs/amp-metrics-docs/glossary.json").then(function(response) {
        /* Search for glossary candidates. */
        let candidates = document.getElementsByTagName('em');

        /* For each term, inject HTML into the DOM. */
        for (let term of candidates) {
            if (response.data[term.innerText]){
                let content = response.data[term.innerText].content;
                let url = response.data[term.innerText].url;

                let parser = new DOMParser();
                let glossary_content = parser.parseFromString(content, "text/html");

                debugger;

                let text = document.createElement('span');
                text.className = "glossary-text";
                text.appendChild(glossary_content.body.firstChild);

                term.className = "glossary-term";
                term.appendChild(text);

                //term.innerHTML =  term.innerHTML + "<span" +
                //    " class='glossary-text'>" + el + "</span>";
            }
        }
    });

}