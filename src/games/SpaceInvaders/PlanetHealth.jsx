import React from "react";
import Enemy from "./Enemy";
import shotCollide from "./shotCollide";
var startHealth = 100;
var currentHealth = startHealth;
var EnemyPos = $("Enemy").offset().top;

function damage(D) {
  currentHealth = startHealth - D;
  console.log(currentHealth);
}
function hitz() {
  if (EnemyPos === 440) {
    damage(100);
  } else if (shotCollide === true) {
    damage(10);
  }
}
function healthDisplay() {
  return <text> "Life Remaining:" + currentHealth.val() + "%"</text>;
}
function gameOver() {
  return <text> "Game Over, Your planet was destroyed"+ score</text>;
}
function destroyPlanetz() {
  if (currentHealth > 10) {
    healthDisplay();
  } else {
    gameOver();
  }
}
hitz();
healthDisplay();
destroyPlanetz();
//----------------Test2UwU-----------// (Totally Not Adapted From Something Else)

class PlanetHealthBar extends React.Component {
  constructor() {
    super();
    // debugger;
    this.state = {
      Overall: 2000,
      DamageTaken: 1677,
      DamageOccuring: 197
    };

    this.setPlanetHealth = this.setPlanetHealth.bind(this);
  }

  setPlanetHealth(amount) {
    this.setState({ DamageTaken: amount });
  }

  render() {
    let bal =
      this.state.Overall - this.state.DamageTaken;
    let DamageTakenPercent =
      (this.state.DamageTaken / this.state.Overall) * 100;
    let balPercent = 100 - DamageTakenPercent
    const hit = () => {
      if (EnemyPos === 440) {
        //Add 100% to damageTaken;
      } else if (shotCollide === true) {
        //Add 10% to  DamageTaken
      }
    const destroyPlanet = () => {
      if (currentHealth > 10) {
         return (
      <div>
        <div className="PlanetHealthBar">
          <div
            className="balanceSection DamageTaken"
            style={{ width: DamageTakenPercent + "%" }}
          />
          <div
            id="left"
            className="balanceSection left"
            style={{ width: balPercent + "%" }}
          >
            <p>${bal} left</p>
          </div>
        </div>
      </div>
    );
      } else {
        return( <text> "Game Over, Your planet was destroyed"+ score</text>
        );

    }

   
  }
}

React.render(<PlanetHealthBar />, document.body);
