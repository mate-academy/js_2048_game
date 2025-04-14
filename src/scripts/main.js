'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const KEY_UP = 'ArrowUp';
const KEY_RIGHT = 'ArrowRight';
const KEY_DOWN = 'ArrowDown';
const KEY_LEFT = 'ArrowLeft';

function refreshTable(state) {
  const fieldRows = document.querySelectorAll('.field-row');

  for (let row = 0; row < state.length; row++) {
    for (let column = 0; column < state[row].length; column++) {
      const fieldCell = fieldRows[row].children[column];
      const stateCell = state[row][column];

      fieldCell.className = 'field-cell field-cell--' + stateCell;

      if (stateCell > 0) {
        fieldCell.innerText = stateCell;
      } else {
        fieldCell.innerText = '';
      }
    }
  }
}

function refreshScore(score) {
  document.querySelector('.game-score').innerText = score;
}

function refreshButton(firstMoveMade) {
  if (firstMoveMade) {
    button.className = 'button restart';
    button.innerText = 'Restart';
  } else {
    button.className = 'button start';
    button.innerText = 'Start';
  }
}

function refreshMessage(gameStatus) {
  const messages = document.querySelectorAll('.message');

  messages.forEach((message) => message.classList.add('hidden'));

  switch (gameStatus) {
    case 'idle':
      document.querySelector('.message-start').classList.remove('hidden');
      break;
    case 'win':
      document.querySelector('.message-win').classList.remove('hidden');
      break;
    case 'lose':
      document.querySelector('.message-lose').classList.remove('hidden');
      break;
  }
}

function refresh() {
  refreshTable(game.getState());
  refreshScore(game.getScore());
  refreshButton(game.getFirstMoveMade());
  refreshMessage(game.getStatus());
}

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  switch (button.innerText) {
    case 'Start':
      game.start();
      break;
    case 'Restart':
      game.restart();
  }

  refresh();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case KEY_UP:
      e.preventDefault();
      game.moveUp();
      break;
    case KEY_RIGHT:
      e.preventDefault();
      game.moveRight();
      break;
    case KEY_DOWN:
      e.preventDefault();
      game.moveDown();
      break;
    case KEY_LEFT:
      e.preventDefault();
      game.moveLeft();
      break;
  }

  refresh();
});
