import React, { Component } from 'react';
import { get, find, sortedIndexBy, last } from 'lodash';
import schema, { uiSchema } from './schema';
import {
  Container,
  Iframe,
  IframeContainer,
  Form,
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
      formData: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
  }

  get output() {
    return output(this.state.formData);
  }

  get viewportScale() {
    const widthScale = window.innerWidth / this.state.formData.screenWidth;
    const heightScale = (window.innerHeight * 0.4) / iframeHeight(this.state.formData.screenWidth);
    return Math.min(widthScale, heightScale);
  }

  handleChange({ formData }) {
    this.setState({ formData });
  }

  handleLoad(e) {
    const file = get(e, 'target.files[0]');

    if (!file) return;

    const reader = new window.FileReader();

    reader.onload = () =>
      this.setState({
        formData: JSON.parse(reader.result),
      });

    reader.readAsText(file);
  }

  render() {
    return (
      <Container>
        <IframeContainer>
          <Iframe
            srcDoc={this.output}
            style={{
              width: `${this.state.formData.screenWidth}px`,
              height: `${iframeHeight(this.state.formData.screenWidth)}px`,
              transform: `translate(-50%, -50%) scale(${this.viewportScale})`,
            }}
          />
        </IframeContainer>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          formData={this.state.formData}
          onChange={this.handleChange}
        >
          <SubmitWrap className="btn-toolbar">
            <div className="btn-group">
              <a href={`data:text/html,${this.output}`} download className="btn btn-info">Download</a>
            </div>
            <div className="btn-group">
              <a href={`data:application/json,${JSON.stringify(this.state.formData)}`} download="slide-config.json" className="btn btn-info">Save</a>
              <FileUpload className="btn btn-info">
                Load
                <input type="file" onChange={this.handleLoad} />
              </FileUpload>
            </div>
          </SubmitWrap>
        </Form>
      </Container>
    );
  }
}
