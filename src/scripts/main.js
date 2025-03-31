'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

// eslint-disable-next-line no-unused-vars
const state = [
  [2, 8, 32, 2],
  [2, 16, 32, 2],
  [2, 8, 4, 2],
  [4, 2, 8, 2],
];

// eslint-disable-next-line no-unused-vars
const game = new Game(null, {
  gameField: document.querySelector('.game-field tbody'),
  startButton: document.querySelector('button.start'),
  gameScore: document.querySelector('.game-score'),
  messageLose: document.querySelector('.message-lose'),
  messageWin: document.querySelector('.message-win'),
  messageStart: document.querySelector('.message-start'),
});
