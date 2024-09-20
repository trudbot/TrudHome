import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import copy from "rollup-plugin-copy-assets";
import postcss from 'rollup-plugin-postcss';
import fs from 'fs';
import terser from '@rollup/plugin-terser';
import {string} from 'rollup-plugin-string';

export default {
    input: 'src/main.js',
    output: {
        file: 'output/main.js',
        format: 'iife',
        name: 'bundle'
    },  
    plugins: [
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
                    .map(({ fileName }) => `<script src="${fileName}"></script>`)
                    .join('\n');
                const links = (files.css || []).map(({ fileName }) => `<link rel="stylesheet" href="${fileName}">`).join('\n');
                return `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="icon" href="https://www.bing.com/sa/simg/favicon-trans-bg-blue-mg-png.png"/>
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
        copy({
          assets: [
            // You can include directories
            "src/assets"
          ],
        }),
        string({
            include: '**/*.json'
        }),
        terser()
    ]
};