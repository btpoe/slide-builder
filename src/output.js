import ReactDOMServer from 'react-dom/server';
import React from 'react';
import get from 'lodash/get';

const slopeCalc = (slopes) => {
  if (!slopes[1]) {
    return `${slopes[0].size}px`;
  }
  const upper = slopes[0];
  const lower = slopes[1];
  const slope = (upper.size - lower.size) / (upper.width - lower.width);
  const intercept = lower.size - (lower.width * slope);
  return `calc(${Math.round(slope * 10000) / 100}vw + ${intercept}px)`;
};

const nextFontSize = (bps, breakpoint, id) => {
  const bp = bps.find(b =>
    b.screenWidth > breakpoint.screenWidth &&
    b.boxes.some(box =>
      (box.identity === id && box.fontSize) ||
      box.spans.some(span => span.identity === id && span.fontSize)));

  if (!bp) return false;

  const size = bp.boxes.reduce((res, box) => {
    if (res) return res;

    if (box.identity === id && box.fontSize) return box.fontSize;

    const span = box.spans.find(s => s.identity === id && s.fontSize);
    if (span) return span.fontSize;

    return false;
  }, false);

  return { width: bp.screenWidth, size };
};

const prop = (p, value, transform = v => v) => {
  if (!p || !value) return '';
  const result = transform(value);
  if (!result) return '';
  return `${p}: ${result};`;
};

const styles = formData => [
  ...get(formData.globals, 'fonts', []).map(font => `@import url(${font});`),
  'html, body { margin: 0; padding: 0; height: 100% } body { background-size: cover; } div { position: absolute; } span { white-space: pre; }',
  ...formData.breakpoints.map(breakpoint => `
@media (min-width: ${breakpoint.screenWidth}px) {
  body {
    ${prop('background-image', get(breakpoint, 'background.image'), v => `url(${v})`)}
    ${prop('background-position', [get(breakpoint, 'background.horizontalAlignment'), get(breakpoint, 'background.verticalAlignment')], v => `${v[0]}%, ${v[1]}%`)}
  }

  ${get(breakpoint, 'boxes', []).map(box => `
    .i${box.identity} {
      ${prop('color', box.color)}
      ${prop('font-family', box.fontFamily)}
      ${prop('font-size', box.fontSize, v => slopeCalc([{ width: breakpoint.screenWidth, size: v }, nextFontSize(formData.breakpoints, breakpoint, box.identity)]))}
      ${prop('top', box.verticalAlignment, v => `${v}%`)}
      ${prop('left', box.horizontalAlignment, v => `${v}%`)}
      ${prop('transform', [box.horizontalAlignment, box.verticalAlignment], v => `translate(${-v[0]}%, ${-v[1]}%)`)}
      ${prop('text-align', box.textAlignment)}
    }
    ${get(box, 'spans', []).map(span => `
      .i${span.identity} {
        ${prop('color', span.color)}
        ${prop('font-family', span.fontFamily)}
        ${prop('font-size', span.fontSize, v => slopeCalc([{ width: breakpoint.screenWidth, size: v }, nextFontSize(formData.breakpoints, breakpoint, span.identity)]))}
      }
    `).join(' ')}
  `).join(' ')}
}`)].join(' ').replace(/\n/g, ' ');

const Output = ({ formData }) => (
  <html lang="en">
    <style>{ styles(formData) }</style>
    <body>
      {(formData.breakpoints.first().boxes || []).map(box => (
        <div className={`i${box.identity}`} key={box.identity}>
          {get(box, 'spans', []).map(span => (
            <span className={`i${span.identity}`} key={span.identity}>
              {span.text}
            </span>
          ))}
        </div>
      ))}
    </body>
  </html>
);

export default function (formData) {
  return ReactDOMServer.renderToString(<Output formData={formData} />);
}
