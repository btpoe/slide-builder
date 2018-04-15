import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import { Button, Typography } from 'material-ui';
import schema from './schema';
import Form from '../Form';
import { spanTexts } from './formData';

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

export default class extends Component {
  state = {
    activeTab: 0,
  };

  get currentBreakpoint() {
    return this.props.breakpoints.get(this.state.activeTab);
  }

  handleTabChange = (event, activeTab) => {
    this.setState({ activeTab });
  };

  handleFormChange = ({ formData }) => {
    const bpChanged = formData.screenWidth !== this.currentBreakpoint.screenWidth;

    formData.boxes.forEach(box => (box.spans || []).forEach((span) => {
      spanTexts[span.identity] = span.text;
      Object.defineProperty(span, 'text', {
        get: () => spanTexts[span.identity],
      });
    }));

    let breakpoints = this.props.breakpoints.set(this.state.activeTab, formData);

    if (bpChanged) {
      breakpoints = breakpoints.sortBy(bp => bp.screenWidth);
      this.setState({ activeTab: breakpoints.indexOf(formData) });
    }
    this.props.onChange({ formData: breakpoints });
  }

  render() {
    const {
      breakpoints, handleAddBreakpoint,
    } = this.props;
    const { activeTab } = this.state;

    return (
      <div style={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Tabs value={activeTab} onChange={this.handleTabChange}>
            {breakpoints.map((breakpoint, i) => (
              <Tab key={i} label={breakpoint.screenWidth} />
            ))}
          </Tabs>
          <Button variant="fab" color="secondary" mini aria-label="add" onClick={handleAddBreakpoint}>
            <AddIcon />
          </Button>
        </AppBar>
        <TabContainer>
          <Form
            formData={breakpoints.get(this.state.activeTab)}
            schema={schema}
            onChange={this.handleFormChange}
          />
        </TabContainer>
      </div>
    );
  }
}
