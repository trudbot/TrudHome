import searchEngineText from "./search-engine.json";
import aiText from './ai.json';
import { corsFetch } from "./jsonp-request";
export const searchEngine = JSON.parse(searchEngineText);
export const ai = JSON.parse(aiText);

export const getSearchSuggestions = async (keyWord) => {
    if (!keyWord || keyWord.trim() === '') {
        return [];
    }
    try {
        const encodedKeyword = encodeURIComponent(keyWord);
        const url = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&wd=${encodedKeyword}`;
        const data = await corsFetch(url, 'utf-8');
        return data.g?.map(item => item.q) || [];
    } catch (error) {
        console.error("处理搜索建议发生错误：", error);
        return null;
    }
};

export const search = (input, opt) => {
    const url = searchEngine[opt.engine]?.url || ai[opt.engine]?.url;
    if (!input || !url) {
        return;
    }
    // 跳转到搜索引擎结果页
    if (opt.blank) {
        window.open(url + encodeURIComponent(input), "_blank");
    } else {
        window.location.href = url + encodeURIComponent(input);
    }
};