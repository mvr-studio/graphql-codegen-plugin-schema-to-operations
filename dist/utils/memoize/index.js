"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize1 = void 0;
function memoize1(fn) {
    const memoize1cache = new WeakMap();
    return function memoized(a1) {
        const cachedValue = memoize1cache.get(a1);
        if (cachedValue === undefined) {
            const newValue = fn(a1);
            memoize1cache.set(a1, newValue);
            return newValue;
        }
        return cachedValue;
    };
}
exports.memoize1 = memoize1;
