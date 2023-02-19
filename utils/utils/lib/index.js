'use strict';

// 封装一个spawn方法, 用于兼容mac和windows
function spawn(commands, args, options = {}) {
    const cp = require('child_process');
    const win32 = process.platform === 'win32';
    const cmd = win32 ? 'cmd' : commands;
    const cmdArgs = win32 ? ['/c'].concat(commands, args) : args;
    return cp.spawn(cmd, cmdArgs, options);
}

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



module.exports = {
    spawn,
    execAsync
}
