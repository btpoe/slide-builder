import React, { Component } from 'react';
import { List } from 'immutable';
import { find, get, last, sortedIndexBy } from 'lodash';
import Form from 'react-jsonschema-form';
import schema, { uiSchema, globalsSchema, globalsUiSchema, ref } from './schema';
import {
  Container,
  Iframe,
  IframeContainer,
  DataContainer,
  SubmitWrap,
  FileUpload,
} from './Styled';
import output from './output';

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
  constructor(props) {
    super(props);

    this.state = {
      previewScreenWidth: 1024,
      globals: {},
      spanTexts: {},
      breakpoints: List([{ screenWidth: 0 }]),
      currentBreakpointIndex: 0,
    };

    this.handleLoad = this.handleLoad.bind(this);
    this.handleBreakpointChange = this.handleBreakpointChange.bind(this);
    this.handleGlobalsChange = this.handleGlobalsChange.bind(this);
    this.handleAddBreakpoint = this.handleAddBreakpoint.bind(this);
    this.handlePreviewScreenWidth = this.handlePreviewScreenWidth.bind(this);
  }

  get data() {
    const { globals, textBoxes, breakpoints } = this.state;
    return { globals, textBoxes, breakpoints };
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

  get currentBreakpoint() {
    return this.state.breakpoints.get(this.state.currentBreakpointIndex) || {};
  }

  set currentBreakpoint(breakpointData) {
    const bpChanged = breakpointData.screenWidth !== this.currentBreakpoint.screenWidth;
    let breakpoints = this.state.breakpoints.set(this.state.currentBreakpointIndex, breakpointData);

    const spanTexts = {};
    breakpointData.boxes.forEach(box => (box.spans || []).forEach((span) => {
      spanTexts[span.identity] = span.text;
      Object.defineProperty(span, 'text', {
        get: () => this.state.spanTexts[span.identity],
      });
    }));

    if (bpChanged) {
      breakpoints = breakpoints.sortBy(bp => bp.screenWidth);
      this.setState({ currentBreakpointIndex: breakpoints.indexOf(breakpointData) });
    }
    this.setState({ breakpoints, spanTexts });
  }

  setActiveBreakpoint(currentBreakpointIndex) {
    return (e) => {
      e.preventDefault();
      this.setState({ currentBreakpointIndex });
    };
  }

  handleBreakpointChange({ formData }) {
    this.currentBreakpoint = formData;
  }

  handleGlobalsChange({ formData }) {
    this.setState({ globals: formData });
  }

  handleAddBreakpoint() {
    const form = this;
    const newBreakpoint = { screenWidth: this.state.previewScreenWidth, boxes: [] };

    this.state.breakpoints.first().boxes.forEach((box) => {
      newBreakpoint.boxes.push({
        identity: box.identity,
        spans: box.spans.map(span => ({
          identity: span.identity,
          get text() { return form.state.spanTexts[span.identity]; },
        })),
      });
    });

    this.setState({
      breakpoints: this.state.breakpoints.push(newBreakpoint).sortBy(bp => bp.screenWidth),
    });
  }

  handlePreviewScreenWidth(e) {
    const previewScreenWidth = e.currentTarget.value;
    this.setState({
      previewScreenWidth,
      currentBreakpointIndex: this.state.breakpoints.findLastIndex(bp =>
        bp.screenWidth <= previewScreenWidth),
    });
  }

  handleLoad(e) {
    const file = get(e, 'target.files[0]');

    if (!file) return;

    const reader = new window.FileReader();

    reader.onload = () => {
      const { globals, textBoxes, breakpoints } = JSON.parse(reader.result);
      ref.globalIdentity = breakpoints[0].boxes.reduce(
        (max, box) => Math.max(max, box.identity, ...(box.spans || []).map(span => span.identity)),
        1,
      );
      this.setState({ globals, textBoxes, breakpoints: List(breakpoints) });
    };

    reader.readAsText(file);
  }

  render() {
    return (
      <Container>
        <DataContainer>
          <Form
            schema={globalsSchema}
            uiSchema={globalsUiSchema}
            formData={this.state.globals}
            onChange={this.handleGlobalsChange}
          >
            <div />
          </Form>
          <ul className="nav nav-pills">
            {this.state.breakpoints.map((breakpoint, i) => (
              <li className="nav-item" key={i}>
                <button
                  className={`btn btn-${this.state.currentBreakpointIndex === i ? 'primary' : 'secondary'}`}
                  onClick={this.setActiveBreakpoint(i)}
                >
                  {breakpoint.screenWidth}
                </button>
              </li>
            ))}
            <li className="nav-item">
              <button className="btn btn-info" onClick={this.handleAddBreakpoint}>+ Breakpoint</button>
            </li>
          </ul>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={this.currentBreakpoint}
            onChange={this.handleBreakpointChange}
          >
            <SubmitWrap className="btn-toolbar">
              <div className="btn-group">
                <a href={`data:text/html,${this.output}`} download={`${this.fileName}.html`} className="btn btn-info">Download</a>
              </div>
              <div className="btn-group">
                <a href={`data:application/json,${JSON.stringify(this.data).replace(/\s/g, '%20')}`} download={`${this.fileName}.json`} className="btn btn-info">Save</a>
                <FileUpload className="btn btn-info">
                  Load
                  <input type="file" onChange={this.handleLoad} />
                </FileUpload>
              </div>
            </SubmitWrap>
          </Form>
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
