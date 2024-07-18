/*
 * Copyright (c) 2023 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2023-11-14 12:02:16
 * @FilePath     : /index.js
 * @LastEditTime : 2024-07-18 19:58:22
 * @Description  : A minimal plugin for SiYuan, relies only on nothing but pure index.js.
 *                 Refer to https://docs.siyuan-note.club/zh-Hans/guide/plugin/five-minutes-quick-start.html
 */
// index.js
const siyuan = require('siyuan');
const openWindow = siyuan.openWindow;

let config = {
    width: 750,
    height: 500
}

const pos = (loc, size) => {
    return Math.max(loc - size / 2, 0);
}

/**
 * 
 * @param {string} id 
 * @param {MouseEvent} e 
 */
const openSiyuanWindow = (id, e) => {
    openWindow({
        position: {
            x: pos(e?.x || 0, config.width),
            y: pos(e?.y || 0, config.height),
        },
        height: config.height,
        width: config.width,
        doc: {
            id: id
        }
    });
}

/**
 * 
 * @param {MouseEvent} e 
 * @returns 
 */
const onMouseClick = (e) => {
    //中键点击
    if (e.button !== 1) {
        return;
    }
    let blockId = null;
    let target = e.target; //HTMLElement
    let docBtn = target.closest('.protyle-breadcrumb > button[data-type="doc"]');
    if (docBtn) {
        let span = docBtn.parentNode.querySelector('.protyle-breadcrumb__bar > span[data-node-id]');
        blockId = span?.dataset?.nodeId;
    } else {
        blockId = getBlockID(e);
    }
    if (blockId) {
        e.preventDefault();
        e.stopPropagation();
        openSiyuanWindow(blockId, e);
    }
}

// From https://github.com/Zuoqiu-Yingyi/siyuan-packages-monorepo/blob/main/workspace/packages/utils/regexp/index.ts
const Regex = {
    id: /^\d{14}-[0-9a-z]{7}$/, // 块 ID 正则表达式
    url: /^siyuan:\/\/blocks\/(\d{14}-[0-9a-z]{7})/, // 思源 URL Scheme 正则表达式
}

/**
 * From https://github.com/Zuoqiu-Yingyi/siyuan-packages-monorepo/blob/main/workspace/packages/utils/siyuan/dom.ts
 * 查询块 ID
 * @param {Event} e 
 * @returns {string | void}
 */
function getBlockID(e) {
    const path = e.composedPath();
    for (let i = 0; i < path.length; ++i) {
        const dataset = (path[i]).dataset;
        if (dataset) {
            switch (true) {
                case dataset.nodeId && Regex.id.test(dataset.nodeId):
                    return dataset.nodeId;
                case dataset.id && Regex.id.test(dataset.id):
                    return dataset.id;
                case dataset.oid && Regex.id.test(dataset.oid):
                    return dataset.oid;
                case dataset.avId && Regex.id.test(dataset.avId):
                    return dataset.avId;
                case dataset.colId && Regex.id.test(dataset.colId):
                    return dataset.colId;
                case dataset.rootId && Regex.id.test(dataset.rootId):
                    return dataset.rootId;

                default:
                    break
            }
        }
    }
    return;
}

const CONF_FILE = 'config.json';

class MidClickWindowPlugin extends siyuan.Plugin {

    async onload() {
        document.addEventListener('mousedown', onMouseClick);

        let storage = await this.loadData(CONF_FILE);

        if (!storage) {
            storage = config;
            this.saveData(CONF_FILE, config);
        } else {
            config = {...config, ...storage};
        }
    }

    onunload() {
        document.removeEventListener('mousedown', onMouseClick);
    }

}

module.exports = MidClickWindowPlugin;
