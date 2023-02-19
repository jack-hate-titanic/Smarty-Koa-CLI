/*
 * @Author: 悦者生存 1002783067@qq.com
 * @Date: 2023-02-05 09:03:48
 * @LastEditors: 悦者生存 1002783067@qq.com
 * @LastEditTime: 2023-02-12 17:44:27
 * @FilePath: /wson-koa2-cli/core/cli/lib/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use strict";
const log = require("@wson-koa2-cli/log");
const { getNpmLatestVersions } = require("@wson-koa2-cli/get-npm-info");
const init = require("@wson-koa2-cli/init");
const semver = require("semver");
const { program } = require("commander"); 
const pkg = require("../package.json");
const LOWEST_NODE_VERSION = "12.0.0";
const LOWEST_PKG_VERSION = "1.0.12";

// 检查node的版本号
function checkNodeVersion() {
  // 因为脚手架执行时就是一个node进程，所以可以从process拿到node版本号
  const currentVersion = process.version;
  const lowestVersion = LOWEST_NODE_VERSION;
  // 通过semver这个库来比对版本号的大小
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      `The node version is less than ${LOWEST_NODE_VERSION}, please upgrade the node version`
    );
  }
}

// 检测package.json版本是否小于最低版本
function checkPkgVersion() {
  const currentPkgVersion = pkg.version;
  if (!semver.gte(currentPkgVersion, LOWEST_PKG_VERSION)) {
    throw new Error(
      `imooc-ws-cli-dev suggest that your current version should greater than v${LOWEST_PKG_VERSION}, Please upgrade you version`
    );
  } else {
    log.info("cli", currentPkgVersion);
  }
}

// 提示更新到最新版本
async function npmUpdateLatestVersionWarning() {
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  const lastVersion = await getNpmLatestVersions(currentVersion, npmName);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      `Please update manually ${npmName},The latest version is ${lastVersion},Update command：npm install -g ${npmName}`
    );
  }
}

async function prepare() {
  checkNodeVersion();
  checkPkgVersion();
  await npmUpdateLatestVersionWarning();
}

function registerCommand() {
  // 帮助部分内容
  program
    .usage("<command> [option]")  // 帮助信息首行内容
    .version(pkg.version) // 定义版本号
    .option('-d,--debug', 'whether to enable debug modal', false);
  
  // 创建部分内容
  program
    .command('init <projectName>')
    .option('-f, --force', 'whether to force init project', false)
    .action(init);
  
  // 获取参数
  const params = program.opts();
  
  // 监听debug命令
  program.on('option:debug', () => {
    if (params.debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    // 设置log等级
    log.level = process.env.LOG_LEVEL;
    log.verbose('debug');
  })

  // 监听未注册的所有命令
  program.on('command:*', (obj) => {
    const commands = program.commands.map((cmd) => cmd.name());
    log.info('未知的命令 ' + obj[0]);
    if (commands.length > 0) {
      log.info('支持的命令 ' + commands.join(','));
    }
  })

  program.parse(program.argv);
}

async function core() {
  try {
    // 命令启动前的检查
    await prepare();
    registerCommand();
  } catch (error) {
    log.error(error);
  }
}

module.exports = core;
