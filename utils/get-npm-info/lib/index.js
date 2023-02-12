"use strict";

const axios = require("axios");
const semver = require("semver");

function getNpmInfo() {
  return "Hello from getNpmInfo";
}

function getDefaultRegistry(isOriginal = true) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npmmirror.com";
}

// 获取npm信息
function getNpmInfo(npmName) {
  if (!npmName) {
    return null;
  }
  const registryUrl = getDefaultRegistry();
  const npmInfoUrl = `${registryUrl}/${npmName}`;
  return axios
    .get(npmInfoUrl)
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
}

// 全部采用async/await的写法
async function getNpmVersions(npmName) {
  const data = await getNpmInfo(npmName);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}


// 获取比当前脚手架版本大的版本信息
function getSemverVersions(baseVersion, versions) {
  return versions
    .filter(version =>
      // semver.satisfies函数表示获取大于^1.0.4的版本，^有大于等于的意思
      semver.satisfies(version, `^${baseVersion}`)
    )
    // 有可能从npm上获取的版本不是排序之后的
    .sort((a, b) => {
      if (semver.gt(b, a)) {
        return 1
      } else {
        return -1
      }
    })
}

// 获取最新版本
async function getNpmLatestVersions(baseVersion, npmName) {
  const versions = await getNpmVersions(npmName);
  const newVersions = getSemverVersions(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  }
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmLatestVersions,
};
