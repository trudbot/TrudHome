import Browser from "webextension-polyfill";

// 通用的fetch函数，支持不同编码格式
async function fetchWithEncoding(url, encoding = 'utf-8') {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder(encoding);
    return decoder.decode(buffer);
}

Browser.runtime.onMessage.addListener((message) => {
    if (message?.type === 'fetch' && message?.data) {
        return fetchWithEncoding(message.data, message?.charset).then(text => {
            return text;
        });
    }
});