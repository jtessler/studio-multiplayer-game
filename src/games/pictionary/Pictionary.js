import React, { useRef } from "react";
import "./Pictionary.css";
import Canvas from "./Canvas";
import Drawing from "./Drawing";
import Guessing from "./Guessing";
import Scoreboard from "./Scoreboard";

function Pictionary(props) {
  let refCanvas = useRef(null);

  return (
    <div className="pictionary-app">
      <h1>Code Nation Presents: Pictionary</h1>
      {props.phase === "drawing" && props.drawingPlayer === props.myId && (
        <Drawing
          updateFirebase={props.updateFirebase}
          animal={props.animal}
        />
      )}
      <Canvas
        ref={refCanvas}
        animal={props.animal}
        phase={props.phase}
        updateFirebase={props.updateFirebase}
      />
      {props.phase === "guessing" && props.drawingPlayer !== props.myId && (
        <Guessing
          animal={props.animal}
          refCanvas={refCanvas}
          score={props.score}
          setDrawingPlayer={props.setDrawingPlayer}
          updateFirebase={props.updateFirebase}
        />
      )}
      <Scoreboard
        score={props.score}
        round={props.round}
        drawingPlayer={props.drawingPlayer}
      />
    </div>
  );
}

export default Pictionary;
