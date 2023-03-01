/*
 * @Author: 悦者生存 1002783067@qq.com
 * @Date: 2023-02-12 21:41:20
 * @LastEditors: 悦者生存 1002783067@qq.com
 * @LastEditTime: 2023-03-01 21:31:54
 * @FilePath: /wson-koa2-cli/commands/init/lib/generator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { getTemplateList } = require("@wson-koa2-cli/request");
const { execAsync, wrapLoading } = require("@wson-koa2-cli/utils");
const inquirer = require("inquirer");
const path = require('path');
const fs = require('fs-extra');


class Generator{ 
  constructor(projectName, targetDir) {
    // 项目名称
    this.projectName = projectName;
    // 项目目录
    this.targetDir = targetDir;
  }


  
  // return 用户选择的模板名称
  async getRepo() {
    // 1）从远程拉取模板数据
    const templateList = await wrapLoading(getTemplateList, '获取仓库模板中....', '获取仓库模板失败');
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

  // clone远程模板
  async download(repo){

    // 1）拼接下载地址
    const repoUrl = `https://gitee.com/Yjust4U/${repo}.git`;

    // 把安装后的模板放到targetDir中
    const result = await wrapLoading(execAsync, '下载模板中....', '下载模板失败', ['git', ['clone', repoUrl], {
      cwd: this.targetDir,
    }]);
    return result;
  }

  async toTargetDir(repo) {
    // 获取模板目录
    const templatePath = path.join(this.targetDir, repo);
    // .git文件所在位置
    const gitFile = path.join(this.targetDir, '/.git');
    // .README.md文件所在位置
    const readMeFile = path.join(this.targetDir, './README.md')
    // 赋值到targetDir中
    await fs.copy(templatePath, this.targetDir);
    // 删除模板文件
    await fs.remove(templatePath);
    // 删除.git和readme文件
    await fs.remove(gitFile);
    await fs.remove(readMeFile);
  }

  // 核心创建逻辑
  async create() {
    // 1）获取模板名称
    const repo = await this.getRepo();
    // 2）下载模板到模板目录
    await this.download(repo);
    // 3) 把模板拷贝到项目目录
    await this.toTargetDir(repo);
    console.log('项目创建完成');
  }
}


module.exports = Generator;