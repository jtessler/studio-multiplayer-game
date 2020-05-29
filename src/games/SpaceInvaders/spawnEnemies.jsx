function spawnEnemy(num) {
  //get this to work
  let enemies = [];
  let newTop = 0;
  let newLeft = 0;
  for (let i = 0; i < num; i++) {
    let enemy = { top: newTop, left: newLeft, direction: 1, health: 1 };
    enemies.push(enemy);
    if (newLeft + 30 <= 500) {
      newLeft += 30;
    } else {
      newLeft = 0;
      newTop += 30;
    }
  }
  console.log(enemies, "enmies in spwan enemies");
  return enemies;
}

export default spawnEnemy;
