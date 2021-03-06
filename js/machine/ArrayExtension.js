Array.prototype.compare = function(testArr) {
    if (this.length !== testArr.length) return false;

    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) {
            if (!this[i].compare(testArr[i])) return false;
        } else if (this[i] !== testArr[i]) return false;
    }

    return true;
};

Array.prototype.indexOfObject = function (e, fn) {
    if (!fn) {
        return this.indexOf(e)
    }

    else {
        if (typeof fn === 'string') {
            var att = fn;

            fn = function (e) {
                return e[att];
            }
        }

        return this.map(fn).indexOf(e);
    }
};