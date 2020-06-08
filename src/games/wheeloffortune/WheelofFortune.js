import GameComponent from "../../GameComponent.js";
import UserApi from "../../UserApi.js";
import React from "react";
import Timer from "./Timer.js";
import question_data from "./Data.js";
import "./WheelofFortune.css";

export default class WheelofFortune extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      last_user_id: null,
      question: question_data,
      answers: ["1", "2", "3", "4"],
      response: "[No response yet]",
      user_ids: [],
      points: [0, 0, 0],
      player_index: 0,
      question_index: 0,
      selectedItem: null,
      selected_question: { question: "", answer: "" },
      is_response_correct: false
    };
    this.selectItem = this.selectItem.bind(this);

    this.getSessionDatabaseRef().update({
      user_id: this.state.last_user_id,
      response: this.state.response,
      player_index: this.state.player_index,
      selected_question: this.state.selected_question,
      is_response_correct: this.state.is_response_correct,
      points: this.state.points
    });
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(
        Math.random() * this.state.question.length
      );
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      let Item =
        this.state.selectedItem === null
          ? this.state.question[selectedItem]
          : this.state.question[selectedItem];
      this.getSessionDatabaseRef().update({
        selected_question: Item
      });
      this.setState(prevState => ({ selectedItem: selectedItem }));
    } else {
      this.setState(prevState => ({ selectedItem: null }));
      setTimeout(this.selectItem, 500);
    }
  }

  onSessionDataChanged(data) {
    this.setState(prevState => ({
      last_user_id: data.user_id,
      response: data.response,
      player_index: data.player_index,
      selected_question: data.selected_question,
      is_response_correct: data.is_response_correct,
      points: data.points
    }));
  }

  handleSubmitButton() {
    var current_player_index = this.state.player_index;
    var new_index = current_player_index;
    if (current_player_index === this.getSessionUserIds().length - 1) {
      new_index = 0;
    } else {
      new_index = current_player_index + 1;
    }

    var response = document.getElementById("response").value.toLowerCase();
    var is_response_correct = response.includes(
      this.state.selected_question.answer.toLowerCase()
    );

    console.log("response: " + response);
    console.log("answer:" + this.state.selected_question.answer);
    console.log(is_response_correct);

    var updated_points;

    if (is_response_correct && this.state.points != null) {
      var updated_player_points =
        this.state.points[current_player_index] +
        this.state.selected_question.points;

      updated_points = [];
      for (var i = 0; i < this.state.points.length; i++) {
        if (i === current_player_index) {
          updated_points.push(updated_player_points);
        } else {
          updated_points.push(this.state.points[i]);
        }
      }
    } else if (this.state.points != null) {
      updated_points = this.state.points;
    } else {
      updated_points = [0, 0, 0];
    }

    this.getSessionDatabaseRef().update({
      user_id: this.getMyUserId(),
      response: document.getElementById("response").value,
      player_index: new_index,
      is_response_correct: is_response_correct,
      points: updated_points
    });
    console.log("handle submit button index after " + this.state.player_index);
  }

  render() {
    const { selectedItem } = this.state;

    const wheelVars = {
      "--nb-item": this.state.question.length,
      "--selected-item": selectedItem
    };
    const spinning = selectedItem !== null ? "spinning" : "";

    if (this.state.points != null) {
      var points = this.state.points;
    } else {
      points = [];
    }
    var users = this.getSessionUserIds().map((user_id, index) => (
      <li key={user_id}>
        {UserApi.getName(user_id)} -----> {points[index]}
      </li>
    ));

    var last_user = "No one";
    if (this.state.last_user_id != null) {
      last_user = UserApi.getName(this.state.last_user_id);
    }

    var player_index = this.state.player_index;
    var current_player = UserApi.getName(
      this.getSessionUserIds()[player_index]
    );

    var player_turn = "It's " + current_player + "'s turn";
    console.log("current player" + current_player);

    var selected_question;
    if (this.state.selected_question != null) {
      selected_question = this.state.selected_question.question;
    } else {
      selected_question = "No question has been selected yet";
    }

    var show_text_box =
      this.getSessionUserIds()[player_index] === this.getMyUserId();

    if (show_text_box) {
      var countdown = <Timer />;
      var enter_answer_here = "Enter your answer here: ";
      var input_text_box = <input type="text" id="response" />;
      var submit_button = (
        <button onClick={() => this.handleSubmitButton()}> Submit </button>
      );
    }
    var last_user_with_response =
      last_user + ' responded with "' + this.state.response + '"';

    var correct_or_incorrect;
    if (this.state.is_response_correct === null) {
      correct_or_incorrect = "";
    } else if (this.state.is_response_correct) {
      correct_or_incorrect = "The answer was correct! 🤩";
    } else {
      correct_or_incorrect = "The answer was incorrect 😭";
    }

    return (
      <div className="div">
        <div className="wheel-container">
          <div
            className={`wheel ${spinning}`}
            style={wheelVars}
            onClick={this.selectItem}
          >
            {this.state.question.map((item, index) => (
              <div
                className="wheel-item"
                key={index}
                style={{ "--item-nb": index }}
              >
                {item.wheel_label}
              </div>
            ))}
          </div>
          <br />
        </div>
        <div className="game-info">
          <p>Players: </p>
          <ul>{users}</ul>
          <p> {player_turn} </p>
          <p> Question is: {selected_question} </p>
          {countdown}
          {enter_answer_here}
          {input_text_box}
          {submit_button}
          <p> {last_user_with_response} </p>
          <p>{correct_or_incorrect} </p>
        </div>
      </div>
    );
  }
}
