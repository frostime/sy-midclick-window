/*
 * Copyright (c) 2023 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2023-11-14 12:02:16
 * @FilePath     : /index.js
 * @LastEditTime : 2023-12-07 10:37:38
 * @Description  : A minimal plugin for SiYuan, relies only on nothing but pure index.js.
 *                 Refer to https://docs.siyuan-note.club/zh-Hans/guide/plugin/five-minutes-quick-start.html
 */
// index.js
const siyuan = require('siyuan');

const CONF_FILE = 'conf.json';

module.exports = class ExamplePlugin extends siyuan.Plugin {

    config = {};

    async onload() {
        siyuan.showMessage('Hello World!');
        this.addTopBar({
            icon: 'iconEmoji',
            title: 'Plugin Min',
            callback: () => {
                siyuan.showMessage(`This is ${this.i18n.name}`);
            },
            position: 'left'
        });
        this.config = await this.loadData(CONF_FILE);
    }

    onunload() {
        siyuan.showMessage('Goodbye World!');
        this.saveData(CONF_FILE, this.config);
    }

}
