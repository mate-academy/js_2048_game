'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Uncomment the next lines to use your game instance in the browser
// [
//   [2, 0, 2, 2],
//   [0, 2, 2, 2],
//   [2, 2, 0, 2],
//   [2, 2, 2, 0],
// ]

// Write your code here

const startButton = document.querySelector('.button', '.start');

function updateTable() {
  const gameState = game.getState();
  const table = document.querySelector('.game-field');
  const tbody = table.querySelector('tbody');

  tbody.innerHTML = '';

  for (let i = 0; i < gameState.length; i++) {
    const row = gameState[i];
    const tr = document.createElement('tr');

    tr.className = 'field-row';

    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      const td = document.createElement('td');

      td.textContent = cell !== 0 ? cell : '';

      td.className =
        cell !== 0 ? `field-cell field-cell--${cell}` : 'field-cell';
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function updateScore() {
  const gameScore = document.querySelector('.game-score');

  gameScore.innerText = game.getScore();
}

function handleMessages(action, type) {
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  if (action === 'hide') {
    switch (type) {
      case 'start':
        startMessage.classList.add('hidden');
        break;
      case 'win':
        winMessage.classList.add('hidden');
        break;
      case 'lose':
        loseMessage.classList.add('hidden');
        break;
      default:
        break;
    }
  }

  if (action === 'show') {
    switch (type) {
      case 'start':
        startMessage.classList.remove('hidden');
        break;
      case 'win':
        winMessage.classList.remove('hidden');
        break;
      case 'lose':
        loseMessage.classList.remove('hidden');
        break;
      default:
        break;
    }
  }
}

function handleGameStatus() {
  switch (game.getStatus()) {
    case 'win':
      handleMessages('show', 'win');
      break;
    case 'lose':
      handleMessages('show', 'lose');
      break;
    default:
      break;
  }
}

function updateGame() {
  updateTable();
  updateScore();
  handleGameStatus();
}

startButton.addEventListener('click', () => {
  switch (game.getStatus()) {
    case 'idle':
      game.start();
      updateTable();
      startButton.className = 'button restart';
      startButton.textContent = 'Restart';
      handleMessages('hide', 'start');
      updateScore();
      break;
    case 'playing':
      game.restart();
      updateTable();
      startButton.className = 'button start';
      startButton.textContent = 'Start';
      handleMessages('show', 'start');
      updateScore();
      break;
    case 'win':
      game.restart();
      updateTable();
      startButton.className = 'button start';
      startButton.textContent = 'Start';
      handleMessages('hide', 'win');
      handleMessages('show', 'start');
      updateScore();
      break;
    case 'lose':
      game.restart();
      updateTable();
      startButton.className = 'button start';
      startButton.textContent = 'Start';
      handleMessages('hide', 'lose');
      handleMessages('show', 'start');
      updateScore();
      break;
    default:
      break;
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      updateGame();
      break;
    case 'ArrowRight':
      game.moveRight();
      updateGame();
      break;
    case 'ArrowUp':
      game.moveUp();
      updateGame();
      break;
    case 'ArrowDown':
      game.moveDown();
      updateGame();
      break;
    default:
      break;
  }
});
