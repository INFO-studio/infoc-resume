import type { FC, ReactNode } from 'react';

export type RenderTextNode = FC<{ content: string }>;

type Token = {
  type: 'normal' | 'bold' | 'code';
  content: string;
};

const BOLD_RE = /\*\*(.+?)\*\*/g;
const CODE_RE = /`([^`]+)`/g;

const collectMatches = (
  text: string,
  re: RegExp,
  type: Token['type'],
): { index: number; type: Token['type']; content: string; end: number }[] => {
  const result: { index: number; type: Token['type']; content: string; end: number }[] = [];
  let match = re.exec(text);
  while (match !== null) {
    result.push({ index: match.index, type, content: match[1], end: re.lastIndex });
    match = re.exec(text);
  }
  return result;
};

const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  const boldMatches = collectMatches(text, BOLD_RE, 'bold');
  const codeMatches = collectMatches(text, CODE_RE, 'code');
  const matches = [...boldMatches, ...codeMatches].sort((a, b) => a.index - b.index);

  let lastIndex = 0;
  for (const m of matches) {
    if (m.index < lastIndex) continue;
    if (m.index > lastIndex) {
      tokens.push({ type: 'normal', content: text.slice(lastIndex, m.index) });
    }
    tokens.push({ type: m.type, content: m.content });
    lastIndex = m.end;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'normal', content: text.slice(lastIndex) });
  }

  return tokens;
};

const renderText = (
  text: string,
  nodes?: { normal?: RenderTextNode; bold?: RenderTextNode; code?: RenderTextNode },
): ReactNode => {
  const tokens = tokenize(text);
  let key = 0;

  return tokens.map((token) => {
    const k = key++;
    if (token.type === 'normal') {
      if (nodes?.normal) {
        const Normal = nodes.normal;
        return <Normal key={k} content={token.content} />;
      }
      return <span key={k}>{token.content}</span>;
    }
    if (token.type === 'bold') {
      if (nodes?.bold) {
        const Bold = nodes.bold;
        return <Bold key={k} content={token.content} />;
      }
      return (
        <span key={k} className="font-bold">
          {token.content}
        </span>
      );
    }
    // code
    if (nodes?.code) {
      const Code = nodes.code;
      return <Code key={k} content={token.content} />;
    }
    return (
      <code key={k} className="rounded-1 bg-code-bg px-1 font-mono text-xs">
        {token.content}
      </code>
    );
  });
};

export default renderText;
