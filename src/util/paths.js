/**
 * Concatenate uri with single slash
 */
var path = {
    concat: function (base, target) {
        return base +
            path.forceTrailing(base) +
            path.removeLeading(target);
    },
    forceTrailing: function (path) {
        return path == null ? "/" : (path.substr(-1) != "/" ? "/" : "");
    },
    removeLeading: function(path) {
        return path == null ? "" : (path.substr(0, 1) == "/" ? path.substr(1) : path)
    }
};

export default path;