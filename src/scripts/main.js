'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const gameBoard = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');
const winMessage = document.querySelector('.message.message-win');
const loseMessage = document.querySelector('.message.message-lose');
const startMessage = document.querySelector('.message.message-start');

function updateUI() {
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }

  const gameState = game.getState();

  for (const row of gameState) {
    const tr = document.createElement('tr');

    tr.classList.add('field-row');

    for (const cell of row) {
      const td = document.createElement('td');

      td.classList.add('field-cell');

      if (cell !== 0) {
        td.textContent = cell;
        td.classList.add(`field-cell--${cell}`);
      }
      tr.appendChild(td);
    }
    gameBoard.appendChild(tr);

    score.textContent = game.getScore();
  }

  // check the game status(win,lose,playing)

  const gameStatus = game.getStatus();

  switch (gameStatus) {
    case 'playing':
      document.addEventListener('keydown', handleMove);
      startMessage.classList.add('hidden');
      break;
    case 'win':
      document.removeEventListener('keydown', handleMove);
      winMessage.classList.remove('hidden');
      break;
    case 'lose':
      document.removeEventListener('keydown', handleMove);
      loseMessage.classList.remove('hidden');
      break;
    case 'idle':
      document.removeEventListener('keydown', handleMove);
      startMessage.classList.remove('hidden');
      break;
  }
}

// END Update UI

// handle move
function handleMove(evnt) {
  switch (evnt.key) {
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
  }

  updateUI();
}

function startGame() {
  startButton.classList.add('hidden');
  startMessage.classList.add('hidden');
  restartButton.classList.remove('hidden');
  game.start();
  updateUI();
}

function restartGame() {
  restartButton.classList.add('hidden');
  startButton.classList.remove('hidden');
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  startMessage.classList.remove('hidden');
  game.restart();

  updateUI();
}

if (game.getStatus() === 'playing') {
  document.addEventListener('keydown', handleMove);
}
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

updateUI();
