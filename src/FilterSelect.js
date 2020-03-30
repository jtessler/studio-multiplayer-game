import MenuItem from '@material-ui/core/MenuItem';
import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import {FILTER_TYPE} from './WaitingRoom.js'

export default class FilterSelect extends Component {

  handleChange(event) {
    this.props.onFilterGames(event.target.value)
  }

  render() {
    return (
      <Select
          value={this.props.filterType}
          onChange={(event) => this.handleChange(event)}>
        <MenuItem value={FILTER_TYPE.MY_GAMES}>
          Games I Created
        </MenuItem>
        <MenuItem value={FILTER_TYPE.GAMES_WITH_SPACE}>
          Games with Space
        </MenuItem>
        <MenuItem value={FILTER_TYPE.GAMES_I_AM_IN}>
          Games I Joined
        </MenuItem>
        <MenuItem value={FILTER_TYPE.ALL_GAMES}>
          All Games
        </MenuItem>
      </Select>
    );
  }
}
