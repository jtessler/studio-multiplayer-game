import React from "react";
import "./Pictionary.css";
import Canvas from "./Canvas";
import Drawing from "./Drawing";
import Guessing from "./Guessing";
import Scoreboard from "./Scoreboard";

function PictionaryBoard(props) {

  return (
    <div className="pictionary-board">
      <h1>Code Nation Presents: Pictionary</h1>
      {props.phase === "drawing" && props.drawingPlayer === props.myId && (
        <Drawing updateFirebase={props.updateFirebase} animal={props.animal} />
      )}
      <Canvas
        animal={props.animal}
        globalCanvasBlob={props.globalCanvasBlob}
        drawingPlayer={props.drawingPlayer}
        myId={props.myId}
        phase={props.phase}
        round={props.round}
        sendBlobToFirebase={props.sendBlobToFirebase}
        updateFirebase={props.updateFirebase}
        clearCanvas={props.clearCanvas}
      />
      {props.phase === "guessing" && props.drawingPlayer !== props.myId && (
        <Guessing
          animal={props.animal}
          score={props.score}
          updateFirebase={props.updateFirebase}
          setScore={props.setScore}
          getNextDrawingPlayer={props.getNextDrawingPlayer}
          round={props.round}
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

export default PictionaryBoard;
