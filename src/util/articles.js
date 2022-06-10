/**
 * Concatenate uri with single slash
 */
const path = {
  concat: function (base, target) {
    return base + path.forceTrailing(base) + path.removeLeading(target);
  },
  forceTrailing: function (path) {
    return path == null ? '/' : path.substr(-1) != '/' ? '/' : '';
  },
  removeLeading: function (path) {
    return path == null ? '' : path.substr(0, 1) == '/' ? path.substr(1) : path;
  },
};

/**
 * Generic replacement for NPM slug lib
 */
const slugify = (value) => {
  return value
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

export { path, slugify };
