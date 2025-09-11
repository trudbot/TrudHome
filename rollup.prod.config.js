import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import fs from 'fs';
import terser from '@rollup/plugin-terser';
import {string} from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';
import filesize from 'rollup-plugin-filesize';

// clean output dir before building
try {
    fs.rmSync('output', { recursive: true, force: true });
} catch (e) {
    // ignore
}

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
            '__BACKGROUND_IMG__': 'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/2025/09/11/1757558333213_39392946_167922017377460_809948193384395326_n.jpg',
            preventAssignment: true
        }),
        nodeResolve(),
        commonjs(),
        postcss({
            extensions: ['.css'],
            extract: true,  // 指定输出文件名，默认为 'bundle.css'
            inject: false,
            minimize: true,
            plugins: [
                postcssImport(),  // 处理 @import 语句
                postcssUrl({
                    url: 'inline'
                }),
                
            ]
        }),
        html({
            fileName: 'index.html',
            title: 'trudhome',
            template: ({ attributes, files, meta, publicPath, title }) => {
                const htmlContent = fs.readFileSync('src/index.html', 'utf-8');
                const scripts = (files.js || [])
                    .map(({ fileName }) => `<script src="${fileName}" type="module"></script>`)
                    .join('\n');
                const links = (files.css || []).map(({ fileName }) => `<link rel="stylesheet" href="${fileName}">`).join('\n');
                return `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="description" content="Trudhome is a customizable new tab page extension that enhances your browsing experience with personalized search engines, background images, and quick access to your favorite websites.">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="icon" href="https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/2025/09/11/1757562409935_favicon.png"/>
                        <link rel="canonical" href="https://trudbot.cn/TrudHome"/>
                        <title>${title}</title>
                        ${links}
                    </head>
                    <body>
                        ${htmlContent}
                        ${scripts}
                    </body>
                    </html>`;
            }
        }),
        string({
            include: '**/*.json'
        }),
        terser(),
        filesize({ showGzippedSize: true })
    ]
}];