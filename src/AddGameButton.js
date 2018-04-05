import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import React, { Component } from 'react';
import firebase from 'firebase';
import gameData from './gameData.js';

class AddGameMenuItem extends Component {
  addGame() {
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
      <MenuItem
          primaryText={this.props.title}
          onClick={() => this.addGame()} />
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
        <RaisedButton
            onClick={(event) => this.openPopover(event)}
            label="Create new game" />

        <Popover
            open={this.state.popoverOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => this.closePopover()}>
          <Menu>
            {menuItems}
          </Menu>
        </Popover>
      </center>
    );
  }
}
