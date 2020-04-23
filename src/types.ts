/** @desc 任意类型的key: value对象 */
export interface IObject {
    [prop: string]: any;
};

// lexer=========

/** @desc 节点类型 */
export enum EnumLexerNodeType {
    TagStart = 'tag-start', // 标签开始：<
    Tag = 'tag', // tag标签名称
    TagEnd = 'tag-end', // 标签结束：>
    Text = 'text', // 文本节点
};

/** @desc token节点类型 */
export interface ILexerNodeBase {
    type: EnumLexerNodeType; // token节点类型
};

/** @desc 开始结束html节点 */
export interface ILexerNodeHtml extends ILexerNodeBase {
    close: boolean; // 是否为节点的闭合部分
};

/** @desc 标签名 */
export interface ILexerNodeTag extends ILexerNodeBase {
    content: string; // 标签名称
    props: IObject; // 节点的属性集合
};

/** @desc 文本节点 */
export interface ILexerNodeText extends ILexerNodeBase {
    content: string; // 文本节点的内容
};

/** @desc tokens */
export type TTokens = Array<ILexerNodeHtml | ILexerNodeTag | ILexerNodeText>;

/** @desc 获取tokens数组方法 */
export type TGetTokenFunc = (str: string) => { tokens: TTokens, move: number };

// parser=========

/** @desc node类型 */
export enum EnumParserNodeType {
    Tag = 'tag',
    Text = 'text',
};

export interface IParserNodeBase {
    type: EnumParserNodeType; // 节点类型
    parent?: IParserNodeTag | IParserNodeText; // 父级节点
}

/** @desc parserNode标签节点 */
export interface IParserNodeTag extends IParserNodeBase {
    tagName: string | null; // 标签名称
    props?: IObject; // 标签属性
    children?: TNode[]; // 子节点
};

/** @desc 文本节点 */
export interface IParserNodeText extends IParserNodeBase {
    content: string; // 文本
};

/** @desc parser stack调用栈，Array<栈中的父节点> */
export type TParserStack = Array<IParserNodeTag>;

/** @desc parser state */
export type TParserState = {
    tokens: TTokens;
    stack: TParserStack;
    cursor: number; // 指针
};

/** @desc parser后的节点 */
export type TNode = IParserNodeTag | IParserNodeText;

// tags===========

/** @desc 自闭合标签 */
export enum EnumAutoCloseTag {
    Doctype = '!doctype',
    Area = 'area',
    Base = 'base',
    Br = 'br',
    Col = 'col',
    Command = 'command',
    Embed = 'embed',
    Hr = 'hr',
    Img = 'img',
    Input = 'input',
    Keygen = 'keygen',
    Link = 'link',
    Meta = 'meta',
    Param = 'param',
    Source = 'source',
    Track = 'track',
    Wbr = 'wbr',
};
