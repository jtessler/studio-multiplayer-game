function movePlayer(player, e) {
  //change to use constants when refering to player width and height
  // console.log(top, left, e);
  let newTop = player.top;
  let newLeft = player.left;

  if ((e.key === "d" || e.key === "ArrowRight") && newLeft + 20 + 10 <= 500) {
    newLeft += 10;
  } else if (
    (e.key === "d" || e.key === "ArrowRight") &&
    newLeft + 20 + 10 >= 500
  ) {
    newLeft = 0;
  }
  if ((e.key === "a" || e.key === "ArrowLeft") && newLeft - 10 >= 0) {
    newLeft -= 10;
  } else if ((e.key === "a" || e.key === "ArrowLeft") && newLeft - 10 <= 0) {
    newLeft = 480;
  }
  // should be 0 instead of -40 if we adjust the board a little bit
  if ((e.key === "w" || e.key === "ArrowUp") && newTop - 10 >= 300) {
    newTop -= 10;
  }
  // should be 500 instead of 460 if we adjust the board a little bit
  if ((e.key === "s" || e.key === "ArrowDown") && newTop + 20 + 10 <= 500) {
    newTop += 10;
  }

  // console.log({ top: newTop, left: newLeft });
  return { ...player, top: newTop, left: newLeft };
  // if (e.keyCode === 32) {
  //   this.shoot();
  //   //add a shot component to firebase and render
  // }
}

export default movePlayer;
