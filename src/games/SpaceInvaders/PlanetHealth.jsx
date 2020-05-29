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
