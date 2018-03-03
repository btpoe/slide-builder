import ReactDOMServer from 'react-dom/server';
import React from 'react';
import get from 'lodash/get';

const styles = formData => `
  ${get(formData, 'fonts', []).map(font =>
    `@import url(${font});`)}

  body {
    background: ${get(formData, 'background.color', '#fff')};
  }

  span {
    white-space: pre;
  }

  ${get(formData, 'boxes', []).map((box, i) => `
    .text${i} {
      ${box.color ? `color: ${box.color};` : ''}
      ${box.font ? `font-family: ${box.font};` : ''}
      position: absolute;
      top: ${box.verticalAlignment}%;
      left: ${box.horizontalAlignment}%;
      transform: translate(${-box.horizontalAlignment}%, ${-box.verticalAlignment}%);
      text-align: ${box.textAlignment};
    }
    ${get(box, 'spans', []).map((span, j) => `
      .text${i}-span${j} {
        ${span.color ? `color: ${span.color};` : ''}
        ${span.font ? `font-family: ${span.font};` : ''}
      }
    `).join(' ')}
  `).join(' ')}
`.replace(/\n/g, ' ');

const Output = ({ formData }) => (
  <html lang="en">
    <style>{ styles(formData) }</style>
    <body>
      {get(formData, 'boxes', []).map((box, i) => (
        <div className={`text${i}`} key={i}>
          {get(box, 'spans', []).map((span, j) => (
            <span className={`text${i}-span${j}`} key={j}>
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
