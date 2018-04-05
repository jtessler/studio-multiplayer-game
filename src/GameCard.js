import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import React, { Component } from 'react';
import Subheader from 'material-ui/Subheader';
import UserApi from './UserApi.js';
import firebase from 'firebase';
import gameData from './gameData.js';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import { Link } from 'react-router-dom';
import { List, ListItem } from 'material-ui/List';

export default class GameCard extends Component {
  getTitle() {
    return gameData[this.props.session.type].title;
  }

  getSubtitle() {
    var date = new Date(this.props.session.timestamp);
    var options = {
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      month: "long",
      second: "numeric",
      timeZone: "America/New_York",
      weekday: "long",
      year: "numeric",
    };
    var dateString = new Intl.DateTimeFormat("en-US", options).format(date);
    var creator = UserApi.getName(this.props.session.creator);
    return "Created on " + dateString + " by " + creator;
  }

  getAuthors() {
    var authors = gameData[this.props.session.type].authors;
    return "This game was created by " + authors;
  }

  getDescription() {
    return gameData[this.props.session.type].description;
  }

  getUserListHeader() {
    var numUsers = this.props.session.users.length;
    var maxUsers = gameData[this.props.session.type].maxUsers;
    return numUsers + "/" + maxUsers + " users waiting to start";
  }

  getGamePath() {
    var type = this.props.session.type;
    var id = this.props.session.id;
    return "/" + type + "/" + id;
  }

  deleteSession() {
    var path = "/session-metadata/" + this.props.session.id;
    var sessionDatabaseRef = firebase.database().ref(path);
    sessionDatabaseRef.remove().catch((error) => {
      console.error("Error removing session metadata", error);
    });
  }

  isGameCreator() {
    var user = firebase.auth().currentUser;
    return user.uid === this.props.session.creator;
  }

  render() {
    var userListItems = this.props.session.users.map((uid) => (
      <ListItem
          key={uid}
          disabled={true}
          primaryText={UserApi.getName(uid)}
          leftAvatar={<Avatar src={UserApi.getPhotoUrl(uid)} />} />
    ));

    return (
      <Card style={this.props.style}>
        <CardTitle
            title={this.getTitle()}
            subtitle={this.getSubtitle()}
            actAsExpander={true}
            showExpandableButton={true} />
        <CardText expandable={true}>
          <p>{this.getDescription()}</p>
          <Divider />
          <List>
            <Subheader>{this.getUserListHeader()}</Subheader>
            {userListItems}
          </List>
          <Divider />
          <p style={{fontSize: 10}}>{this.getAuthors()}</p>
        </CardText>
        <CardActions>
          <Link to={this.getGamePath()}>
            <FlatButton label="Join" />
          </Link>

          <FlatButton
              label="Delete"
              onClick={() => this.deleteSession()}
              disabled={!this.isGameCreator()} />
        </CardActions>
      </Card>
    );
  }
}

