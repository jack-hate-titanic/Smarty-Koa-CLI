/*
 * @Author: 悦者生存 1002783067@qq.com
 * @Date: 2023-02-12 21:22:35
 * @LastEditors: 悦者生存 1002783067@qq.com
 * @LastEditTime: 2023-02-19 21:33:50
 * @FilePath: /wson-koa2-cli/utils/request/lib/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use strict';
const axios = require('axios');
const giteeRepo = 'https://gitee.com/api/v5/users/Yjust4U/repos';


axios.interceptors.response.use(res => {
    return res.data;
})

axios.default.timeout = 5000;

async function getTemplateList() {
    // 获取所有模板
    const repos = await axios.get(giteeRepo);
    // 筛选name属性中包含template的仓库
    const templates = repos.filter((repo) => repo.name.includes('template'));
    return templates;
}

module.exports = {
    getTemplateList
};
