import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import firebase from 'firebase';
import UserApi from './UserApi.js'

export default class Announcment extends Component {

    render() {
        
        console.log(this.props.killedPlayers);
        
        var listItems = this.props.killedPlayers.map((id) => {
            return (<li>{UserApi.getName(id)}</li>);
        });

        var string = (this.props.killedPlayers.length === 0) ? "No one was murdered" : "Someone was murdered:"

        return (<div>
                {string}
                <ul>{listItems}</ul>
                </div>);
    }

}
