const level1 = 1;
const level2 = 2;
const level3 = 3;

export const MENU_TYPE = {
    SECTION: 'section',
    CATEGORY: 'category',
    ARTICLE: 'article'
};

function menuSection(item, children) {
    return {
        type: MENU_TYPE.SECTION,
        id: item.path,
        level: level1,
        title: item.title,
        path: item.path,
        children : children
    }
}

function menuArticle(article, level) {
    return {
        type: MENU_TYPE.ARTICLE,
        id: article.id,
        path: article.path,
        title: article.title,
        level: level
    }
}

function menuCategory(section, category, path, level) {
    return {
        type: MENU_TYPE.CATEGORY,
        id: section.path + category,
        level: level,
        title: category,
        path: path, // first article in category
        children: []
    };
}

/**
 *  Group section articles by category maintaining the original order.
 *  Ensures only one group of articles exists in a section.
 */
export function groupByCategory(section) {

    let children = [];
    let categories = {};
    let category;

    section.articles.forEach(item => {

        category = item.category;
        if (category === "") {
            children.push(menuArticle(item, level2));
        } else {
            if (!categories[category]) {
                categories[category] = menuCategory(section, item.category, item.path, level2);
                children.push(categories[category]);
            }
            categories[category].children.push(menuArticle(item, level3));
        }
    });
    return menuSection(section, children);

}