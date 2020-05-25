import GameComponent from "../../GameComponent.js";
import React from "react";
import "./style.css";
import UserApi from "../../UserApi.js";
import Button from "@material-ui/core/Button";
import Logo from "./Logo.png";
import Whisper from "./Whisper icon.png";

export default class GoogleGossip extends GameComponent {
  constructor(props) {
    super(props);
    this.getSessionDatabaseRef().set({
      user_id: UserApi.getName(this.getMyUserId()),
      currentPlayer: "string",
      statements: ["statement 1", "statement 2", "statement 3"],
      truth: 0,
      guess: null,
      isLandingPage: true,
      isFormPage: false,
      isPickAnswerForm: false,
      isWaitPage: false
    });

    this.state = {
      user_id: UserApi.getName(this.getMyUserId()),
      currentPlayer: "string",
      statements: ["statement 1", "statement 2", "statement 3"],
      truth: 0,
      guess: null,
      isLandingPage: true,
      isFormPage: false,
      isPickAnswerForm: false,
      isWaitPage: false
    };
  }

  onSessionDataChanged(data) {
    if (data.currentPlayer !== "string") {
      if (this.state.isLandingPage) {
        if (data.currentPlayer === this.getMyUserId()) {
          this.setState({
            isLandingPage: false,
            isFormPage: true
          });
        } else {
          this.setState({
            isLandingPage: false,
            isWaitPage: true
          });
        }
      } else if (this.state.isFormPage || this.state.isWaitPage) {
        this.setState({
          isFormPage: false,
          isWaitPage: false,
          isPickAnswerForm: true
        });
      }
    }
  }

  handleButtonClick(Button_idx) {
    this.getSessionDatabaseRef().set({
      guess: Button_idx
    });

    this.setState({ guess: Button_idx });
  }

  shouldShowCorrect() {
    console.log("truth", this.state.truth, typeof this.state.truth);
    console.log("guess", this.state.guess, typeof this.state.guess);
    if (this.state.guess === null) {
      return false;
    } else {
      console.log("should show correct:", this.state.truth === this.state.guess);
      return this.state.truth === this.state.guess;
    }
  }

  shouldShowIncorrect() {
    if (this.state.guess === null) {
      return false;
    } else {
      console.log(
        "should show incorrect:",
        this.state.truth !== this.state.guess
      );
      return this.state.truth !== this.state.guess;
    }
  }

  submitTea() {
    this.setState({
      currentPlayer: this.getMyUserId(),
      isLandingPage: false,
      isFormPage: true
    });

    this.getSessionDatabaseRef().set({
      currentPlayer: this.getMyUserId()
    });
  }

  landingPageRender() {
    return (
      <div className="main">
        <img alt="" id="logo" src={Logo} />
        <br />
        <Button
          variant="outlined"
          color="inherit"
          id="NewSession"
          onClick={() => this.submitTea()}
        >
          Get Gossiping
        </Button>
      </div>
    );
  }

  pickAnAnswerRender() {
    return (
      <div className="main3">
        <div className="AnswerWrapper">
          <div className={this.shouldShowCorrect() ? "Shown" : "Hidden"}>
            Correct
          </div>
          <div className={this.shouldShowIncorrect() ? "Shown" : "Hidden"}>
            Incorrect
          </div>
        </div>

        <Button
          variant="outlined"
          id="0"
          onClick={() => this.handleButtonClick(0)}
        >
          {this.state.statements[0]}
        </Button>
        <br />
        <Button
          variant="outlined"
          id="1"
          onClick={() => this.handleButtonClick(1)}
        >
          {this.state.statements[1]}
        </Button>
        <br />
        <Button
          variant="outlined"
          id="2"
          onClick={() => this.handleButtonClick(2)}
        >
          {this.state.statements[2]}
        </Button>
        <br />
      </div>
    );
  }

  handleFormSubmit(event) {
    // take the input from input0, input1, and input 2 --> override the "statements"
    // Take input from truthIdx --> override "truth"
    // [optional] error checking

    this.getSessionDatabaseRef().set(this.state);
  }

  handleFormChange(idx, event) {
    let newStatements = this.state.statements;
    newStatements[idx] = event.target.value;
    this.setState({
      statements: newStatements
    });
  }

  handleLieChange(event) {
    console.log("changing lie val", event.target.value);
    this.setState({
      truth: parseInt(event.target.value, 10)
    });
  }

  submitAQuestionRender() {
    return (
      <div className="main2">
        <img alt="" id="Whisper" src={Whisper} />
        <form onSubmit={event => this.handleFormSubmit(event)}>
          <label id="input0">Truth or Lie #0</label>
          <br />
          
          <input
            className="flexform"
            type="text"
            value={this.state.statements[0]}
            onChange={event => this.handleFormChange(0, event)}
            required
          />
          <br />

          <label id="input1">Truth or Lie #1</label>
          <br />
          <input
            className="flexform"
            type="text"
            value={this.state.statements[1]}
            onChange={event => this.handleFormChange(1, event)}
            required
          />
          <br />

          <label id="input2">Truth or Lie #2</label>
          <br />
          <input
            className="flexform"
            type="text"
            value={this.state.statements[2]}
            onChange={event => this.handleFormChange(2, event)}
            required
          />
          <br />

          <label id="truthIdx">Index for Truth Statement</label>
          <br />
          <input
            className="flexform"
            type="text"
            value={this.state.truth}
            onChange={event => this.handleLieChange(event)}
            maxLength="1"
            required
          />
          <br />

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

  waitPageRender() {
    return <div>Wait....</div>;
  }

  renderPage() {
    // var users = this.getSessionUserIds().map(user_id => (
    //   <li key={user_id}>{UserApi.getName(user_id)}</li>
    // ));
    // var creator = UserApi.getName(this.getSessionCreatorUserId());
    // var me = UserApi.getName(this.getMyUserId());

    // isLandingPage: true,
    // isFormPage: false,
    // isPickAnswerForm: false,
    if (this.state.isLandingPage) {
      return this.landingPageRender();
    } else if (this.state.isFormPage) {
      return this.submitAQuestionRender();
    } else if (this.state.isPickAnswerForm) {
      return this.pickAnAnswerRender();
    } else if (this.state.isWaitPage) {
      return this.waitPageRender();
    }
  }

  render() {
    return (
      <div className="GoogleGossip">
        {this.renderPage()}
      </div>
    );
  }
}
