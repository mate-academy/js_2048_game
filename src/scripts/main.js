'use strict';

let isStarted = false;

const allCells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');

function getRandomCells(cells, amount = 1) {
  const randomCells = [];

  let fitsCellsAmount = 0;

  while (fitsCellsAmount < amount) {
    const randomCell = cells[Math.floor(Math.random() * cells.length)];

    if (!randomCells.includes(randomCell)) {
      randomCells.push(randomCell);
      fitsCellsAmount++;
    }
  }

  return randomCells;
}

startButton.addEventListener('click', () => {
  event.preventDefault();

  if (!isStarted) {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');

    const firstGenCellsCount = 2;
    const firstGenRandomCells = getRandomCells(allCells, firstGenCellsCount);

    for (const cell of firstGenRandomCells) {
      const cellWeight = Math.random() <= 0.2 ? 4 : 2;

      cell.textContent = cellWeight;
      cell.classList.add(`field-cell--${cellWeight}`);
    }
  } else {
    startButton.classList.remove('restart');
    startButton.textContent = 'Start';

    allCells.forEach(cell => {
      cell.className = 'field-cell';
      cell.textContent = '';
    });
  }

  isStarted = !isStarted;
});

document.addEventListener('keydown', function() {
  if (isStarted) {
    switch (event.key) {
      case 'ArrowUp':
        // console.log('Верхня стрілка натиснута');
        break;
      case 'ArrowDown':
        // console.log('Нижня стрілка натиснута');
        break;
      case 'ArrowLeft':
        // console.log('Ліва стрілка натиснута');
        break;
      case 'ArrowRight':
        // console.log('Права стрілка натиснута');
        break;
      default:
        break;
    }
  }
});
