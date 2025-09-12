import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import copy from 'rollup-plugin-copy'
import postcss from 'rollup-plugin-postcss';
import fs from 'fs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import {string} from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';

// clean output dir before building
try {
    fs.rmSync('output', { recursive: true, force: true });
} catch (e) {
    // ignore
}

export default {
    input: 'src/main.js',
    output: {
        dir: 'output',
        format: 'es',                // 关键：输出 ES 模块
        sourcemap: true,
        preserveModules: true,       // 关键：保留模块，不把所有代码合并到单一文件
        preserveModulesRoot: 'src',  // 输出时保留 src 目录结构（可选）
        entryFileNames: '[name].js', // 入口输出名（可自定义）
        chunkFileNames: 'chunks/[name]-[hash].js' // 公共 chunk 命名
    },
    plugins: [
        replace({
            '__MODE': JSON.stringify('APP_DEV'),
            '__BACKGROUND_IMG__': './assets/39392946_167922017377460_809948193384395326_n.jpg',
            preventAssignment: true
        }),
        nodeResolve(),
        commonjs(),
        postcss({
            extensions: ['.css'],
        }),
        html({
            fileName: 'index.html',
            title: 'trudhome',
            template: ({ files, title }) => {
                const htmlContent = fs.readFileSync('src/index.html', 'utf-8');
                const scripts = (files.js || [])
                    .map(({ fileName }) => `<script src="${fileName}" type="module"></script>`)
                    .join('\n');
                return `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="description" content="Trudhome is a customizable new tab page extension that enhances your browsing experience with personalized search engines, background images, and quick access to your favorite websites.">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${title}</title>
                    </head>
                    <body>
                        ${htmlContent}
                        <script>
                            // 预加载背景图以减少首次显示时的闪烁
                            const bgB64 = localStorage.getItem('trudhome-bg-img');
                            if (bgB64) {
                                document.querySelector('.cover').style.backgroundImage = "url(" + bgB64 + ")";
                            }
                        </script>
                        ${scripts}
                    </body>
                    </html>`;
            }
        }),
        copy({
            targets: [
                {src: 'src/assets/iconfont/*.{ttf,woff,woff2}', dest: "output"},
                {src: 'src/assets/*', dest: 'output/assets', ignore: ['src/assets/iconfont']},
            ]
        }),
        string({
            include: '**/*.json'
        }),
        serve({
            open: true, // 自动打开浏览器
            contentBase: 'output', // 服务器根目录
            port: 3000 // 服务器端口
        }),
        livereload({
            watch: 'output' // 监测变化的目录
        })
    ],
    watch: {
        include: 'src/**',
        exclude: ['src/manfiest.json', 'src/background/*']
    }
};