/*
 * @Author: 悦者生存 1002783067@qq.com
 * @Date: 2023-02-12 21:41:20
 * @LastEditors: 悦者生存 1002783067@qq.com
 * @LastEditTime: 2023-02-19 14:06:02
 * @FilePath: /wson-koa2-cli/commands/init/lib/generator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { getTemplateList } = require("@wson-koa2-cli/request");
const inquirer = require("inquirer");
const util = require('util');
const path = require('path');

class Generator{ 
  constructor(projectName, targetDir) {
    // 项目名称
    this.projectName = projectName;
    // 项目目录
    this.targetDir = targetDir;
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }


  
  // 3）return 用户选择的名称
  async getRepo() {
    // 1）从远程拉取模板数据
    const templateList = await getTemplateList();
    if (!templateList.length) return;

    // 2）用户选择自己要下载的模板名称
    const { template } = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: "请选择模板来初始化项目",
        choices: templateList
      }
    ])
    
    return template;
  }

  // 下载远程模板
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(repo){

    // 1）拼接下载地址
    const requestUrl = `gitee:Yjust4U/${repo}`;

    // 2）调用下载方法

  }

  // 核心创建逻辑
  async create() {
    // 1）获取模板名称
    const repo = await this.getRepo();
    // 3）下载模板到模板目录
    await this.download(repo);
    console.log('下载完成');
  }
}


module.exports = Generator;