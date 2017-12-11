const CACHE_KEYS = {
    EDIT_BUTTON: 'presidium.editButton'
};

/**
 * For shared data between components that have their own stores
 * @type {{set: (function(*=, *=)), get: (function()), delete: (function())}}
 */

const cache = {
    set: (key, val) => {
        if (typeof val === 'object') val = JSON.stringify(val)
        sessionStorage.setItem(key, val);
    },
    get: (key) => {
        let val = sessionStorage.getItem(key);
        if (_isJSONString(val)) val = JSON.parse(val);
        return val;
    },
    delete: (key) => {
        sessionStorage.removeItem(key);
    }
};

const _isJSONString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export {
    cache,
    CACHE_KEYS
}
