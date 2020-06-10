import shotCollide from "./shotHit.jsx";
import readOutLoud from "./sounds.jsx";
import spawnEnemies from "./spawnEnemies.jsx";

function handleEnemies(shots, enemies, enemiesDeployed) {
  if (enemies.length === 0) {
    enemies = spawnEnemies(30);
    enemiesDeployed = enemiesDeployed + 30;
  } else {
    //returns the enemies that have not been hit
    for (let x = 0; x < enemies.length; x++) {
      let enemy = [enemies[x]] || [];
      for (let i = 0; i < shots.length; i++) {
        let shot = shots[i];
        if (shotCollide(shot, enemy)) {
          enemies.splice(x, 1);
          readOutLoud("ow");
        }
      }
    }
  }
  return { enemies, enemiesDeployed };
}

export default handleEnemies;
