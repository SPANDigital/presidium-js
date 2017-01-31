/**
 * Concatenate uri with single slash
 */
export function concat_path(base, target) {
    return base +
        forceTrailing(base) +
        removeLeading(target);
}

function forceTrailing(path) {
    return path == null ? "/" : (path.substr(-1) != "/" ? "/" : "");
}
function removeLeading(path) {
    return path == null ? "" : (path.substr(0, 1) == "/" ? path.substr(1) : path)
}

