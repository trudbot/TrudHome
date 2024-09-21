import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import copy from "rollup-plugin-copy-assets";
import postcss from 'rollup-plugin-postcss';
import fs from 'fs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import {string} from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';

export default {
    input: 'src/main.js',
    output: {
        dir: 'output',
        format: 'es',
        name: 'bundle'
    },  
    plugins: [
        replace({
            '__MODE': JSON.stringify('APP_DEV'),
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
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${title}</title>
                    </head>
                    <body>
                        ${htmlContent}
                        ${scripts}
                    </body>
                    </html>`;
            }
        }),
        copy({
          assets: [
            // You can include directories
            "src/assets"
          ],
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