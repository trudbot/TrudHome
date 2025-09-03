export function useRef(initialValue) {
    const callbacks = [];
    let _value = initialValue;

    const ref = {
        __isRef: true,
        get value() {
            return _value;
        },
        set value(newValue) {
            const old = _value;
            _value = newValue;
            newValue !== old && callbacks.forEach(cb => cb(newValue, old));
        },
        subscribe(cb) {
            if (typeof cb === 'function') callbacks.push(cb);
        },
        unsubscribe(cb) {
            const idx = callbacks.indexOf(cb);
            if (idx >= 0) callbacks.splice(idx, 1);
        }
    };

    return ref;
}

export function watchRef(ref, callback) {
    if (!ref || !ref.__isRef) {
        throw new Error('watchRef expects a ref created by useRef');
    }
    ref.subscribe(callback);
    return () => ref.unsubscribe(callback);
}
