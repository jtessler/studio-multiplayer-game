import shotCollide from "./shotHit.jsx";

function handleEnemyShots(player, shots) {
  let playerPosition = [player];
  for (let i = 0; i < shots.length; i++) {
    let shot = shots[i];
    if (shot.top >= 500 || shotCollide(shot, playerPosition)) {
      shots.splice(i, 1);
    } else {
      let newTop = shot.top - 10;
      shots[i].top = newTop;
    }
  }
  return shots;
}

export default handleEnemyShots;
