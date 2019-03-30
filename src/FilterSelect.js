// import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, { Component } from 'react';
import {FILTER_TYPE} from './WaitingRoom.js'

export default class FilterSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { filterType: FILTER_TYPE.MY_GAMES };
  }

  handleChange = event => {
    this.props.onFilterGames(event.target.value)
    this.setState({ filterType: event.target.value });
  };

  render() {
    return (
      <Select
          value={this.state.filterType}
          onChange={this.handleChange}
      >
        <MenuItem value={FILTER_TYPE.MY_GAMES}>My Games</MenuItem>
        <MenuItem value={FILTER_TYPE.ALL}>All</MenuItem>
      </Select>
    );
  }
}
