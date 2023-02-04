'use strict';

const log = require('npmlog');

//根据环境变量定义log等级
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'; 
// 自定义log, 使用log.success('success')就可以使用
log.addLevel("success", 2000, { fg: 'green', bold: true }); 

log.heading = 'ws'; // 添加log前缀
// 前缀的样式
log.headingStyle = { fg: 'red', bg: 'white' }

module.exports = log;
