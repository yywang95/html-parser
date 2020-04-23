import { IObject } from './types';

/** 
 * @desc 从字符串中匹配所有的标签属性key=value
 * @param {Sstring} str 要匹配的字符串
 * @return {Object[]} {style: xx}
 */
export function matchProps(str: string = ''): IObject {
    if (!str) return {};

    const reg = /\s?([^=]*)=(['"]?)([^\s>]*)(['"]?)/g;
    const result: IObject = {};
    /* eslint-disable no-unused-vars */
    let rs;

    while((rs = reg.exec(str))) {
        if (RegExp.$1) {
            result[RegExp.$1] = RegExp.$3 || '';
        }
    }

    return result;
};

/** 
 * @desc 从字符串样式中匹配所有的标签属性key=value
 * @param {Sstring} str 要匹配的字符串
 * @return {Object[]} {width: xx, height: xx}
 */
export function matchStyles(str: string = ''): IObject {
    if (!str) return {};

    const reg = /\s?([^=]*)=(['"]?)([^;]*)(['"]?)/g;
    const result: IObject = {};
    /* eslint-disable no-unused-vars */
    let rs;

    while((rs = reg.exec(str))) {
        if (RegExp.$1) {
            result[RegExp.$1] = RegExp.$3 || '';
        }
    }

    return result;
};
