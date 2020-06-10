import shotCollide from "./shotHit.jsx";

function handleShots(shots, enemies) {
  for (let i = 0; i < shots.length; i++) {
    let shot = shots[i];
    if (shot.top <= 0 || shotCollide(shot, enemies)) {
      shots.splice(i, 1);
    } else {
      let newTop = shot.top - 10;
      shots[i].top = newTop;
    }
  }
  return shots;
}

export default handleShots;
