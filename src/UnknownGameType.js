import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class UnknownGameType extends Component {
  constructor(props) {
    super(props);
    this.state = { dialog_open: true };
  }

  componentWillMount() {
    document.title = "Unknown Game";
  }

  render() {
    var type = this.props.match.params.type;
    var id = this.props.match.params.id;
    return (
      <Dialog
          open={this.state.dialog_open}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}>
        <DialogTitle>Unknown Game!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Game Type: <code>{type}</code>
          </DialogContentText>
          <DialogContentText>
            Game ID: <code>{id}</code>
          </DialogContentText>
          <DialogContentText style={{marginTop: 10}}>
            <b>Oops!</b> You do not have the code for this game type. This is
            probably another team's project.  Please go back to the waiting
            room and try another game.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link style={{textDecoration: 'none'}} to="/">
            <Button
                color="primary"
                autoFocus={true}>
              Go to waiting room
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    );
  }
}
