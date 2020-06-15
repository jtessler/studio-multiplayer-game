import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import UserApi from './UserApi.js';
import firebase from 'firebase';
import gameData from './gameData.js';
import { Link } from 'react-router-dom';

export default class GameCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  gameDataExists() {
    return this.props.session.type in gameData;
  }

  /**
   * Returns the game data for the given type. If the game type doesn't exist
   * (i.e., we're trying to load a game that doesn't yet exist in this client
   * code), return blank data.
   */
  getGameData() {
    if (this.gameDataExists()) {
      return gameData[this.props.session.type];
    } else {
      return {
        title: "Unknown Game Type",
        authors: "Unknown Authors",
        description: "You are missing the code for this game type. " +
            "It is likely another team's project that is in development.",
        minUsers: 0,
        maxUsers: 0,
      };
    }
  }

  getTitle() {
    return this.getGameData().title;
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
    var authors = this.getGameData().authors;
    return "This game was designed and built by " + authors;
  }

  getDescription() {
    return this.getGameData().description;
  }

  getUserListHeader() {
    var numUsers = this.props.session.users.length;
    var maxUsers = this.getGameData().maxUsers;
    return numUsers + "/" + maxUsers + " users waiting to start";
  }

  getGamePath() {
    var type = this.props.session.type;
    var id = this.props.session.id;
    return "/" + type + "/" + id;
  }

  joinSession() {
    firebase.analytics().logEvent('select_content', {
      content_type: 'join_game',
      item_id: this.props.session.type
    });

    var uid = firebase.auth().currentUser.uid;
    var path = "/session-metadata/" + this.props.session.id + "/users";
    var sessionDatabaseRef = firebase.database().ref(path);
    var maxUsers = this.getGameData().maxUsers;
    sessionDatabaseRef.transaction((users) => {
      // Only join the session is there is room and this user is not already in
      // the session (i.e., spamming "join game").
      if (users.length < maxUsers && users.indexOf(uid) < 0) {
        users.push(uid);
      }
      return users;
    }).catch((error, committed, snapshot) => {
      console.error("Error joining session", error);
    });
  }

  deleteSession() {
    firebase.analytics().logEvent('select_content', {
      content_type: 'delete_game',
      item_id: this.props.session.type
    });

    var path = "/session/" + this.props.session.id;
    var sessionDatabaseRef = firebase.database().ref(path);
    sessionDatabaseRef.remove()
        .then(() => {
          // Permission to delete session data depends on state within the
          // metadata node, so we must delete session metadata *after* removing
          // session data.
          this.deleteSessionMetadata();
        })
        .catch((error) => {
          console.warn("Error removing session data", error);
          this.deleteSessionMetadata();
        });
  }

  deleteSessionMetadata() {
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

  isInSession() {
    var uid = firebase.auth().currentUser.uid;
    return this.props.session.users.indexOf(uid) >= 0;
  }

  shouldShowStartButton() {
    var users = this.props.session.users;
    var minUsers = this.getGameData().minUsers;
    return this.isInSession() && users.length >= minUsers;
  }

  isFull() {
    var users = this.props.session.users;
    var maxUsers = this.getGameData().maxUsers;
    return users.length >= maxUsers;
  }

  handleExpand() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    var userListItems = this.props.session.users.map((uid) => (
      <ListItem key={uid}>
        <Avatar src={UserApi.getPhotoUrl(uid)} />
        <ListItemText primary={UserApi.getName(uid)}/>
      </ListItem>
    ));

    var gameActionButton;
    if (!this.gameDataExists()) {
      gameActionButton = (
        <Button disabled={true}>
          Cannot join unknown game type
        </Button>
      );
    } else if (this.shouldShowStartButton()) {
      var target = {
        pathname: this.getGamePath(),
        state: {
          id: this.props.session.id,
          creator: this.props.session.creator,
          users: this.props.session.users,
          title: this.getTitle(),
        }
      }
      gameActionButton = (
        <Link
            style={{textDecoration: 'none'}}
            to={target}>
          <Button color="primary">
            Start game
          </Button>
        </Link>
      );
    } else {
      gameActionButton = (
        <Button
            onClick={() => this.joinSession()}
            disabled={this.isInSession() || this.isFull()}>
          {this.isFull() ? "Game is full" : "Join"}
        </Button>
      );
    }

    return (
      <Card style={this.props.style}>
        <CardHeader
            action={
              <IconButton onClick={() => this.handleExpand()}>
                {this.state.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            }
            title={this.getTitle()}
            subheader={this.getSubtitle()} />
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1">
              {this.getDescription()}
            </Typography>
            <Divider />
            <List>
              <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  paragraph={true}>
                {this.getUserListHeader()}
              </Typography>
              {userListItems}
            </List>
            <Divider />
            <Typography color="textSecondary">
              {this.getAuthors()}
            </Typography>
          </CardContent>
        </Collapse>
        <CardActions>
          {gameActionButton}
          <Button
              onClick={() => this.deleteSession()}
              disabled={!this.isGameCreator()}>
            Delete
          </Button>
        </CardActions>
      </Card>
    );
  }
}

