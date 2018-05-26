import ChatRoom from './ChatRoom.js';
import TicTacToe from './TicTacToe.js';
import RockPaperScissors from './RockPaperScissors.js';
import Multiplication from './Multiplication.js';
import Pong from './Pong.js';
import Questions from './TwentyOneQuestions.js';
import Spark from './Spark.js';
import uno from './uno.js';

const gameData = {

  chatroom: {
    title: "Chat Room",
    authors: "Joe Tessler",
    description: "A place to chat with a group of friends",
    minUsers: 1,
    maxUsers: 10,
    component: ChatRoom,
  },

  tictactoe: {
    title: "Tic Tac Toe",
    authors: "Joe Tessler",
    description: "The classic two-player game with Xs and Os",
    minUsers: 2,
    maxUsers: 2,
    component: TicTacToe,
  },

  rockpaperscissors: {
    title: "Rock Paper Scissors",
    authors: "Devraj Mehta",
    description: "Class 2-player rock paper scissors",
    minUsers: 2,
    maxUsers: 2,
    component: RockPaperScissors,
  },
  
  multiplication: {
    title: "Multiplication",
    authors: "Edwin Fuquen",
    description: "A multiplication speed game",
    minUsers: 2,
    maxUsers: 2,
    component: Multiplication,
  },

  pong: {
    title: "Pong",
    authors: "Devraj Mehta",
    description: "Classic Pong",
    minUsers: 1,
    maxUsers: 2,
    component: Pong,
  },

  questions: {
    title: "21 Questions",
    authors: "Jordan K., Prieya N.",
    description: "21 questions between 2 players",
    minUsers: 1,
    maxUsers: 2,
    component: Questions,
  },

  photosharing: {
    title: "Spark",
    authors: "Ramata Williams and Andrea Cajamarca",
    description: "Ripping off Twitter, Instagram, AND Tumblr.",
    minUsers: 2,
    maxUserss: 5,
    component: Spark,
  },

  uno: {
    title: "I Declare War",
    authors: "Nia Davis, Jackie He, Lisandro Mayancela, Steven Rosario",
    description: "The classic UNO game",
    minUsers: 2,
    maxUsers: 2,
    component: uno,
  },
}

export default gameData;
