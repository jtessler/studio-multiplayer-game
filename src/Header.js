import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
        <AppBar position="static">
          <Toolbar>
            <IconButton
                style={{marginLeft: -12, marginRight: 20}}
                onClick={() => this.setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography
                variant="h6"
                color="inherit"
                style={{flexGrow: 1}}>
              {this.getTitle()}
            </Typography>
            <Button
                color="inherit"
                onClick={() => this.signOut()}>
              Sign out as {user.displayName}
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer
            open={this.state.drawerOpen}
            onClose={() => this.setDrawerOpen(false)}>

          <List>
            <ListItem>
              <ListItemText
                primaryTypographyProps={{variant: "title"}}
                primary="Navigation" />
            </ListItem>

            <Link style={{textDecoration: 'none'}} to="/">
              <MenuItem
                  onClick={() => this.setDrawerOpen(false)}
                  disabled={this.isInWaitingRoom()}>
                Go back to the waiting room
              </MenuItem>
            </Link>

            <ListItem>
              <ListItemText
                primaryTypographyProps={{variant: "title"}}
                primary="Active Games" />
            </ListItem>

            <MenuItem disabled={true}>
              Not implemented yet
            </MenuItem>

            <ListItem>
              <ListItemText
                primaryTypographyProps={{variant: "title"}}
                primary="Debug Tools" />
            </ListItem>
            
            <Link style={{textDecoration: 'none'}} to="/dataViewer">
                <MenuItem
                    onClick={() => this.setDrawerOpen(false)}>
                  View Game Data
                </MenuItem>
            </Link>

          </List>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(Header);
