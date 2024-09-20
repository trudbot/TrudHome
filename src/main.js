import {search, getSearchSuggestions, searchEngine} from './api/search.js';
import {useTextStorage} from './utils/useTextStorage.js';
import './styles.css'

const $ = selector => document.querySelector(selector);
const searchEngineProxy = useTextStorage('search-engine', 'google');
const bgImgProxy = useTextStorage('bg-img', '');
const searchEngineOptions = [
    'google',
    'bing',
    'baidu'
];

// 表单提交, 跳转对应搜索页
$('.search-form').addEventListener('submit', e => {
    search(e.target[0].value, {
        engine: searchEngineProxy.value
    });
    e.preventDefault();
});

// 加载搜索提示
$('.search-input').addEventListener('input', async e => {
    console.log('input事件触发');
    try {
        const suggestion = await getSearchSuggestions(e.target.value);
        if (suggestion?.length) {
            $('.search').classList.add('has-suggestion');
        } else {
            $('.search').classList.remove('has-suggestion');
            return;
        }
        $('.search-suggestion').innerHTML  = '';
        $('.search-suggestion').append(...suggestion.map(item => {
            const li = document.createElement('li');
            li.classList.add('search-suggestion-item');
            li.textContent = item;
            return li;
        }));
    } catch (error) {
        console.error('更新搜索建议失败', error);
        $('.search').classList.remove('has-suggestion');
    }
});

// 获得焦点时显示搜索建议
$('.search-input').addEventListener('focus', () => {
    $('.search').classList.add('show-suggestion');
});

// 点击search外部时隐藏搜索建议
document.addEventListener('click', (event) => {
    const searchContainer = $('.search');

    // 判断点击是否在 searchContainer 内部
    if (!searchContainer === event.target && !searchContainer.contains(event.target)) {
        // 点击在 searchContainer 外部，隐藏搜索建议
        searchContainer.classList.remove('show-suggestion');
    }
});

// 点击搜索建议时进行搜索
$('.search-suggestion').addEventListener('click', e => {
    if (e.target.classList.contains('search-suggestion-item')) {
        search(e.target.textContent, {
            engine: searchEngineProxy.value
        });
    }
});

$('.search-engine-select').addEventListener('click', e => {
    const idx = searchEngineOptions.indexOf(searchEngineProxy.value);
    const nextIdx = (idx + 1) % searchEngineOptions.length;
    searchEngineProxy.set(searchEngineOptions[nextIdx]);
});

function updateSerachEngineUI(engine) {
    const engineInfo = searchEngine[engine];
    $('.search-engine-select').innerHTML = `
        <i class="iconfont icon-${engine} search-engine-icon"></i>
    `
}
// 初始化引擎icon
updateSerachEngineUI(searchEngineProxy.value);
// 每次引擎变更时更新icon
searchEngineProxy.subscribe(updateSerachEngineUI);

// 背景图片文件选择回调
$('#bg-select').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            bgImgProxy.set(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

$('.cover').addEventListener('dblclick', () => {
    $('#bg-select').click();
});

function updateBgImgUI(imgBase64) {
    if (imgBase64) {
        $('.cover').style.backgroundImage = `url(${imgBase64})`;
    }
}
updateBgImgUI(bgImgProxy.value);
bgImgProxy.subscribe(updateBgImgUI);