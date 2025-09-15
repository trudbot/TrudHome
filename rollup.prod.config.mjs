import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy'
import fs from 'fs';
import terser from '@rollup/plugin-terser';
import {string} from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';
import showFilesSizes from './plugins/file-size.mjs';

const inlineCss = true;

// clean output dir before building
try {
    fs.rmSync('output', { recursive: true, force: true });
} catch (e) {
    // ignore
}

const backgroundImage = 'https://psstatic.cdn.bcebos.com/operation/2025_ncee/39392946_167922017377460_809948193384395326_n_1757589188000.webp';

/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [{
    input: 'src/main.js',
    output: {
        dir: 'output',
        format: 'es',
        name: 'bundle'
    },
    plugins: [
        replace({
            '__MODE': JSON.stringify('APP_PROD'),
            '__BACKGROUND_IMG__': backgroundImage,
            preventAssignment: true
        }),
        nodeResolve(),
        commonjs(),
        postcss({
            extensions: ['.css'],
            extract: true,
            inject: false,
            minimize: true
        }),
        html({
            fileName: 'index.html',
            title: 'trudhome',
            template: ({ attributes, files, meta, publicPath, title }) => {
                const htmlContent = fs.readFileSync('src/index.html', 'utf-8');
                const scripts = (files.js || [])
                    .map(({ fileName }) => `<script src="${fileName}" type="module"></script>`)
                    .join('\n');
                const css = (files.css || []).map(({ source, fileName }) => {
                    return inlineCss ? `<style>${source}</style>` : `<link rel="stylesheet" href="${fileName}">`
                }).join('\n');
                return `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="description" content="Trudhome is a customizable new tab page extension that enhances your browsing experience with personalized search engines, background images, and quick access to your favorite websites.">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="icon" href="https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/2025/09/11/1757562409935_favicon.png"/>
                        <link rel="canonical" href="https://trudbot.cn/TrudHome"/>
                        <link rel="preload" href="${backgroundImage}" as="image" type="image/jpeg"/>
                        <title>${title}</title>
                        ${css}
                    </head>
                    <body>
                        ${htmlContent}
                        <script defer>
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
        string({
            include: '**/*.json'
        }),
        copy({
            targets: [
                {
                    src: 'src/assets/iconfont/*.{ttf,woff,woff2}',
                    dest: 'output'
                }
            ]
        }),
        terser(),
        // 显示所有文件大小
        showFilesSizes({ title: '所有输出文件大小' }),
    ]
}];