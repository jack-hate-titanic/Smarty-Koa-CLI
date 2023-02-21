'use strict';

const spawn = require('cross-spawn'); // 用来解决操作系统兼容性问题
const ora = require('ora')

// 异步执行子进程命令
function execAsync(commands, args, options = {}) {
    return new Promise((resolve, reject) => {
        const p = spawn(commands, args, options);
        p.on('error', e => {
            reject(e)
        })
        p.on('exit', c => {
            resolve(c)
        })
    })
}

// 封装加载动画
// 添加加载动画
async function wrapLoading(fn, message, failMessage, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();
  
    try {
      // 执行传入方法 fn
      const result = await fn.apply(null, ...args);
      // 状态为修改为成功
      spinner.succeed();
      return result; 
    } catch (error) {
      // 状态为修改为失败
      spinner.fail(failMessage)
    } 
  }

module.exports = {
    execAsync,
    wrapLoading
}
