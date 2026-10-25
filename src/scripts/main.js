'use strict';

const Game = require('../modules/Game.class.js');
const game = new Game();

const body = document.body;
const cells = document.querySelectorAll('.field-cell');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const startButton = document.querySelector('.start');
const scoreTable = document.querySelector('.game-score');

if (scoreTable) {
  scoreTable.textContent = game.getScore();
}

render();

if (body) {
  body.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      doSomeMove('left');
      render();
    }

    if (e.key === 'ArrowRight') {
      doSomeMove('right');
      render();
    }

    if (e.key === 'ArrowDown') {
      doSomeMove('down');
      render();
    }

    if (e.key === 'ArrowUp') {
      doSomeMove('up');
      render();
    }

    game.checkWin();
    game.getStatus();
  });
}

if (startButton) {
  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      game.start();
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');

      if (startMessage) {
        startMessage.hidden = true;
      }
    } else {
      game.restart();

      if (loseMessage) {
        loseMessage.hidden = true;
      }
    }

    render();

    if (scoreTable) {
      scoreTable.textContent = game.getScore();
    }
  });
}

function render() {
  const ourState = game.getState();

  if (!ourState || !cells || cells.length === 0) {
    return;
  }

  for (let i = 0; i < ourState.length; i++) {
    for (let j = 0; j < ourState.length; j++) {
      const cell = cells[i * 4 + j];

      if (!cell) {
        continue;
      }

      for (const cls of cell.classList) {
        if (cls.startsWith('field-cell--')) {
          cell.classList.remove(cls);
        }
      }

      if (ourState[i][j] > 0) {
        cell.textContent = ourState[i][j];
        cell.classList.add(`field-cell--${ourState[i][j]}`);
      } else {
        cell.textContent = '';
      }
    }
  }
}

function doSomeMove(side) {
  let move;

  switch (side) {
    case 'left':
      move = game.moveLeft();
      break;
    case 'right':
      move = game.moveRight();
      break;
    case 'down':
      move = game.moveDown();
      break;
    case 'up':
      move = game.moveUp();
      break;
  }

  if (move) {
    if (scoreTable) {
      scoreTable.textContent = game.getScore();
    }

    const gameStatus = game.getStatus();

    if (gameStatus === 'win') {
      createMessage('win');
    }

    if (gameStatus === 'lose') {
      createMessage('lose');
    }
  }
}

function createMessage(messageStatus) {
  switch (messageStatus) {
    case 'win':
      if (winMessage) {
        winMessage.classList.remove('hidden');
      }

      if (loseMessage) {
        loseMessage.classList.add('hidden');
      }
      break;

    case 'lose':
      if (loseMessage) {
        loseMessage.classList.remove('hidden');
      }

      if (winMessage) {
        winMessage.classList.add('hidden');
      }
      break;
  }
}
