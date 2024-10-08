'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('button');
const field = document.querySelector('.game-field');

const fieldRows = field.rows;
const fieldCells = [...fieldRows].map((row) => row.cells);

function emptyField() {
  for(const row of fieldCells) {
    [...row].forEach(cell => {
      if(cell.classList.length === 2) {
        cell.classList.remove(cell.classList[1]);
        cell.textContent = '';
      }
    });
  }
}

function addNewCell(arr) {
  fieldCells[arr[0]][arr[1]].classList.add(`field-cell--${arr[2]}`);
  fieldCells[arr[0]][arr[1]].textContent = `${arr[2]}`;
}

button.addEventListener('click', (e) => {
  if ([...e.target.classList].includes('start')) {
    game.start();
    addNewCell(game.getRandomCell());
    addNewCell(game.getRandomCell());

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
    emptyField();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }
});
