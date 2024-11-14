'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

function updateTable(state) {
  const fieldRows = document.querySelectorAll('.field-row');

  fieldRows.forEach((rowElement, rowIndex) => {
    const rowState = state[rowIndex];

    rowState.forEach((cellState, columnIndex) => {
      const cellElement = rowElement.children[columnIndex];

      cellElement.className = `field-cell field-cell--${cellState}`;
      cellElement.innerText = cellState > 0 ? cellState : '';

      if (cellState > 0) {
        cellElement.classList.add('merge');

        setTimeout(() => cellElement.classList.remove('merge'), 600);
      }
    });
  });
}

function updateScore(score) {
  document.querySelector('.game-score').innerText = score;
}

function updateButton(firstMoveMade) {
  if (firstMoveMade) {
    button.className = 'button restart';
    button.innerText = 'Restart';
  } else {
    button.className = 'button start';
    button.innerText = 'Start';
  }
}

function updateMessage() {
  switch (game.getStatus()) {
    case Game.STATUS.idle:
      startMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      break;
    case Game.STATUS.playing:
      startMessage.classList.add('hidden');
      break;
    case Game.STATUS.win:
      winMessage.classList.remove('hidden');
      break;
    case Game.STATUS.lose:
      loseMessage.classList.remove('hidden');
      break;
    default:
      break;
  }
}

function update() {
  updateTable(game.getState());
  updateScore(game.getScore());
  updateButton(game.getFirstMoveMade());
  updateMessage(game.getStatus());
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

  update();
});

document.addEventListener('keydown', (e) => {
  const actions = {
    ArrowUp: () => game.moveUp(),
    ArrowRight: () => game.moveRight(),
    ArrowDown: () => game.moveDown(),
    ArrowLeft: () => game.moveLeft(),
  };

  const action = actions[e.key];

  if (action) {
    e.preventDefault();
    action();
  }

  update();
});
