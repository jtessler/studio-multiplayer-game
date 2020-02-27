import { playerAction, playerLocation } from "./fight.js";
import { character } from "./character.js";

export default function sketchFactory(
  updateFirebase,
  data,
  getMyUser,
  thisCharacter
) {
  return function sketch(p) {
    var p1;
    var p2;
    var magicianPic = {
      normal: "",
      mirrored: ""
    };
    var MagicBall = [];
    var frameRate = 60;
    var gameOver = false;

    p.preload = () => {
      magicianPic.normal = p.loadImage(
        "/games/fight/whole.jpg"
      );
      magicianPic.mirrored = p.loadImage(
        "/games/fight/whole-mirror.jpg"
      );
    };

    p.setup = () => {
      p.createCanvas(1080, 720);
      p.noStroke();
      p.frameRate(frameRate);
      p.setupPlayerLocation();
      if (data().p1.characterType === "magician") {
        p1 = new p.Magician(
          data().p1.playerLocation.x,
          data().p1.playerLocation.y
        );
      } else if (data().p1.characterType === "warrior") {
        p1 = new p.Warrior(
          data().p1.playerLocation.x,
          data().p1.playerLocation.y
        );
      }
      if (data().p2.characterType === "magician") {
        p2 = new p.Magician(
          data().p2.playerLocation.x,
          data().p2.playerLocation.y
        );
      } else if (data().p2.characterType === "warrior") {
        p1 = new p.Warrior(
          data().p2.playerLocation.x,
          data().p2.playerLocation.y
        );
      }
      console.log();
    };

    p.draw = () => {
      p.background(0);
      p.checkingAction();
      p1.x = data().p1.playerLocation.x;
      p1.facing = data().p1.playerAction.facing;
      p1.display();
      p2.x = data().p2.playerLocation.x;
      p2.facing = data().p2.playerAction.facing;
      p2.display();
      p.keyPressed();
      p.displayMagicBall();
      p.displayHealth();
      p.gameOver();
    };

    p.setupPlayerLocation = () => {
      if (getMyUser() === "player 1") {
        console.log(getMyUser());
        playerLocation.x = data().p1.playerLocation.x;
        playerLocation.y = data().p1.playerLocation.y;
      }
      if (getMyUser() === "player 2") {
        console.log(getMyUser());
        playerLocation.x = data().p2.playerLocation.x;
        playerLocation.y = data().p2.playerLocation.y;
      }
      console.log(playerLocation);
    };

    p.Magician = function(x, y) {
      this.x = x;
      this.y = y;
      this.hp = character.magician.hp;
      this.full_hp = character.magician.hp;
      this.attack_damage = character.magician.attack_damage;
      this.defense = character.magician.defense;
      this.speed = character.magician.speed;
      this.basic_attack_disabled = false;
      this.facing = "right";
      this.disabled_timer = {
        basic_attack: frameRate
      };

      this.update = function() {
        if (this.disabled_timer.basic_attack) {
          console.log("Basic Attack Is Disabled");
        }
      };

      this.display = function() {
        //character
        // p.fill(255);
        // p.rect(this.x, this.y, 70, 200);
        if (this.facing === "left") {
          p.image(magicianPic.mirrored, this.x, this.y, 200, 200);
        } else {
          p.image(magicianPic.normal, this.x, this.y, 200, 200);
        }
      };

      this.action = function(enemy, action, facing) {
        this.enemy = enemy;
        if (action === "basic_attack") {
          if (!this.basic_attack_disabled) {
            console.log("basic attcak!");
            MagicBall.push(
              new p.MagicBall(
                this.enemy,
                this.x,
                this.y,
                facing,
                this.attack_damage
              )
            );
            console.log(this.enemy, this.x, this.y, facing);
          }
        }
      };

      this.damaged = function(damage) {
        if (this.hp > 0) {
          this.hp -= damage - damage * this.defense;
        }
        if (this.hp <= 0) {
          this.hp = 0;
          this.dies();
        }
      };

      this.dies = function() {
        gameOver = true;
      };
    };

    p.MagicBall = function(enemy, x, y, facing, damage) {
      this.x = x;
      this.y = y + (720 - y) / 2;
      this.radius = 80;
      this.disappear_after = frameRate * 1.5;
      this.speed = 20;
      this.enemy = enemy;

      console.log(this.enemy);
      this.display = function() {
        this.update();
        p.fill(153, 102, 255);
        p.arc(this.x, this.y, this.radius, this.radius, 0, Math.PI * 2);
      };

      this.update = function() {
        if (facing === "right") {
          this.x += this.speed;
        }
        if (facing === "left") {
          this.x -= this.speed;
        }
        this.disappear_after--;
        this.collision();
      };

      this.collision = function() {
        if (
          this.x + this.radius >= this.enemy.x &&
          this.x - this.radius <= this.enemy.x
        ) {
          console.log("hits enemy");
          enemy.damaged(damage);
          this.disappear_after = 0;
        }
      };
    };

    p.displayMagicBall = function() {
      for (var i = 0; i < MagicBall.length; i++) {
        MagicBall[i].display();
        if (MagicBall[i].disappear_after <= 1) {
          MagicBall.splice(i, 1);
          console.log(MagicBall);
        }
      }
    };

    p.keyPressed = function() {
      playerAction.basic_attack = false;
      playerAction.ability_1 = false;
      playerAction.ability_2 = false;
      playerAction.ability_3 = false;

      if (p.keyIsDown(65)) {
        if (playerLocation.x > 0) {
          playerLocation.x -= thisCharacter().speed;
          playerAction.facing = "left";
        }
        console.log(data().p1.playerLocation.x, data().p1.playerAction.facing);
      }
      if (p.keyIsDown(68)) {
        if (playerLocation.x < 1080) {
          playerLocation.x += thisCharacter().speed;
          playerAction.facing = "right";
        }
        console.log(data().p1.playerLocation.x, data().p1.playerAction.facing);
      }
      if (p.keyIsDown(75)) {
        playerLocation.y -= 10;
      }
      if (p.keyIsDown(74)) {
        playerAction.basic_attack = true;
      }
      if (p.keyIsDown(85)) {
        playerAction.ability_1 = true;
      }
      updateFirebase();
    };

    p.checkingAction = function() {
      if (data().p1.playerAction.basic_attack === true) {
        p1.action(p2, "basic_attack", data().p1.playerAction.facing);
      }

      if (data().p2.playerAction.basic_attack === true) {
        p2.action(p1, "basic_attack", data().p2.playerAction.facing);
      }
    };

    p.checkLocation = function() {
      console.log(data().p1.playerLocation.x);
    };

    p.displayHealth = function() {
      var health_bar = {
        p1: {
          xPos: 10,
          yPos: 10,
          width: 400,
          height: 100
        },
        p2: {
          xPos: 670,
          yPos: 10,
          width: 400,
          height: 100
        }
      };
      // p1 Health Bar Background
      p.stroke(255);
      p.fill(50);
      p.rect(
        health_bar.p1.xPos,
        health_bar.p1.yPos,
        health_bar.p1.width,
        health_bar.p1.height
      );
      // p1 Health Bar
      p.noStroke();
      p.fill(102, 255, 102);
      p.rect(
        health_bar.p1.xPos,
        health_bar.p1.yPos,
        health_bar.p1.width * (p1.hp / p1.full_hp),
        health_bar.p1.height
      );
      // p1 Health Bar Text
      p.noStroke();
      p.textSize(80);
      p.fill(0);
      p.text(
        p1.hp + " / " + p1.full_hp,
        health_bar.p1.xPos,
        health_bar.p1.yPos + health_bar.p1.height - 10
      );

      // p2 Health Bar Background
      p.stroke(255);
      p.fill(50);
      p.rect(
        health_bar.p2.xPos,
        health_bar.p2.yPos,
        health_bar.p2.width,
        health_bar.p2.height
      );
      // p2 Health Bar
      p.noStroke();
      p.fill(102, 255, 102);
      p.rect(
        health_bar.p2.xPos,
        health_bar.p2.yPos,
        health_bar.p2.width * (p2.hp / p2.full_hp),
        health_bar.p2.height
      );
      // p1 Health Bar Text
      p.noStroke();
      p.textSize(80);
      p.fill(0);
      p.text(
        p2.hp + " / " + p2.full_hp,
        health_bar.p2.xPos,
        health_bar.p2.yPos + health_bar.p2.height - 10
      );
    };

    p.gameOver = function() {
      if (gameOver) {
        p.background(0);
        p.fill(255);
        p.textSize(80);
        if (p1.hp > p2.hp) {
          p.text("Player 1 has won the game!", 20, 400);
        }
        if (p2.hp > p1.hp) {
          p.text("Player 2 has won the game!", 20, 400);
        }
        if (p1.hp === p2.hp) {
          p.text("Tie!", 20, 400);
        }
      }
    };
  };
}
