'use strict';

// elements constants
const cellsArrow = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button');

// change button
startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';

    getRandomCell();
    getRandomCell();
  } else {
    // startButton.classList.replace('restart', 'start');
    // startButton.textContent = 'Start';

    cellsArrow.forEach(function(cell) {
      cell.classList.remove('field-cell--2');
      cell.classList.remove('field-cell--4');
      cell.textContent = '';
    });

    getRandomCell();
    getRandomCell();
  }
});

// getRandomCell function
function getRandomCell() {
  const cellNumber = Math.floor(Math.random() * 16);

  const cellValue = (function() {
    const tale = (Math.random() >= 0.9) ? 4 : 2;

    return tale;
  })();

  const cell = cellsArrow[cellNumber];

  if (cell.classList.length < 2) {
    cell.classList.add(`field-cell--${cellValue}`);
    cell.textContent = `${cellValue}`;
  } else {
    getRandomCell();
  }
}
