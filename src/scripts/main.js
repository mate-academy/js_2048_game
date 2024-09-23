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

          tableFormatting();
          break;
        case 'ArrowDown':
          game.moveDown();

          tableFormatting();
          break;
        case 'ArrowLeft':
          game.moveLeft();

          tableFormatting();
          break;
        case 'ArrowRight':
          game.moveRight();

          tableFormatting();
          break;
        default:
          break;
      }
    });

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
