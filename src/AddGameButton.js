import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { Component } from 'react';
import firebase from 'firebase';
import gameData from './gameData.js';

class AddGameMenuItem extends Component {
  addGame() {
    firebase.analytics().logEvent('select_content', {
      content_type: 'add_game',
      item_id: this.props.type
    });

    var user = firebase.auth().currentUser;
    var sessionData = {
      type: this.props.type,
      users: [user.uid],
      creator: user.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    }
    var sessionsDatabaseRef = firebase.database().ref("/session-metadata");

    sessionsDatabaseRef.push(sessionData, (error) => {
      if (error) {
        console.error("Error storing session metadata", error);
      }
    });

    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    return (
      <MenuItem onClick={() => this.addGame()}>
        {this.props.title}
      </MenuItem>
    );
  };
}

export default class AddGameButton extends Component {
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
    var menuItems = Object.keys(gameData).map((type) => (
      <AddGameMenuItem
          key={type}
          type={type}
          title={gameData[type].title}
          onClick={() => this.closePopover()} />
    ));

    return (
      <center style={this.props.style}>
        <Button
            variant="contained"
            onClick={(event) => this.openPopover(event)}>
          Create new game
        </Button>
        <Menu
            open={this.state.popoverOpen}
            anchorEl={this.state.anchorEl}
            onClose={() => this.closePopover()}>
          {menuItems}
        </Menu>
      </center>
    );
  }
}
