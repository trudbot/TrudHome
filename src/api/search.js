import searchEngineText from "./search-engine.json";
import { corsFetch } from "./jsonp-request";
export const searchEngine = JSON.parse(searchEngineText);

export const getSearchSuggestions = async (keyWord) => {
    try {
        const encodedKeyword = encodeURIComponent(keyWord);
        const url = `https://suggestion.baidu.com/su?wd=${encodedKeyword}`;
        const data = await corsFetch(url, 'gbk');
        return data.s;
    } catch (error) {
        console.error("处理搜索建议发生错误：", error);
        return null;
    }
};

export const search = (input, opt) => {
    if (!input || !searchEngine[opt.engine]) {
        return;
    }
    // 跳转到搜索引擎结果页
    if (opt.blank) {
        window.open(searchEngine[opt.engine].url + encodeURIComponent(input), "_blank");
    } else {
        window.location.href = searchEngine[opt.engine].url + encodeURIComponent(input);
    }
};