import paths from '../../util/paths';

const level1 = 1;
const LEVEL_2 = 2;
const LEVEL_3 = 3;
const LEVEL_4 = 4;

export const MENU_TYPE = {
    SECTION:  'section',
    CATEGORY: 'category',
    ARTICLE:  'article'
};

function menuSection(section) {
    return {
        type: MENU_TYPE.SECTION,
        id: section.path,
        level: level1,
        expandable: section.expandable,
        title: section.title,
        slug: section.slug,
        path: section.path,
        categories: {},
        children : [],
        filters : new Set()
    }
}

function menuCategory(key, id, path, level) {
    return {
        type: MENU_TYPE.CATEGORY,
        id: id,
        level: level,
        expandable: true,
        title: key,
        slug: path,
        path: path,
        categories: {},
        children: [],
        filters : new Set()
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
        filters: article.filters.length > 0 ? new Set(article.filters) : new Set([defaultFilter])
    }
}

/**
 * Returns a new Set of the merged current and additional filters.
 * Merges the default filters ff no additional filters are provided.
 */
function mergeSets(current, additional, defaultFilter) {
    if (additional.length > 0) {
        return new Set([...current, ...additional])
    } else {
        return defaultFilter ? new Set([...current, defaultFilter]) : current;
    }
}
/**
 * Creates or gets a category.
 */
function getOrCreateCategory(section, key, path, level) {
    let category;
    if (section.categories[key]) {
        category = section.categories[key];
    } else {
        const id = paths.concat(section.id, key);
        category = menuCategory(key, id, path, level);
        section.categories[key] = category;
        section.children.push(category);
    }
    return category;
}

function hasSub(categories) {
    return categories.length > 1;
}
/**
 *  Build the menu structure maintaining the provided order.
 *  Group articles in a section by a distinct category and optional sub category
 *  Filters for each subsection are merged to a parents for filtering.
 */
export function groupByCategory(root, defaultFilter) {

    const section = menuSection(root);

    root.articles.forEach(article => {

        section.filters = mergeSets(section.filters, article.filters, defaultFilter);

        if (!article.category) {
            section.children.push(menuArticle(article, LEVEL_2, defaultFilter));
        } else {
            const categories = article.category.split('/');
            const category = getOrCreateCategory(section, categories[0], article.path, LEVEL_2);
            category.filters = mergeSets(category.filters, article.filters, defaultFilter);

            if (!hasSub(categories)) {
                category.children.push(menuArticle(article, LEVEL_3, defaultFilter));
            } else {
                const subCategory = getOrCreateCategory(category, categories[1], article.path, LEVEL_3);
                subCategory.filters = mergeSets(subCategory.filters, article.filters, defaultFilter);
                subCategory.children.push(menuArticle(article, LEVEL_4, defaultFilter));
            }
        }
    });
    return section;
}

