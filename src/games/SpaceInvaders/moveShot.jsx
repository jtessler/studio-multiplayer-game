import shotCollide from "./shotHit.jsx";

function handleShots(shots, enemies) {
  for (let i = 0; i < shots.length; i++) {
    let shot = shots[i];
    if (shot.top <= 0 || shotCollide(shot, enemies)) {
      //doesn't get rid of the last one for some reason
      shots.splice(i, 1);

      //temporary fix
      // shots.push({ top: 500, left: shot.left });
    } else {
      let newTop = shot.top - 10;
      shots[i].top = newTop;
    }
    // if (i === shots.length - 1) {
    //   //might not be in the right format
    //   console.log(newShots, "new Shots");
    //   return newShots;
    // }
  }
  return shots;
  // shots;
  //is there a way to pop an item out of a map
  // return shots.map(shot => {
  //   console.log(shot.top, shot.left);
  //   let newTop = shot.top;
  //   if (shot.top - 10 <= 0) {
  //     // destroy this shot
  //     // break;
  //   } else {
  //     newTop -= 10;
  //   }

  //   return { top: newTop, left: shot.left };
  // });
}

export default handleShots;
