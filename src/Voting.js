// import React, { Component } from 'react';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';
// import firebase from 'firebase';
// import UserApi from './UserApi.js';

// export default class Voting extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             buttonsDisabled: false
//         };
//     }

//     render() {

//         var players = this.props.players;

//         var content;

//         if (this.props.currentPlayer.role.name === "Mafia" && 'Citzen') {

//             var listItems = [];

//             for (var i = 0; i < players.length; i++) {
//                 var id = players[i].id;
//                 var handleClick = (e) => this.onButtonClick(e);
//                 listItems.push((<li><button id={id} onClick={handleClick} disabled={this.state.buttonsDisabled}> {UserApi.getName(id)} </button></li>));
//             }

//             content = (
//                 <div>
//                 <ul>{listItems}</ul>
//             </div>);
//         }
//         else {
//             content = (
//                 <div>
//                 Later that night...
//             </div>);
//         }

//         return (<div>{content}</div>);
//     }
// }