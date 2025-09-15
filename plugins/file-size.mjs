import { gzipSync } from 'zlib';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
/**
 * 自定义 Rollup 插件：显示指定文件大小（支持正则表达式过滤）
 * 
 * @param {Object} [options={}] - 插件配置选项
 * @param {RegExp} [options.include] - 包含的文件正则表达式，默认匹配所有文件
 * @param {RegExp|null} [options.exclude] - 排除的文件正则表达式，默认不排除任何文件
 * @param {string} [options.title] - 显示标题，默认为 '输出文件大小'
 * @param {boolean} [options.showGzip] - 是否显示 gzip 压缩后的大小，默认为 true
 * 
 * @returns {Object} Rollup 插件对象
 * 
 * @example
 * // 显示所有文件大小
 * showFilesSizes({ title: '所有输出文件大小' })
 * 
 * @example
 * // 只显示 JavaScript 文件
 * showFilesSizes({ 
 *     include: /\.(js|mjs)$/, 
 *     title: 'JavaScript 文件大小',
 *     showGzip: true 
 * })
 * 
 * @example
 * // 排除 HTML 文件
 * showFilesSizes({ 
 *     exclude: /\.html$/, 
 *     title: '除 HTML 外的文件大小' 
 * })
 * 
 * @example
 * // 只显示图片文件，不显示 gzip 大小
 * showFilesSizes({ 
 *     include: /\.(png|jpg|jpeg|gif|svg|webp)$/i, 
 *     title: '图片文件大小',
 *     showGzip: false 
 * })
 */
export default function showFilesSizes(options = {}) {
    const {
        include = /.*/,        // 包含的文件正则，默认所有文件
        exclude = null,        // 排除的文件正则，默认不排除
        title = '输出文件大小',  // 标题
        showGzip = true        // 是否显示 gzip 大小
    } = options;

    return {
        name: 'show-files-sizes',
        writeBundle(outputOptions, bundle) {
            const outputDir = outputOptions.dir || path.dirname(outputOptions.file);
            
            // 获取所有输出文件
            let files = fs.readdirSync(outputDir, { withFileTypes: true })
                .filter(dirent => dirent.isFile())
                .map(dirent => dirent.name);
            
            // 应用过滤规则
            files = files.filter(fileName => {
                // 检查包含规则
                if (include && !include.test(fileName)) {
                    return false;
                }
                // 检查排除规则
                if (exclude && exclude.test(fileName)) {
                    return false;
                }
                return true;
            });

            if (files.length === 0) {
                console.log(`\n=== ${title} ===\n没有匹配的文件\n========================\n`);
                return;
            }
            
            // console.log(`\n=== ${title} ===`);
            // files.forEach(fileName => {
            //     const filePath = path.join(outputDir, fileName);
            //     const stats = fs.statSync(filePath);
            //     const content = fs.readFileSync(filePath);
                
            //     const size = (stats.size / 1024).toFixed(2);
            //     let output = `${fileName.padEnd(30)} ${size} KB`;
                
            //     if (showGzip) {
            //         const gzipSize = gzipSync(content).length;
            //         const gzipSizeKb = (gzipSize / 1024).toFixed(2);
            //         output += ` (gzip: ${gzipSizeKb} KB)`;
            //     }
                
            //     console.log(output);
            // });
            const content = fileSizeShow(files.map(fileName => {
                const filePath = path.join(outputDir, fileName);
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath);
                
                const size = (stats.size / 1024).toFixed(2);
                const gzipSize = gzipSync(content).length;
                const gzipSizeKb = (gzipSize / 1024).toFixed(2);

                return {
                    fileName,
                    size: Number(size),
                    gzipSize: showGzip ? Number(gzipSizeKb) : undefined
                }
            }), showGzip);

            console.log(content);
        }
    };
}

/**
 * @param {Array<{fileName:string; size:number; gzipSize:number}>} files
 */
function fileSizeShow(files, showGzip = false, title = '输出文件大小') {
    // 最大文件名长度
    const maxNameLength = Math.max(...files.map(f => f.fileName.length));
    
    // 最大size长度
    const maxSizeLength = Math.max(...files.map(f => `${f.size}`));

    // 最大gzipSize长度
    const maxGzipSizeLength = Math.max(...files.map(f => `${f.gzipSize ?? 0}`));

    const fileNames = files.map(f => f.fileName.padEnd(maxNameLength));
    const sizes = files.map(f => `${f.size}`.padStart(maxSizeLength));
    const gzipSizes = files.map(f => `${f.gzipSize ?? 0}`.padStart(maxGzipSizeLength));

    const lines = files.map((_, idx) => {
        return `${chalk.green.bold(fileNames[idx])}    ${chalk.yellow(sizes[idx])} KB` + (showGzip ? ` (gzip: ${chalk.cyan(gzipSizes[idx])} KB)` : '');
    });

    const padding = 2;
    // 计算不含颜色代码的实际长度
    const actualLineLengths = files.map((_, idx) => {
        const line = `${fileNames[idx]}    ${sizes[idx]} KB` + (showGzip ? ` (gzip: ${gzipSizes[idx]} KB)` : '');
        return line.length;
    });
    const maxLineLength = Math.max(...actualLineLengths);
    const boxWidth = maxLineLength + padding * 2;
    
    // 添加空行作为上下边距
    lines.unshift('');  // 顶部空行
    lines.push('');     // 底部空行
    
    // 更新actualLineLengths数组，为空行添加长度0
    actualLineLengths.unshift(0);  // 顶部空行长度
    actualLineLengths.push(0);     // 底部空行长度
    
    const topBorder = '┌' + '─'.repeat(boxWidth) + '┐';
    const bottomBorder = '└' + '─'.repeat(boxWidth) + '┘';

    const content = lines.reduce((acc, line, idx) => {
        const actualLength = actualLineLengths[idx];
        const rightPadding = boxWidth - actualLength - padding;
        return acc + `│${' '.repeat(padding)}` + line + `${' '.repeat(rightPadding)}│\n`;
    }, '');
    
    return '\n' + topBorder + '\n' + content + bottomBorder + '\n';
}