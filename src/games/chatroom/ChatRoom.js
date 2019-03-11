import Avatar from 'material-ui/Avatar';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import UserApi from '../../UserApi.js';
import firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      input: "",
    };
  }

  componentWillMount() {
    var id = this.props.match.params.id;
    var sessionDatabaseRef = firebase.database().ref("/session/" + id);
    sessionDatabaseRef.on("value", (snapshot) => {
      var sessionSnapshot = snapshot.val();
      if (sessionSnapshot === null) {
        this.setState({ chats: [] });
        return;
      }

      var chats = Object.keys(sessionSnapshot).map((id) => ({
        id: id,
        message: sessionSnapshot[id].message,
        timestamp: sessionSnapshot[id].timestamp,
        user: sessionSnapshot[id].user,
      }));
      chats.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({ chats: chats });
    });
  }

  componentWillUnmount() {
    var id = this.props.match.params.id;
    firebase.database().ref("/session/" + id).off();
  }

  handleKeyEvent(key) {
    if (key === "Enter" && this.state.input.length > 0) {
      var chatData = {
        message: this.state.input,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: firebase.auth().currentUser.uid
      }
      var sessionId = this.props.match.params.id;
      var sessionDatabaseRef = firebase.database().ref("/session/" + sessionId);
      sessionDatabaseRef.push(chatData, (error) => {
        if (error) {
          console.error("Error storing session metadata", error);
        }
      });
      this.setState({ input: "" });
    }
  }

  render() {
    var chatListItems = this.state.chats.slice(0, 10).map((chat, i) => (
      <ListItem
          key={chat.id}
          style={{opacity: (10 - i) / 10}}
          disabled={true}
          primaryText={UserApi.getName(chat.user)}
          secondaryText={chat.message}
          leftAvatar={<Avatar src={UserApi.getPhotoUrl(chat.user)} />} />
    ));
    return (
      <div style={{margin: 56}}>
        <TextField
            name="Chat message input"
            hintText="Type your message and press enter"
            fullWidth={true}
            onChange={(event, value) => this.setState({ input: value })}
            onKeyPress={(event) => this.handleKeyEvent(event.key)}
            value={this.state.input} />
        <List>
          {chatListItems}
        </List>
      </div>
    );
  }
}
