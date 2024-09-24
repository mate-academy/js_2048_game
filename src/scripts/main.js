'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const table = document.querySelector('.game-field');
const tableCell = [...table.querySelectorAll('td')];
const scoreInfo = document.querySelector('.game-score');
const playButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

playButton.addEventListener('click', (e) => {
  if (e.target.textContent === 'Start') {
    game.start();
    e.target.textContent = 'Restart';
    e.target.classList.remove('start');
    e.target.classList.add('restart');

    startMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');

    tableFormatting();

    document.addEventListener('keydown', (btn) => {
      switch (btn.key) {
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
        default:
          break;
      }

      tableFormatting();
    });

    let startX = 0;
    let startY = 0;
    const threshold = 100;

    document.addEventListener(
      'touchstart',
      function (ev) {
        startX = ev.touches[0].clientX;
        startY = ev.touches[0].clientY;
      },
      false,
    );

    document.addEventListener(
      'touchend',
      (ev) => {
        const endX = ev.changedTouches[0].clientX;
        const endY = ev.changedTouches[0].clientY;

        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > threshold) {
            game.moveRight();
          } else if (diffX < -threshold) {
            game.moveLeft();
          }
        } else {
          if (diffY > threshold) {
            game.moveDown();
          } else if (diffY < -threshold) {
            game.moveUp();
          }
        }

        tableFormatting();
      },
      false,
    );

    return;
  }

  if (e.target.textContent === 'Restart') {
    game.restart();

    e.target.classList.remove('restart');
    e.target.classList.add('start');
    e.target.textContent = 'Start';

    tableFormatting();
  }
});

function tableFormatting() {
  tableCell.forEach((cell, index) => {
    const flatBoard = game.board.flat();
    const cellContent = cell.textContent;

    cell.classList.remove(`field-cell--${cellContent}`);
    cell.textContent = flatBoard[index] !== 0 ? flatBoard[index] : '';
    cell.classList.add(`field-cell--${flatBoard[index]}`);
    scoreInfo.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    } else {
      loseMessage.classList.toggle('hidden');
    }

    if (game.getStatus() === 'lose') {
      loseMessage.classList.remove('hidden');
    } else {
      loseMessage.classList.add('hidden');
    }
  });
}
