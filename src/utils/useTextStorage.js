export function useTextStorage(name, defaultValue) {
    const value = window.localStorage.getItem(name) || defaultValue;
    const callbacks = [];

    const handle = {
        set(newValue) {
            window.localStorage.setItem(name, newValue);
            callbacks.forEach(callback => callback(newValue, this.value));
            this.value = newValue;
        },
        subscribe(callback) {
            callbacks.push(callback);
        },
        unsubscribe(callback) {
            const index = callbacks.indexOf(callback);
            if (index >= 0) {
                callbacks.splice(index, 1);
            }
        },
        value: value
    };

    return handle;
}