import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import copy from 'rollup-plugin-copy'
import postcss from 'rollup-plugin-postcss';
import fs from 'fs';
import {string} from 'rollup-plugin-string';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import showFilesSizes from './plugins/file-size.mjs';

// clean output dir before building
try {
    fs.rmSync('output', { recursive: true, force: true });
} catch (e) {
    // ignore
}

/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [{
    input: 'src/main.js',
    output: {
        format: 'es',
        name: 'bundle',
        dir: 'output'
    },  
    plugins: [
        replace({
            '__MODE': JSON.stringify('EXT'),
            '__BACKGROUND_IMG__': './assets/39392946_167922017377460_809948193384395326_n.jpg',
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
                const links = (files.css || []).map(({ fileName }) => `<link rel="stylesheet" href="${fileName}">`).join('\n');
                return `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="description" content="Trudhome is a customizable new tab page extension that enhances your browsing experience with personalized search engines, background images, and quick access to your favorite websites.">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          targets: [
            {src: 'src/assets/iconfont/*.{ttf,woff,woff2}', dest: "output"},
            {src: 'src/assets/*', dest: 'output/assets', ignore: ['src/assets/iconfont']},
            // firefox和chrome使用不同的manifest.json
            {src: process.env.BROWSER === 'firefox' ? "src/manifest-firefox.json" : "src/manifest.json", dest: "output", rename: "manifest.json"}
          ]
        }),
        string({
            include: '**/*.json'
        }),
        terser(),
        showFilesSizes({ title: '扩展界面文件大小' })
    ]
}, {
    input: 'src/background/index.js',
    output: {
        dir: 'output/background',
        format: 'es',
        name: 'bundle'
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        terser(),
        showFilesSizes({ title: 'Background 脚本文件大小' })
    ]
}];