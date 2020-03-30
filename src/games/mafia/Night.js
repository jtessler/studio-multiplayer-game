import React, { Component } from 'react';
import UserApi from '../../UserApi.js'

export default class Night extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonsDisabled: false
        };
    }

    onButtonClick(e){
        this.setState({buttonsDisabled: true});
        this.props.handleKill(e.target.id);
    }

    render() {

        var players = this.props.players;

        var content;

        if(this.props.currentPlayer.role.name === "Mafia") {

            var listItems = [];

            for(var i = 0; i < players.length; i++){
                var id = players[i].id;
                var handleClick = (e) => this.onButtonClick(e);
                listItems.push( (<li><button className="color" id={id} onClick={handleClick} disabled={this.state.buttonsDisabled}> {UserApi.getName(id)} </button></li>) );
            }

            content = (
            <div>
                <ul>{listItems}</ul>
            </div>);
        }else{
            content = (
            <div>
                Sleep ._.
            </div>);
        }

        return (<div>{content}</div>);
    }

}
