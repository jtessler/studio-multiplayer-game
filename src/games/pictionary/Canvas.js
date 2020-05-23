import React, { Component } from "react";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      prevX: 0,
      currX: 0,
      prevY: 0,
      currY: 0,
      fillStyle: "black",
      lineWidth: 2,
      dot_flag: false,
    };
    this.init = this.init.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);
    this.findxy = this.findxy.bind(this);
    this.draw = this.draw.bind(this);
    this.clear = this.clear.bind(this);
  }
  componentDidMount() {
    this.init();
  }
  addEventListeners() {
    this.canvas.addEventListener(
      "mousemove",
      (e) => {
        this.findxy("move", e);
      },
      false
    );
    this.canvas.addEventListener(
      "mousedown",
      (e) => {
        this.findxy("down", e);
      },
      false
    );
    this.canvas.addEventListener(
      "mouseup",
      (e) => {
        this.findxy("up", e);
      },
      false
    );
    this.canvas.addEventListener(
      "mouseout",
      (e) => {
        this.findxy("out", e);
      },
      false
    );
  }
  init() {
    this.canvas = document.getElementById("can");
    this.ctx = this.canvas.getContext("2d");
    this.w = this.canvas.width;
    this.h = this.canvas.height;
    this.addEventListeners();
  }
  findxy(res, e) {
    if (res === "down") {
      this.setState(
        {
          prevX: this.state.currX,
          prevY: this.state.currY,
          currX: e.clientX - this.canvas.offsetLeft,
          currY: e.clientY - this.canvas.offsetTop,
          flag: true,
          dot_flag: true,
        },
        () => {
          if (this.props.animal === "" || this.props.phase !== "drawing") {
            return;
          }
          this.ctx.beginPath();
          this.ctx.fillStyle = this.state.fillStyle;
          this.ctx.fillRect(this.state.currX, this.state.currY, 2, 2);
          this.ctx.closePath();
          this.setState({
            dot_flag: false,
          });
        }
      );
    }
    if (res === "up" || res === "out") {
      this.setState({
        flag: false,
      });
    }
    if (res === "move") {
      if (this.state.flag) {
        this.setState(
          {
            prevX: this.state.currX,
            prevY: this.state.currY,
            currX: e.clientX - this.canvas.offsetLeft,
            currY: e.clientY - this.canvas.offsetTop,
          },
          () => {
            this.draw();
          }
        );
      }
    }
  }
  draw() {
    if (this.props.phase === "guessing") {
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.prevX, this.state.prevY);
    this.ctx.lineTo(this.state.currX, this.state.currY);
    this.ctx.strokeStyle = this.state.fillStyle;
    this.ctx.lineWidth = this.state.lineWidth;
    this.ctx.stroke();
    this.ctx.closePath();
    if (this.props.animal === "") {
      this.clear();
    }
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    return <canvas id="can" width="400" height="400"></canvas>;
  }
}

export default Canvas;
