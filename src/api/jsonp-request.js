export const corsFetch = async (url, charset) => {
    const cb = 'json';
    // 打包为扩展时, 可以配置允许跨域请求, 因此不需要使用jsonp
    if (__MODE === "EXT") {
        // 创建URL对象
        const urlObj = new URL(url);
        // 添加cb=json参数
        urlObj.searchParams.set('cb', cb);
        return (await import("webextension-polyfill")).default.runtime
        .sendMessage({type: "fetch", data: urlObj.toString(), charset});
    } else {
        return (await import("fetch-jsonp")).default(url, {jsonpCallback: 'cb'}).then(res => res.json());
    }
};