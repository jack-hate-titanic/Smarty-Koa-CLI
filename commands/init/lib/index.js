/*
 * @Author: 悦者生存 1002783067@qq.com
 * @Date: 2023-02-12 17:32:42
 * @LastEditors: 悦者生存 1002783067@qq.com
 * @LastEditTime: 2023-02-12 22:36:29
 * @FilePath: /wson-koa2-cli/commands/init/lib/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use strict';
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const Generator = require('./generator');


async function init(projectName, options) {
    // 当前命令行所在的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetDir = path.join(cwd, projectName);
    // 目录是否已经存在？
    if (fs.existsSync(targetDir)) {
        // 是否要强制创建
        if (options.force) {
            await fs.remove(targetDir)
        } else {
            // 询问用户是否确定要覆盖目录
            inquirer.prompt([
                {
                    name: 'isOverwrite',
                    type: 'confirm',
                    message: '当前目录已经存在，是否需要覆盖?'
                }
            ]).then(async(answer) => {
                if (answer.isOverwrite) {
                  // 移除已存在的目录
                  console.log(`\r\nRemoving...`);
                  await fs.remove(targetDir);
                }  
            })
        }
    }

    // 创建项目
    const generator = new Generator(projectName, targetDir);
    // 开始创建项目
    generator.create();
}

module.exports = init;

