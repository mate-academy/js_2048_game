'use strict';

const { changeCellClass } = require('./changeCellClass');
const { addNewNumber } = require('./addNewNumber');
const { handleAction } = require('./handleAction');
const { isTurnPossible } = require('./isTurnPossible');

const CONTROLS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
];

const mainButton = document.querySelector('.button-main');

const gameScore = document.querySelector('.game-score');

const fieldCells = document.querySelectorAll('.field-cell');
const cells = Array.from(fieldCells);

const field = [
  cells.slice(0, 4),
  cells.slice(4, 8),
  cells.slice(8, 12),
  cells.slice(12, 16),
];

const messages = {
  start: document.querySelector('.message-start'),
  win: document.querySelector('.message-win'),
  lose: document.querySelector('.message-lose'),
};

const game2048 = (action) => {
  if (CONTROLS.includes(action.key)) {
    const previousTurn = cells.map(cell => cell.textContent);

    handleAction(action.key, field, gameScore);

    fieldCells.forEach((fieldCell) => {
      changeCellClass(fieldCell);
    });

    const currentTurn = cells.map(cell => cell.textContent);

    const isFieldChanged = currentTurn.toString() !== previousTurn.toString();

    if (isFieldChanged) {
      addNewNumber(cells);
    }

    if (currentTurn.some(cellValue => cellValue === '2048')) {
      messages.win.classList.remove('hidden');
      document.removeEventListener('keydown', game2048);
    } else if (!isFieldChanged) {
      if (!isTurnPossible(field)) {
        messages.lose.classList.remove('hidden');
        document.removeEventListener('keydown', game2048);
      }
    }
  }
};

mainButton.addEventListener('click', () => {
  document.removeEventListener('keydown', game2048);
  mainButton.classList.replace('start', 'restart');
  mainButton.textContent = 'Restart';

  gameScore.textContent = '0';

  fieldCells.forEach((fieldCell) => {
    fieldCell.textContent = '';
    changeCellClass(fieldCell);
  });

  addNewNumber(cells);
  addNewNumber(cells);

  for (const gameEvent in messages) {
    if (!messages[gameEvent].classList.contains('hidden')) {
      messages[gameEvent].classList.add('hidden');
    }
  }

  document.addEventListener('keydown', game2048);
});
