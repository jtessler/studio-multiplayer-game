import FlatButton from 'material-ui/FlatButton';
import React, { Component } from 'react';
import firebase from 'firebase';
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import { Link } from 'react-router-dom';

export default class GameCard extends Component {
  getTitle() {
    return this.props.session.type;
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
    return "Created on " + dateString;
  }

  getText() {
    var numUsers = this.props.session.users.length;
    var maxUsers = this.props.session.maxUsers;
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
    return (
      <Card style={this.props.style}>
        <CardTitle title={this.getTitle()} subtitle={this.getSubtitle()} />
        <CardText>{this.getText()}</CardText>
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

