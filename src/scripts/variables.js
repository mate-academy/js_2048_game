'use strict';

// Base settings:
const totalCountOfCells = 16;
const winCondition = '2048';
const values = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
const moveCellColor = '#ead6a6';

// Fields and buttons:
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const allCells = gameField.querySelectorAll('.field-cell');
const highestScore = document.querySelector('.highest-score');
const startBtn = document.querySelector('.button');

// Messages:
const messageBeforeStart = document.querySelector('.message-start');
const messageDuringTheGame = document.querySelector('.message-play');
const messageAfterLose = document.querySelector('.message-lose');
const messageAfterWin = document.querySelector('.message-win');

module.exports = {
  totalCountOfCells,
  winCondition,
  gameScore,
  gameField,
  allCells,
  highestScore,
  values,
  startBtn,
  messageBeforeStart,
  messageDuringTheGame,
  messageAfterLose,
  messageAfterWin,
  moveCellColor,
};
