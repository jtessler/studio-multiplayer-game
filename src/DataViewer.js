import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import React, { Component } from 'react';
import ReactJson from 'react-json-view'
import firebase from 'firebase';


const DB_STATE = Object.freeze({
  UNINITIALIZED: 0,
  LOADING: 1,
  LOADED: 2,
});

class DatabaseViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db_state: DB_STATE.UNINITIALIZED,
      data: null,
    };
  }

  handleExpanded(expanded) {
    if (expanded) {
      switch (this.state.db_state) {
        case DB_STATE.UNINITIALIZED:
          firebase.analytics().logEvent('select_content', {
            content_type: 'view_game_data'
          });

          this.setState({ db_state: DB_STATE.LOADING });
          firebase.database().ref("/").once("value", (snapshot) => {
            // Check if user data firebase download is done yet.
            this.setState({
              db_state: DB_STATE.LOADED,
              data: snapshot.val(),
            });
          });
          break;
        case DB_STATE.LOADING:  // Fall through.
        case DB_STATE.LOADED:
          break;
        default:
          console.error("Invalid DB state", this.state.db_state);
      }
    }
  }

  renderDatabaseViewer() {
    switch (this.state.db_state) {
      case DB_STATE.UNINITIALIZED:  // Fall through.
      case DB_STATE.LOADING:
        return <Typography>Loading...</Typography>;
      case DB_STATE.LOADED:
        return (
            <ReactJson
                name="/"
                collapsed={1}
                src={this.state.data}
            />
        );
      default:
        console.error("Invalid DB state", this.state.db_state);
    }
  }

  render() {
    return (
      <Card className="Container">
        <ExpansionPanel
          style={{boxShadow: 'none'}}
          disabled={this.props.disabled}
          onChange={(e, expanded) => this.handleExpanded(expanded)}>

          <ExpansionPanelSummary
            style={{paddingLeft: 0}}
            expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Expand to see JSON view of entire database
            </Typography>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails
            style={{display: 'block', paddingLeft: 0, textAlign: 'left'}}>
            {this.renderDatabaseViewer()}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Card>
    );
  }
}

export default DatabaseViewer;

