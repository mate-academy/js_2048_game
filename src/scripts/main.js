import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const button = document.querySelector('.button');
  const scoreElement = document.querySelector('.game-score');
  const cells = document.querySelectorAll('.field-cell');

  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  let isFirstMoveMade = false;

  function render() {
    const board = game.getState();
    const score = game.getScore();
    const gameStatus = game.getStatus();

    if (scoreElement) {
      if (
        gameStatus === 'playing' ||
        gameStatus === 'win' ||
        gameStatus === 'lose'
      ) {
        scoreElement.textContent = score;
      } else {
        scoreElement.textContent = '';
      }
    }

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = board[row][col];

      cell.className = cell.className
        .split(' ')
        .filter((className) => !className.startsWith('field-cell--'))
        .join(' ');

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
    });

    if (winMessage) {
      if (gameStatus === 'win') {
        winMessage.classList.remove('hidden');
      } else {
        winMessage.classList.add('hidden');
      }
    }

    if (loseMessage) {
      if (gameStatus === 'lose') {
        loseMessage.classList.remove('hidden');
      } else {
        loseMessage.classList.add('hidden');
      }
    }
  }

  if (button) {
    button.addEventListener('click', () => {
      if (button.classList.contains('restart')) {
        game.restart();
        button.textContent = 'Start';
        button.classList.remove('restart');
        button.classList.add('start');

        if (startMessage) {
          startMessage.classList.remove('hidden');
        }
      } else {
        game.start();
        button.textContent = 'Restart';
        button.classList.remove('start');
        button.classList.add('restart');

        if (startMessage) {
          startMessage.classList.add('hidden');
        }
      }

      isFirstMoveMade = false;

      if (winMessage) {
        winMessage.classList.add('hidden');
      }

      if (loseMessage) {
        loseMessage.classList.add('hidden');
      }

      render();
    });
  }

  document.addEventListener('keydown', (evt) => {
    if (game.getStatus() === 'idle') {
      return;
    }

    let moveDone = false;

    switch (evt.key) {
      case 'ArrowLeft':
        moveDone = game.moveLeft();
        break;
      case 'ArrowRight':
        moveDone = game.moveRight();
        break;
      case 'ArrowUp':
        moveDone = game.moveUp();
        break;
      case 'ArrowDown':
        moveDone = game.moveDown();
        break;
      default:
        return;
    }

    evt.preventDefault();

    if (moveDone) {
      if (!isFirstMoveMade) {
        isFirstMoveMade = true;

        if (startMessage) {
          startMessage.classList.add('hidden');
        }
      }

      render();
    }
  });

  render();
});
