import React, { Children } from 'react';
import { IconButton, Typography } from 'material-ui';
import AddIcon from '@material-ui/icons/Add';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import CloseIcon from '@material-ui/icons/Close';

export default ({
  id, title, children, onSort, onRemove, onAdd,
}) => (
  <div data-name="array">
    <Typography variant="title">{title}</Typography>
    <div id={id}>
      {Children.map(children, (child, i) => (
        <div key={child.props.id} style={{ display: 'flex' }}>
          {child}
          <div>
            <IconButton onClick={onSort(i, i - 1)} disabled={!i}>
              <ArrowUp />
            </IconButton>
            <IconButton onClick={onSort(i, i + 1)} disabled={i === children.length - 1}>
              <ArrowDown />
            </IconButton>
            <IconButton onClick={onRemove(i)}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
    <div data-name="sort-widget">
      <IconButton onClick={onAdd}>
        <AddIcon />
      </IconButton>
    </div>
  </div>
);
