import React from "react";

import "./SpinningWheel.css";

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null
    };
    this.selectItem = this.selectItem.bind(this);
  }

  selectItem() {
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.props.items.length);
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      this.setState({ selectedItem });
      let Item =
        this.state.selectedItem === null
          ? this.props.items[selectedItem]
          : this.props.items[selectedItem];
      console.log(Item);
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 500);
    }
  }

  handleSubmitButton() {
    console.log(document.getElementById("response").value);
    console.log("handle submit button index before " + this.props.player_index);
    var new_index = this.props.player_index;
    if (this.props.player_index === 2) {
      new_index = 0;
    } else {
      new_index = this.props.player_index + 1;
    }

    // if (this.state.question_index === this.state.question.length - 1) {
    //   // insert stuff in here next time!
    // }

    this.getSessionDatabaseRef().update({
      user_id: this.getMyUserId(),
      response: document.getElementById("response").value,
      player_index: new_index
    });
    console.log("handle submit button index after " + this.props.player_index);
  }

  render() {
    const { selectedItem } = this.state;
    const { items } = this.props;

    const wheelVars = {
      "--nb-item": items.length,
      "--selected-item": selectedItem
    };
    const spinning = selectedItem !== null ? "spinning" : "";

    if (this.props.show_text_box) {
      var input_text_box = <input type="text" id="response" />;
      var submit_button = (
        <button onClick={() => this.handleSubmitButton()}> Submit </button>
      );
    }

    return (
      <div className="wheel-container">
        <div
          className={`wheel ${spinning}`}
          style={wheelVars}
          onClick={this.selectItem}
        >
          {items.map((item, index) => (
            <div
              className="wheel-item"
              key={index}
              style={{ "--item-nb": index }}
            >
              {item.question}
            </div>
          ))}
        </div>
        <br />
        {input_text_box}
        {submit_button}
      </div>
    );
  }
}
