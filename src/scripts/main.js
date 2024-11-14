'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

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

function updateMessage(gameStatus) {
  const messageClasses = {
    idle: 'message-start',
    win: 'message-win',
    lose: 'message-lose',
  };

  document.querySelectorAll('.message').forEach((message) => {
    message.classList.add('hidden');
  });

  const messageClass = messageClasses[gameStatus];

  if (messageClass) {
    document.querySelector(`.${messageClass}`).classList.remove('hidden');
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
