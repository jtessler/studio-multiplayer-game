import Avatar from 'material-ui/Avatar';
import GameComponent from '../../GameComponent.js';
import React from 'react';
import TextField from 'material-ui/TextField';
import UserApi from '../../UserApi.js';
import firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';

export default class ChatRoom extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      input: "",
    };
  }

  onSessionDataChanged(data) {
    var chats = Object.keys(data).map((id) => ({
      id: id,
      message: data[id].message,
      timestamp: data[id].timestamp,
      user: data[id].user,
    }));
    chats.sort((a, b) => b.timestamp - a.timestamp);
    this.setState({ chats: chats });
  }

  handleKeyEvent(key) {
    if (key === "Enter" && this.state.input.length > 0) {
      var chatData = {
        message: this.state.input,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: this.getMyUserId(),
      }
      this.getSessionDatabaseRef().push(chatData, (error) => {
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
