function toJSONStr(str) {
    return str.replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":'});
}
export const corsFetch = async (url, charset) => {
    const cb = 'json';
    if (__MODE === "EXT") {
        // 创建URL对象
        const urlObj = new URL(url);
        // 添加cb=json参数
        urlObj.searchParams.set('cb', cb);
        return (await import("webextension-polyfill")).default.runtime
        .sendMessage({type: "fetch", data: urlObj.toString(), charset})
        .then(text => {
            const regex = new RegExp(`^${cb}\\((.*)\\);$`);
            const jsonStr = text.match(regex)[1];
            return JSON.parse(toJSONStr(jsonStr));
        });
    } else {
        return (await import("fetch-jsonp")).default(url, {jsonpCallback: 'cb'}).then(res => res.json());
    }
};