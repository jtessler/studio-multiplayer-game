import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { Component } from 'react';

export default class FilterButton extends Component {
  constructor(props) {
    super(props);
    this.state = { popoverOpen: false };
  }

  openPopover(event) {
    event.preventDefault(); // Prevent ghost click.

    this.setState({
      popoverOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  closePopover() {
    this.setState({ popoverOpen: false });
  };

  render() {
    return (
      <center style={this.props.style}>
        <Button
            variant="contained"
            onClick={(event) => this.openPopover(event)}>
          Filter Games
        </Button>
        <Menu
            open={this.state.popoverOpen}
            anchorEl={this.state.anchorEl}
            onClose={() => this.closePopover()}>
          <MenuItem onClick={() => this.props.onFilterGames("all")}>
            All Games
          </MenuItem>
          <MenuItem onClick={() => this.props.onFilterGames("myGames")}>
            My Games
          </MenuItem>
        </Menu>
      </center>
    );
  }
}
