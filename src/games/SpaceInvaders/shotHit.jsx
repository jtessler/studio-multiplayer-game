function shotCollide(shot, enemies) {
  //get this to work
  console.log("hello world");
  for (let i = 0; i < enemies.length; i++) {
    // console.log("hello world");
    let enemy = enemies[i];
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
    // if (shot.top >= yRange) {
    //   console.log("yhit");
    // }
    // if (enemy.top >= shot.top + 20 && enemy.top + 20 <= shot.top) {
    //   if (enemy.left >= shot.left + 20 && enemy.left + 20 <= shot.top) {
    //     console.log("hhhhhhhhhhhhiiiiiiiiiittttttttttt");
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
  }
}

export default shotCollide;
