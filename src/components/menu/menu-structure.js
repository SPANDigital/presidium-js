const level1 = 1;
const level2 = 2;
const level3 = 3;

export const MENU_TYPE = {
    SECTION:  'section',
    CATEGORY: 'category',
    ARTICLE:  'article'
};

function menuSection(section, children, filter) {
    return {
        type: MENU_TYPE.SECTION,
        id: section.path,
        level: level1,
        expandable: section.expandable,
        title: section.title,
        slug: section.slug,
        path: section.path,
        children : children,
        filter : filter
    }
}

function menuCategory(section, category, path, level) {
    return {
        type: MENU_TYPE.CATEGORY,
        id: section.path + category,
        level: level,
        expandable: true,
        title: category,
        slug: path,
        path: path,
        children: [],
        filter : new Set()
    };
}

function menuArticle(article, level, defaultFilter) {
    return {
        type: MENU_TYPE.ARTICLE,
        id: article.id,
        path: article.path,
        slug: article.slug,
        title: article.title,
        level: level,
        expandable: false,
        filter: article.filter.length > 0 ? new Set(article.filter) : new Set([defaultFilter])
    }
}

/**
 * Returns a new Set of the merged current and additional filters.
 * Merges the default filter ff no additional filters are provided.
 */
function mergeFilters(current, additional, defaultFilter) {
    if (additional.length > 0) {
        return new Set([...current, ...additional])
    } else {
        return new Set([...current, defaultFilter]);
    }
}

/**
 *  Build the menu structure maintaining the provided order.
 *  Group articles in a section by a distinct category
 *  Filters for each level are composed from filters of all children
 */
export function groupByCategory(section, defaultFilter) {

    let categories = {};
    let children = [];
    let sectionFilter = new Set();

    section.articles.forEach(article => {

        sectionFilter = mergeFilters(sectionFilter, article.filter, defaultFilter);

        if (article.category === "") {
            children.push(menuArticle(article, level2, defaultFilter));
        } else {
            let category;
            if (categories[article.category]) {
                category = categories[article.category];
            } else {
                category = menuCategory(section, article.category, article.path, level2);
                categories[article.category] = category;
                children.push(category);
            }
            category.filter = mergeFilters(category.filter, article.filter, defaultFilter);
            category.children.push(menuArticle(article, level3, defaultFilter));
        }
    });
    return menuSection(section, children, sectionFilter);
}