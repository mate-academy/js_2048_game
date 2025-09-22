'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

// Write your code here

const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const table = document.querySelector('.game-field');
const tableBody = document.createElement('tbody');

table.append(tableBody);

function drawBoard() {
  const tableBoard = document.querySelector('tbody');

  if (tableBoard.children.length === 4) {
    tableBoard.innerHTML = '';
  }

  for (let i = 0; i < game.getState().length; i++) {
    const row = document.createElement('tr');

    row.className = 'field-row';

    tableBoard.append(row);

    for (let j = 0; j < game.getState()[i].length; j++) {
      const cell = document.createElement('td');

      cell.className =
        game.getState()[i][j] > 0
          ? `field-cell field-cell--${game.getState()[i][j]}`
          : 'field-cell';

      cell.innerHTML =
        game.getState()[i][j] > 0 ? `${game.getState()[i][j]}` : '';

      row.append(cell);
    }
  }
}

let btn = 'start';

gameScore.textContent = game.getScore();

drawBoard();

startButton.addEventListener('click', () => {
  if (btn === 'start') {
    game.start();
    drawBoard();
    messageStart.classList.add('hidden');
    gameScore.textContent = game.getScore();
  }

  if (btn === 'restart') {
    game.restart();
    drawBoard();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
    gameScore.textContent = game.getScore();
  }
});

document.addEventListener('keydown', (e) => {
  const prevState = game.getState();

  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
    }

    if (JSON.stringify(prevState) !== JSON.stringify(game.getState())) {
      startButton.classList.replace('start', 'restart');
      startButton.textContent = 'Restart';
      drawBoard();
      gameScore.textContent = game.getScore();

      btn = 'restart';
    }
  }

  switch (game.getStatus()) {
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case 'win':
      messageWin.classList.remove('hidden');
      break;
  }
});
