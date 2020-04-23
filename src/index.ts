import { TNode } from './types';
import lexer from './lexer';
import parser from './parser';

export * from './types';

export default function htmlParser(str: string): TNode[] {
    const tokens = lexer(str);
    const nodes = parser(tokens);

    return nodes;
};
