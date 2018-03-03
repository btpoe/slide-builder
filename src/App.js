import React, { Component } from 'react';
import styled from 'styled-components';
import DefaultForm from 'react-jsonschema-form';
import schema, { uiSchema } from './schema';
import output from './output';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 40vw;
`;

const Form = styled(DefaultForm)`
  flex-grow: 1;
  margin-top: 20px;
  overflow: auto;
`;

const SubmitWrap = styled.div`
  background: #fff;
  border-top: 1px solid #ccc;
  bottom: 0;
  padding-top: 20px;
  position: sticky;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
    };

    this.handleChange = this.handleChange.bind(this);
  }

  get output() {
    return output(this.state.formData);
  }

  handleChange({ formData }) {
    this.setState({ formData });
  }

  render() {
    return (
      <Container>
        <Iframe srcDoc={this.output} />
        <Form
          schema={schema}
          uiSchema={uiSchema}
          formData={this.state.formData}
          onChange={this.handleChange}
        >
          <SubmitWrap>
            <a href={`data:text/html,${this.output}`} download className="btn btn-info">Download</a>
          </SubmitWrap>
        </Form>
      </Container>
    );
  }
}

export default App;
