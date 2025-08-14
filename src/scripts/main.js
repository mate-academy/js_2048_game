'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

const gameScore = document.querySelector('.game-score');
const buttonStart = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function showMessage(message) {
  switch (message) {
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case `win`:
      messageWin.classList.remove('hidden');
      break;
    default:
  }
}

function updateScore(score) {
  gameScore.textContent = score;
}

function updateBoard(board) {
  const newBoard = board.flat();

  cells.forEach((cell, index) => {
    cell.textContent = newBoard[index] === 0 ? '' : newBoard[index];
    cell.className = `field-cell${newBoard[index] ? ' field-cell--' + newBoard[index] : ''}`;
  });
  updateScore(game.getScore());
}

buttonStart.addEventListener('click', (e) => {
  if (!game || game.getStatus() !== 'playing') {
    game.start();
    buttonStart.textContent = 'Restart';
  } else {
    game.restart();
    buttonStart.textContent = 'Start';
  }
  updateBoard(game.getState());
  updateScore(game.getScore());
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    // eslint-disable-next-line no-useless-return
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
  }

  updateBoard(game.getState());
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  showMessage(game.getStatus());
});
// Write your code here
