import ChatRoom from "./games/chatroom/ChatRoom.js";
import CookieClicker from "./games/cookieClicker/CookieClicker.js";
import DuckHunt from './games/duckHunt/DuckHunt';
import GoogleGossip from "./games/googlegossip/GoogleGossip.js";
import Mafia from "./games/mafia/Mafia.js";
import Memory from "./games/memory/memory.js";
import Multiplication from "./games/multiplication/Multiplication.js";
import Pokemon from "./games/pokemon/Pokemon.js";
import Pong from "./games/pong/Pong.js";
import RockPaperScissors from "./games/rps/RockPaperScissors.js";
import SpaceInvaders from "./games/SpaceInvaders/SpaceInvaders.jsx";
import Spark from "./games/spark/Spark.js";
import StrengthTester from "./games/StrengthTester/StrengthTester.js";
import TicTacToe from "./games/tictactoe/TicTacToe.js";
import TugOfWar from "./games/TugOfWar/TugOfWar.js";
import TwentyOneQuestions from "./games/twentyOneQuestions/TwentyOneQuestions.js";
import Unscrambled from "./games/unscrambled/HomePage.js";
import WeWatch from "./games/wewatch/WeWatch.js";
import WheelofFortune from "./games/wheeloffortune/WheelofFortune.js";
import burst_Forth from "./games/Burst_Forth/burstForth.js";
import fight from "./games/fight/fight.js";
import pictionary from './games/pictionary/Pictionary.js';
import uno from './games/uno/uno.js';

const gameData = {
  chatroom: {
    title: "Chat Room",
    authors: "Joe Tessler",
    description: "A place to chat with a group of friends",
    minUsers: 1,
    maxUsers: 10,
    component: ChatRoom
  },

  tictactoe: {
    title: "Tic Tac Toe",
    authors: "Joe Tessler",
    description: "The classic two-player game with Xs and Os",
    minUsers: 2,
    maxUsers: 2,
    component: TicTacToe
  },

  rockpaperscissors: {
    title: "Rock Paper Scissors",
    authors: "Devraj Mehta",
    description: "Class 2-player rock paper scissors",
    minUsers: 2,
    maxUsers: 2,
    component: RockPaperScissors
  },

  multiplication: {
    title: "Multiplication",
    authors: "Edwin Fuquen",
    description: "A multiplication speed game",
    minUsers: 2,
    maxUsers: 2,
    component: Multiplication
  },

  pong: {
    title: "Pong",
    authors: "Devraj Mehta",
    description: "Classic Pong",
    minUsers: 1,
    maxUsers: 2,
    component: Pong
  },

  pokemon: {
    title: "Pokemon Simulator",
    authors: "Imani Greenidge and Raishan Bernard",
    description: "Turn Based Pokemon Battle",
    minUsers: 1,
    maxUsers: 2,
    component: Pokemon
  },

  questions: {
    title: "21 Questions",
    authors: "Jordan K., Prieya N.",
    description: "21 questions between 2 players",
    minUsers: 1,
    maxUsers: 2,
    component: TwentyOneQuestions
  },

  photosharing: {
    title: "Spark",
    authors: "Ramata Williams and Andrea Cajamarca",
    description: "Ripping off Twitter, Instagram, AND Tumblr.",
    minUsers: 2,
    maxUserss: 5,
    component: Spark
  },

  uno: {
    title: "I Declare War",
    authors: "Nia Davis, Jackie He, Lisandro Mayancela, Steven Rosario",
    description: "The classic UNO game",
    minUsers: 2,
    maxUsers: 2,
    component: uno
  },

  mafia: {
    title: "Mafia",
    authors: "Caelan Springer, Daniel Lin, Daniel Zamilatskiy",
    description:
      "Your greatest friends can be your greatest enemy. Trust no one but yourself.",
    minUsers: 1,
    maxUsers: 20,
    component: Mafia
  },

  cookieClicker: {
    title: "Cookie Clicker",
    authors: "Mahfuz,",
    description: "click the cookie fast as possible",
    minUsers: 2,
    maxUsers: 2,
    component: CookieClicker
  },

  fight: {
    title: "fight",
    authors: "Linhong Zhou, Jennifer P",
    description: "FIGHT!",
    minUsers: 2,
    maxUsers: 2,
    component: fight
  },

  Burst_Forth: {
    title: "Burst Forth",
    authors: "Jason Alvarez, William Collazo, Usman",
    description: "oof",
    minUsers: 2,
    maxUsers: 2,
    component: burst_Forth
  },

  TugOfWar: {
    title: "Tug Of War",
    authors: "Joel Veras",
    description: "Pull the rope and win ",
    minUsers: 2,
    maxUsers: 2,
    component: TugOfWar
  },

  googlegossip: {
    title: "Google Gossip",
    authors: "Zaara Afida, Jermain Lewis, Daril Alanis",
    description:
      "We are here to spill teas and destroy lives while exposing fake people around us.",
    minUsers: 1,
    maxUsers: 10,
    component: GoogleGossip
  },

  pictionary: {
    title: "Pictionary",
    authors: "Emily, Michael, and Mike",
    description: "a pictionary-style canvas game",
    minUsers: 2,
    maxUsers: 2,
    component: pictionary
  },

  wewatch: {
    title: "WeWatch",
    authors: "Sammy, Daniel, Cydney, Rahmel",
    description: "Watch YouTube videos with friends!",
    minUsers: 1,
    maxUsers: 8,
    component: WeWatch
  },

  wheeloffortune: {
    title: "Wheel of Fortune",
    authors: "Nathan A., Shandon M., Damon N., Neera T.",
    description: "Spin the wheel, answer your riddle, and get your points.",
    minUsers: 2,
    maxUsers: 3,
    component: WheelofFortune
  },

  memory: {
    title: "Memory",
    authors: "Danielle Ong",
    description:
      "The ultimate game to test your memory with amazing pictures and other people",
    minUsers: 1,
    maxUsers: 2,
    component: Memory
  },

  strengthtester: {
    title: "StrengthTester",
    authors: "Olivia, Keanneyi, Wendy",
    description: "Two player tug of war game",
    minUsers: 2,
    maxUsers: 2,
    component: StrengthTester
  },

  unscrambled: {
    title: "Unscrambled",
    authors: "Kayla Campbell, Cindi Morales, Shania",
    description: "Guess the scrambled word",
    minUsers: 1,
    maxUsers: 10,
    component: Unscrambled
  },

  SpaceInvaders: {
    title: "Space Invaders",
    authors: "Jason Alvarez, Patrick Cooney, David ",
    description:
      "Are you going to let Aliens invade your perfect dictatorship? Of course not! Defend your glorious planet.",
    minUsers: 1,
    maxUsers: 10,
    component: SpaceInvaders
  },

  duckHunt: {
    title: "Duck Hunt",
    authors: "Kevin",
    description: "Destroying ducks",
    minUsers: 1,
    maxUsers: 1,
    component: DuckHunt,
  },
};

export default gameData;
