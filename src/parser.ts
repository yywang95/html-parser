import { TTokens, ILexerNodeHtml, ILexerNodeText, ILexerNodeTag, EnumLexerNodeType } from './types';
import { TNode, TParserState, IParserNodeTag, IParserNodeText, EnumParserNodeType } from './types';
import { EnumAutoCloseTag } from './types';

/**
 * @desc 转换tokens
 * @param {Object} state 
 */
function parse(state: TParserState): TParserState {
    const { tokens, stack } = state;
    let { cursor } = state;

    // 当前所在的栈
    const currStack = stack[stack.length - 1];
    const nodes = currStack.children || [];
    const tokensLen = tokens.length;

    while (cursor < tokensLen) {
        // 当前的token
        const token = tokens[cursor];

        // 如果不是tagStart则为一个文本节点，直接push
        if (token.type !== EnumLexerNodeType.TagStart) {
            nodes.push({
                parent: currStack,
                type: EnumParserNodeType.Text,
                content: (token as ILexerNodeText).content,
            } as IParserNodeText);

            // 更新指针
            cursor++;
            continue;
        }

        // 从tagStart开始一直到tagEnd进行处理当前标签
        // tagStart的下一个项是当前标签
        const tagToken = tokens[cursor + 1] as ILexerNodeTag;
        const tagName = tagToken.content.toLowerCase();

        // 判断当前是不是闭合标签，如果是闭合标签说明此时的调用栈结束
        if ((token as ILexerNodeHtml).close) {
            // 找到当前是哪个栈的标签闭合，一般来说会是最后一个，但不保证html有误的情况
            let index = stack.length - 1;
            let showRewind = false; // 是否需要返回上一层级

            // 从后面遍历stack调用栈，如果有相同tagName则表示有匹配的父主体
            while (index > -1) {
                if (stack[index].tagName === tagName) {
                    showRewind = true;
                    break;
                }
                index--;
            }

            // cursor移动到tag-end
            while (cursor < tokensLen) {
                cursor++;
                if (tokens[cursor].type === EnumLexerNodeType.TagEnd) {
                    cursor++;
                    break;
                }
            }

            // 如果有匹配的stack，则重置stack，本次递归结束
            if (showRewind) {
                stack.splice(index);
                break;
            } else {
                continue;
            }
        }

        const newNode: IParserNodeTag = {
            parent: currStack,
            type: EnumParserNodeType.Tag,
            tagName,
            props: tagToken.props,
            children: [],
        };

        nodes.push(newNode);

        // cursor移动到tag-end
        while (cursor < tokensLen) {
            cursor++;
            if (tokens[cursor].type === EnumLexerNodeType.TagEnd) {
                cursor++;
                break;
            }
        }

        // 自闭合标签不走下面的递归
        if (~(Object.values(EnumAutoCloseTag) as string[]).indexOf(tagName)) {
            continue;
        }

        // 如果不是自闭合，则更新当前栈
        // 更新stack栈为当前的标签
        stack.push(newNode);

        // 递归
        const newState = parse({ tokens, stack, cursor });

        cursor = newState.cursor;
    }

    return { cursor, tokens, stack } || {};
};

/**
 * @desc 将tokens转为层级结构的形式，[{ type, tagName }]
 * @param {Array} tokens 通过lexer转换过的token
 */
export default function parser(tokens: TTokens): TNode[] {
    const root: IParserNodeTag = {
        type: EnumParserNodeType.Tag,
        tagName: null,
        children: [],
    };
    const state: TParserState = {
        tokens,
        stack: [root], // 当前的层级调用栈
        cursor: 0, // tokens指针
    };

    return parse(state).stack?.pop()?.children || [];
};
