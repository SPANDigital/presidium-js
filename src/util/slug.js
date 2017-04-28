const slug = require('slug');

export function slugify(value) {
    return slug(value, { mode: 'rfc3986' });
};
