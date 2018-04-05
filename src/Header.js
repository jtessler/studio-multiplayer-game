import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import React, { Component } from 'react';
import Subheader from 'material-ui/Subheader';
import firebase from 'firebase';
import gameData from './gameData.js';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false };
  }

  setDrawerOpen(open) {
    this.setState({ drawerOpen: open });
  }

  signOut() {
    firebase.auth().signOut().catch(
        (error) => console.error("Failed to sign out", error));
  }

  getTitle() {
    var parts = this.props.location.pathname.split("/");
    if (parts.length >= 2 && parts[1] in gameData) {
      return gameData[parts[1]].title;
    } else {
      return "Studio Games!";
    }
  }

  isInWaitingRoom() {
    return this.props.location.pathname === "/";
  }

  render() {
    var user = firebase.auth().currentUser;
    return (
      <div>
        <AppBar
            title={this.getTitle()}
            iconElementRight={
              <FlatButton label={"Sign out as " + user.displayName} />
            }
            onLeftIconButtonClick={() => this.setDrawerOpen(true)}
            onRightIconButtonClick={() => this.signOut()} />

        <Drawer
            docked={false}
            open={this.state.drawerOpen}
            onRequestChange={(open) => this.setDrawerOpen(open)}>
          <Link style={{textDecoration: 'none'}} to="/">
            <MenuItem
                onClick={() => this.setDrawerOpen(false)}
                primaryText="Go back to the waiting room"
                disabled={this.isInWaitingRoom()} />
          </Link>
          <Subheader>Active Games</Subheader>
          <MenuItem primaryText="No active sessions" disabled={true} />
        </Drawer>
      </div>
    );
  }
}

export default withRouter(Header);
