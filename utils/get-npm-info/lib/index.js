"use strict";

const axios = require("axios");

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
