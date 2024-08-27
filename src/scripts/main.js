'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const elements = {
  button: document.querySelector('.button'),
  messageStart: document.querySelector('.message-start'),
  messageLose: document.querySelector('.message-lose'),
  messageWin: document.querySelector('.message-win'),
  gameScore: document.querySelector('.game-score'),
  gameField: document.querySelector('.game-field'),
};

function updateBoard() {
  elements.gameField.innerHTML = '';

  game.getState().forEach((row) => {
    const rowElement = document.createElement('tr');

    rowElement.classList.add('field-row');

    row.forEach((cell) => {
      const cellElement = document.createElement('td');

      cellElement.classList.add('field-cell');

      if (cell > 0) {
        cellElement.classList.add(`field-cell--${cell}`);
      }
      cellElement.textContent = cell !== 0 ? cell : '';
      rowElement.appendChild(cellElement);
    });

    elements.gameField.appendChild(rowElement);
  });
}

function updateScore() {
  elements.gameScore.textContent = game.getScore();
}

function updateStatus() {
  if (game.getStatus() === Game.statuses.win) {
    elements.messageWin.classList.remove('hidden');
  } else if (game.getStatus() === Game.statuses.lose) {
    elements.messageLose.classList.remove('hidden');
  }
}

function handleButtonClick() {
  if (elements.button.classList.contains('start')) {
    game.start();
    elements.button.classList.replace('start', 'restart');
    elements.button.textContent = 'Restart';
    elements.messageStart.classList.add('hidden');
  } else {
    game.restart();
    elements.button.classList.replace('restart', 'start');
    elements.button.textContent = 'Start';
    elements.messageLose.classList.add('hidden');
  }

  updateBoard();
  updateScore();
}

function handleKeydown(e) {
  e.preventDefault();

  const moves = {
    ArrowUp: game.moveUp.bind(game),
    ArrowDown: game.moveDown.bind(game),
    ArrowRight: game.moveRight.bind(game),
    ArrowLeft: game.moveLeft.bind(game),
  };

  if (moves[e.key]) {
    moves[e.key]();
    updateScore();
    updateBoard();
    updateStatus();
  }
}

elements.button.addEventListener('click', handleButtonClick);
document.addEventListener('keydown', handleKeydown);
