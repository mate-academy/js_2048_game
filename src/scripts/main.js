'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

// Write your code here

const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const buttonStart = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const game = new Game(
  gameField,
  buttonStart,
  gameScore,
  messageLose,
  messageWin,
  messageStart,
);

buttonStart.addEventListener('click', () => {
  if (!game.playing) {
    game.start();
  } else {
    game.restart();
  }
});

game.makeMove();
