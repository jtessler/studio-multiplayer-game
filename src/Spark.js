import Avatar from 'material-ui/Avatar';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';
import {GridList, GridTile} from 'material-ui/GridList';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
  },
};

const ButtonStyle = {
  position: "fixed",
  right: 24,
  bottom: 24,
  marginBottom: 0,
  zIndex: 998,
};

export default class Spark extends Component {
  constructor(props) {
    super(props);
    var path = "/session/" + this.props.match.params.id;
    this.sessionRef = firebase.database().ref(path);

    this.state = {
      posts: [],
      urlInput: "",
      userInput: "",
      open: false,
    };
  }
  handleOpen() {
    this.setState({
      open: true,
    })
  }
  
  handleClose() {
    this.sessionRef.push({
      user: this.state.userInput,
      name: "",
      image: this.state.urlInput,
    })
    this.setState({
      open: false,
      input: "",
    })
  }
  
  handleCancel() {
    this.setState({
      open: false,
      input: "",
    })
  }

  handleUserChange(event, newValue) {
    this.setState({
      userInput: newValue,
    })
  }
  
    handleUrlChange(event, newValue) {
    this.setState({
      urlInput: newValue,
    })
  }

  componentWillMount() {
    
    /*
    From firebase: {
    
      "<random-id>": {
        user: "foo",
        name: "foo name",
        image: "URL"
      }
      ....
    }
    
    We want: [
      {
        user: "foo",
        name: "foo name",
        image: "URL"
      }
    ]
    */
    this.sessionRef.on("value", (snapshot) => this.setState({
      posts: snapshot.val() ? Object.values(snapshot.val()) : [],
    }))
  }

  componentWillUnmount() {
  }

  handleKeyEvent(key) {
  }

  render() {
    const actions = [
      <FlatButton
        label="POST"
        primary={true}
        onClick={() => this.handleClose()}
      />,
      <FlatButton
        label="CANCEL"
        secondary={true}
        onClick={() => this.handleCancel()}
      />
    ];

    return (
      <div className="spark" style={{margin: 56}}>
      <Dialog
          title="Paste your url..."
          actions={actions}
          modal={false}
          open={this.state.open}
        >
        <TextField onChange={(event, newValue) => this.handleUrlChange(event, newValue)}
              hintText="Paste your url "
              floatingLabelText="Photo url " />        
        <TextField onChange={(event, newValue) => this.handleUserChange(event, newValue)}
              hintText="Enter your username"
              floatingLabelText="Username" />
      </Dialog>
        <GridList
          cellHeight={"auto"}
          style={styles.gridList}
      >
          {this.state.posts.map((tile) => (
            <GridTile
              title={tile.name}>
              <img alt='' src={tile.image} />
            </GridTile>
          ))}
        </GridList>
        <div class= "blurb">
        <h1>Spark</h1>
        <p>Spark is a modern photo-sharing app aimed at connecting
          you with the things you cherish and care about---in 
          our case, it was cats. It is a combination of our favorite
          social media apps: the roasting of black Twitter,
          the stalking of Instagram for “reliable” ads,
          and organizing a life you’ll never have on Pinterest.
          It consists of a platform to share photos,
          and a bar that always tells you who of the people
          you follow is currently online.
          It is an innovative app that allows you to---
       </p>
       <p> M’baku: Are you done?
       </p>
        </div>
        
        <div class= "list">
          <List>
            <Subheader>Currently online are...</Subheader>
            <ListItem
              primaryText="Ramata Williams Bah"
              leftAvatar={<Avatar src="https://i.pinimg.com/236x/12/e4/36/12e436feb149808f974bfdb9a61c4eef--amazing-sketches-instagram-fashion.jpg" />}
              rightIcon={<CommunicationChatBubble />}
            />
            <ListItem
              primaryText="Andrea Cajamarca"
              leftAvatar={<Avatar src="https://www.toonpool.com/user/4550/files/salma_hayek_721035.jpg" />}
              rightIcon={<CommunicationChatBubble />}
            />
          </List>
       </div>

        <FloatingActionButton secondary={true} style={ButtonStyle} onClick={() => this.handleOpen()}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

//subtitle={<span>by <b>{tile.author}</b></span>}
