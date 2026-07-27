'use client';

import katex from 'katex';

const MATH_PATTERN = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g;

function renderSegment(segment, index) {
  const displayMode =
    (segment.startsWith('$$') && segment.endsWith('$$')) ||
    (segment.startsWith('\\[') && segment.endsWith('\\]'));
  const isMath =
    displayMode ||
    (segment.startsWith('$') && segment.endsWith('$')) ||
    (segment.startsWith('\\(') && segment.endsWith('\\)'));

  if (!isMath) return <span key={index}>{segment}</span>;

  const expression = segment
    .replace(/^\$\$|\$\$$/g, '')
    .replace(/^\$|\$$/g, '')
    .replace(/^\\\(|\\\)$/g, '')
    .replace(/^\\\[|\\\]$/g, '');

  try {
    const html = katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      strict: false,
    });
    return (
      <span
        key={index}
        className={displayMode ? 'my-3 block overflow-x-auto py-1' : 'inline'}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span key={index}>{segment}</span>;
  }
}

export function MathContent({ children, className }) {
  const content = String(children ?? '');
  return <div className={className}>{content.split(MATH_PATTERN).map(renderSegment)}</div>;
}
