function enemyCollide(enemy, shots) {
  for (let i = 0; i < shots.length; i++) {
    let shot = shots[i];
    let xRange = enemy.left;
    let yRange = enemy.top;
    let width = 20;
    console.log(shot.top, yRange, shot.top >= yRange);
    if (shot.top <= yRange + width && shot.top >= yRange) {
      console.log("y hit");
      if (shot.left >= xRange && shot.left <= xRange + width) {
        console.log("hittttt");
        return true;
      }
    }
  }
}

export default enemyCollide;
