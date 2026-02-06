'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const elementInCell = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');

button.addEventListener('click', (e) => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();

  button.className = 'button restart';
  button.textContent = 'Restart';
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    if (e.key === 'ArrowLeft') {
      game.moveLeft();
    } else if (e.key === 'ArrowRight') {
      game.moveRight();
    } else if (e.key === 'ArrowUp') {
      game.moveUp();
    } else if (e.key === 'ArrowDown') {
      game.moveDown();
    }

    render();
  }
});

function render() {
  let index = 0;

  game.getState().map((row) => {
    row.map((el) => {
      if (el !== 0) {
        const cell = elementInCell[index];

        elementInCell[index].textContent = el;
        elementInCell[index].className = `field-cell field-cell--${el} pop`;
        setTimeout(() => cell.classList.remove('pop'), 120);
        index++;
      } else {
        elementInCell[index].textContent = '';
        elementInCell[index].className = 'field-cell';
        index++;
      }
    });
  });

  if (game.getStatus() === 'win') {
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageStart.classList.add('hidden');
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    button.className = 'button start';
    button.textContent = 'Start';
  }

  score.textContent = `${game.getScore()}`;
}
