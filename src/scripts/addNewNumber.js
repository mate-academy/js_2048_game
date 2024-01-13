'use strict';

const { changeCellClass } = require('./changeCellClass');

const addNewNumber = (cells) => {
  const emptyCells = cells.filter(cell => !cell.textContent);
  const cellValue = (Math.random() < 0.1) ? '4' : '2';
  const randomIndex = Math.floor(Math.random() * emptyCells.length);

  emptyCells[randomIndex].textContent = cellValue;
  changeCellClass(emptyCells[randomIndex]);
};

module.exports = { addNewNumber };
