import shotCollide from "./shotHit.jsx";
import readOutLoud from "./sounds.jsx";

// function handleEnemies(shots, enemies) {
//   for (let i = 0; i < shots.length; i++) {
//     let shot = shots[i];
//     if (shot.top <= 0 || shotCollide(shot, enemies)) {
//       shots.splice(i, 1);
//     } else {
//       let newTop = shot.top - 10;
//       shots[i].top = newTop;
//     }
//   }
//   return shots;
// }

function handleEnemies(shots, enemies) {
  for (let x = 0; x < enemies.length; x++) {
    let enemy = [enemies[x]] || [];
    for (let i = 0; i < shots.length; i++) {
      let shot = shots[i];
      if (shotCollide(shot, enemy)) {
        enemies.splice(x, 1);
        readOutLoud("ow");
        // console.log(`"handle enemies(1): " + ${JSON.stringify(enemies)}`);
      }
    }
  }
  // console.log(`"handle enemies(2): " + ${JSON.stringify(enemies)}`);
  return enemies;
}

export default handleEnemies;
