import Browser from "webextension-polyfill";

Browser.runtime.onMessage.addListener(async (message) => {
    if (message?.type === 'fetch' && message?.data) {
        const res = await fetch(message.data);
        return res.json();
    }
});