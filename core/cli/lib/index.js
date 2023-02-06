"use strict";
const log = require("@wson-koa2-cli/log");
const { getNpmLatestVersions } = require("@wson-koa2-cli/get-npm-info");
const semver = require("semver");
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

async function core() {
  try {
    // 命令启动前的检查
    await prepare();
  } catch (error) {
    log.error(error);
  }
}

module.exports = core;
