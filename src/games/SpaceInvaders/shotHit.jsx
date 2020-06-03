function shotCollide(shot, enemies) {
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    let xRange = enemy.left;
    let yRange = enemy.top;
    let width = 20;
    // console.log(shot.top, yRange, shot.top >= yRange);
    if (shot.top <= yRange + width && shot.top >= yRange) {
      if (shot.left >= xRange && shot.left <= xRange + width) {
        return true;
      }
    }
  }
}

export default shotCollide;
