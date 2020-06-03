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
function hit() {
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
function destroyPlanet() {
  if (currentHealth > 10) {
    healthDisplay();
  } else {
    gameOver();
  }
}
hit();
healthDisplay();
destroyPlanet();
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
      this.state.Overall - this.state.DamageTaken - this.state.DamageOccuring;
    let DamageTakenPercent =
      (this.state.DamageTaken / this.state.Overall) * 100;
    let DamageOccuringPercent =
      (this.state.DamageOccuring / this.state.Overall) * 100;
    let balPercent = 100 - DamageTakenPercent - DamageOccuringPercent;

    return (
      <div>
        <div className="PlanetHealthBar">
          <div
            className="balanceSection DamageTaken"
            style={{ width: DamageTakenPercent + "%" }}
          />
          <div
            className="balanceSection DamageOccuring"
            style={{ width: DamageOccuringPercent + "%" }}
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
  }
}

React.render(<PlanetHealthBar />, document.body);
