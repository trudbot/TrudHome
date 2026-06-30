/*
输入：{a:1, b:2}
输出：{"a":1, "b":2}
*/
function toJSONStr(str) {
    return str.replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":'});
}

function parseResponse(text, cb) {
    const trimmed = text.trim();
    const match = trimmed.match(new RegExp(`^${cb}\\(([\\s\\S]*)\\);?$`));
    const jsonStr = match ? match[1] : trimmed;

    try {
        return JSON.parse(jsonStr);
    } catch {
        return JSON.parse(toJSONStr(jsonStr));
    }
}

export const corsFetch = async (url, charset) => {
    const cb = 'json';
    // 打包为扩展时, 可以配置允许跨域请求, 因此自己请求并且解析jsonp返回
    if (__MODE === "EXT") {
        // 创建URL对象
        const urlObj = new URL(url);
        // 添加cb=json参数
        urlObj.searchParams.set('cb', cb);
        return (await import("webextension-polyfill")).default.runtime
        .sendMessage({type: "fetch", data: urlObj.toString(), charset})
        .then(text => parseResponse(text, cb));
    } else {
        return (await import("fetch-jsonp")).default(url, {jsonpCallback: 'cb'}).then(res => res.json());
    }
};