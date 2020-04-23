import { 
    ILexerNodeHtml,
    ILexerNodeText, 
    ILexerNodeTag,
    EnumLexerNodeType,
    TTokens,
    TGetTokenFunc
} from './types';
import { matchProps } from './helper';

/**
 * @desc 匹配的是一个标签时的token
 * @param {String} str html文本
 */
const getTagToken: TGetTokenFunc = (str: string) => {
    // 标签匹配，如果是标签会匹配到这里
    const tagReg: RegExp = /^<(\/)?([A-Za-z0-9]*)([^>]*)(\/)?>/;
    const tokens: TTokens = [];
    const match: RegExpMatchArray = str.match(tagReg) || [];

    console.log(match);

    if (!match.length) return { tokens, move: 0 };

    // 如果匹配，则是个标签
    // 标签开始
    tokens.push({
        type: EnumLexerNodeType.TagStart,
        close: match[1] ? true : false
    } as ILexerNodeHtml);

    // 标签名
    tokens.push({
        type: EnumLexerNodeType.Tag,
        content: match[2] || '',
        props: matchProps(match[3]),
    } as ILexerNodeTag);

    // 标签结束
    tokens.push({
        type: EnumLexerNodeType.TagEnd,
        close: false
    } as ILexerNodeHtml);

    return {
        tokens,
        move: (match[0] || '').length,
    };
};

/**
 * @desc 匹配的是一个文本时的token
 * @param {String} str html文本
 */
const getTextToken: TGetTokenFunc = (str: string) => {
    const textReg: RegExp = /^((\n|.)*?)<(\/)?([A-Za-z0-9]*)([^>]*)(\/)?>/;
    const tokens: TTokens = [];
    const match: RegExpMatchArray = str.match(textReg) || [];

    if (!match.length) return { tokens, move: 0 };

    const text = match[1] || '';

    // 文本标签
    text && tokens.push({
        type: EnumLexerNodeType.Text,
        content: text,
    } as ILexerNodeText);

    return {
        tokens,
        move: text.length
    };
};

/** 
 * @desc 词法分析html
 * 将html转为[{ type: xx, content }]这种token类型
 * @param {String} str HTML文本
 */
export default function lexer(str: string): TTokens {
    // 当前html文本长度
    const strLen = str.length;
    // 当前str读取指针
    let point = 0;

    const tokens: TTokens = [];

    // 从左到右遍历整个html字符串
    while (point < strLen) {
        // 截取point之后的未读文本
        const content = str.substring(point);

        // tag判断
        const tagTokens = getTagToken(content);

        if (tagTokens.tokens && tagTokens.tokens.length) {
            tokens.push(...tagTokens.tokens);
            point += tagTokens.move;

            continue;
        }

        // text判断
        const textTokens = getTextToken(content);

        if (textTokens.tokens && textTokens.tokens.length) {
            tokens.push(...textTokens.tokens);
            point += textTokens.move;

            continue;
        }

        // 不是标签，不是文本，指针+1
        point++;
    }

    return tokens;
};
