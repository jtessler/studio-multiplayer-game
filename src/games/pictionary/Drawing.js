import React from "react";
import Button from "./Button";
import animals from "./animals.json";

function Drawing(props) {
    function selectAnimal() {
        let animalIndex = Math.ceil(Math.random() * animals.length);
        let newAnimal = animals[animalIndex];
        props.updateFirebase({
            animal: newAnimal
        });
    }

    function startGuessing() {
        props.updateFirebase({
            phase: "guessing"
        });
    }

    return (
        <div>
            <h1>{props.animal}</h1>
            <Button handleClick={selectAnimal} text="Choose an Animal" />
            <Button handleClick={startGuessing} text="Done drawing!" />
        </div>
    );
}

export default Drawing;
