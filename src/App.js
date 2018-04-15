import React, { Component } from 'react';
import { List } from 'immutable';
import { find, get, last, sortedIndexBy } from 'lodash';
import { Button } from 'material-ui';
import globalsSchema from './schema';
import Breakpoints from './Breakpoints';
import { ref } from './Breakpoints/schema';
import { spanTexts } from './Breakpoints/formData';
import {
  Container,
  Iframe,
  IframeContainer,
  DataContainer,
  SubmitWrap,
} from './Styled';
import output from './output';
import Form from './Form';

const clamp = (min, max, value) => Math.min(Math.max(value, min), max);

const slopeCalc = (slopes, value) => {
  const match = find(slopes, ['width', value]);
  if (match) {
    return match.height;
  }
  const insertAt = sortedIndexBy(slopes, { width: value }, 'width');
  if (!insertAt) {
    return slopes[0].height;
  }
  if (!slopes[insertAt]) {
    return last(slopes).height;
  }
  const upper = slopes[insertAt];
  const lower = slopes[insertAt - 1];
  const slope = (upper.height - lower.height) / (upper.width - lower.width);
  const intercept = lower.height - (lower.width * slope);
  return (value * slope) + intercept;
};

const iframeHeight = width => slopeCalc([
  { width: 320, height: 240 }, { width: 1440, height: 1024 },
], clamp(320, 1440, width));

export default class App extends Component {
  state = {
    previewScreenWidth: 1024,
    globals: {},
    breakpoints: List([{ screenWidth: 0 }]),
  }

  get data() {
    const { globals, breakpoints } = this.state;
    return { globals, breakpoints, spanTexts };
  }

  get output() {
    return output(this.data);
  }

  get viewportScale() {
    const widthScale = (window.innerWidth - 400) / this.state.previewScreenWidth;
    const heightScale = window.innerHeight / iframeHeight(this.state.previewScreenWidth);
    return Math.min(widthScale, heightScale);
  }

  get fileName() {
    return get(this.state.globals, 'slideName', 'slide').replace(/\s/g, '_');
  }

  handleBreakpointChange = ({ formData }) => {
    this.setState({ breakpoints: formData });
  }

  handleGlobalsChange = ({ formData }) => {
    this.setState({ globals: formData });
  }

  handleAddBreakpoint = () => {
    const newBreakpoint = { screenWidth: this.state.previewScreenWidth, boxes: [] };

    (this.state.breakpoints.first().boxes || []).forEach((box) => {
      newBreakpoint.boxes.push({
        identity: box.identity,
        spans: box.spans.map(span => ({
          identity: span.identity,
          get text() { return spanTexts[span.identity]; },
        })),
      });
    });

    this.setState({
      breakpoints: this.state.breakpoints.push(newBreakpoint).sortBy(bp => bp.screenWidth),
    });
  }

  handlePreviewScreenWidth = (e) => {
    this.setState({ previewScreenWidth: e.currentTarget.value });
  }

  handleLoad = (e) => {
    const file = get(e, 'target.files[0]');

    if (!file) return;

    const reader = new window.FileReader();

    reader.onload = () => {
      const { globals, spanTexts: importedSpanTexts, breakpoints } = JSON.parse(reader.result);
      ref.globalIdentity = breakpoints[0].boxes.reduce(
        (max, box) => Math.max(max, box.identity, ...(box.spans || []).map(span => span.identity)),
        1,
      );
      Object.assign(spanTexts, importedSpanTexts);
      this.setState({ globals, breakpoints: List(breakpoints) });
    };

    reader.readAsText(file);
  }

  render() {
    const { breakpoints } = this.state;

    return (
      <Container>
        <DataContainer>
          <Form
            schema={globalsSchema}
            formData={this.state.globals}
            onChange={this.handleGlobalsChange}
          />
          <Breakpoints
            breakpoints={breakpoints}
            handleAddBreakpoint={this.handleAddBreakpoint}
            onChange={this.handleBreakpointChange}
          />
          <SubmitWrap>
            <Button
              color="primary"
              component="a"
              href={`data:text/html,${this.output}`}
              download={`${this.fileName}.html`}
              style={{ marginRight: '12px' }}
              variant="raised"
            >
              Download
            </Button>

            <Button
              color="secondary"
              component="a"
              href={`data:application/json,${JSON.stringify(this.data).replace(/\s/g, '%20')}`}
              download={`${this.fileName}.json`}
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              variant="raised"
            >
              Save
            </Button>

            <label>
              <input
                onChange={this.handleLoad}
                style={{ display: 'none' }}
                type="file"
              />
              <Button variant="raised" component="span" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                Load
              </Button>
            </label>
          </SubmitWrap>
        </DataContainer>
        <IframeContainer>
          <Iframe
            srcDoc={this.output}
            style={{
              width: `${this.state.previewScreenWidth}px`,
              height: `${iframeHeight(this.state.previewScreenWidth)}px`,
              transform: `translate(-50%, -50%) scale(${this.viewportScale})`,
            }}
          />
          <div className="form-group field field-integer">
            <label className="control-label" htmlFor="root_previewScreenWidth">
              Preview Screen Width
            </label>
            <div className="field-range-wrapper">
              <input type="range" min="280" max="4000" className="form-control" id="root_previewScreenWidth" placeholder="" onChange={this.handlePreviewScreenWidth} value={this.state.previewScreenWidth} />
              <span className="range-view">{this.state.previewScreenWidth}</span>
            </div>
          </div>
        </IframeContainer>
      </Container>
    );
  }
}
