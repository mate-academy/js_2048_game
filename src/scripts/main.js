'use strict';

// write your code here

const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');

button.addEventListener('click', e => {
  const cells = document.querySelectorAll('.field-cell');
  const gameScore = document.querySelector('.game-score');

  if (e.target.matches('.start')) {
    e.target.innerHTML = 'Restart';
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    startMessage.classList.add('hidden');
  }

  if (e.target.matches('.restart')) {
    [...cells].forEach(cell => {
      cell.removeAttribute('data-number');
    });
    gameScore.innerHTML = '0';
  }

  addStartCells(cells);
  updateCells();
});

function probability(n) {
  return Math.random() < n;
}

function addStartCells(cells) {
  let firstCell = Math.floor(Math.random() * 16);
  let secondCell = Math.floor(Math.random() * 16);

  while (firstCell === secondCell) {
    firstCell = Math.floor(Math.random() * 16);
    secondCell = Math.floor(Math.random() * 16);
  }

  for (let i = 0; i < [...cells].length; i++) {
    if (i === firstCell) {
      cells[i].dataset.number = '2';
    }

    if (i === secondCell) {
      const num = probability(0.1) ? '4' : '2';

      cells[i].dataset.number = num;
    }
  }

  updateCells();
}

function availibleMoves() {
  let result = false;
  const rows = document.querySelectorAll('.field-row');
  const columns = [
    document.querySelectorAll('.field-row :first-child'),
    document.querySelectorAll('.field-row :nth-child(2)'),
    document.querySelectorAll('.field-row :nth-child(3)'),
    document.querySelectorAll('.field-row :last-child'),
  ];

  [...rows].forEach(row => {
    const cells = document.querySelectorAll('.field-cell');

    for (let i = 0; i < cells.length - 1; i++) {
      if (cells[i].dataset.number === cells[i + 1].dataset.number) {
        result = true;

        return;
      }
    }
  });

  columns.forEach(column => {
    for (let i = 0; i < column.length - 1; i++) {
      if (column[i].dataset.number === column[i + 1].dataset.number) {
        result = true;

        return;
      }
    }
  });

  return result;
}

document.addEventListener('keydown', e => {
  if (!startMessage.classList.contains('hidden')) {
    return;
  }

  const cells = document.querySelectorAll('.field-cell');
  const gameScore = document.querySelector('.game-score');
  let score = +gameScore.innerHTML;
  let scoreIncrease;

  [...cells].forEach(cell => {
    cell.classList.remove(`field-cell--${cell.innerHTML}`);
  });

  if (e.key === 'ArrowRight') {
    scoreIncrease = right();
  } else if (e.key === 'ArrowLeft') {
    scoreIncrease = left();
  } else if (e.key === 'ArrowUp') {
    scoreIncrease = moveUp();
  } else if (e.key === 'ArrowDown') {
    scoreIncrease = moveDown();
  } else {
    return;
  }

  score += scoreIncrease;
  gameScore.innerHTML = '' + score;

  deleteEmptySpaces(e.key);
  updateCells();
  addCell();
});

function moveDown() {
  let score = 0;
  const columns = [
    document.querySelectorAll('.field-row :first-child[data-number]'),
    document.querySelectorAll('.field-row :nth-child(2)[data-number]'),
    document.querySelectorAll('.field-row :nth-child(3)[data-number]'),
    document.querySelectorAll('.field-row :last-child[data-number]'),
  ];

  [...columns].forEach(column => {
    for (let i = column.length - 1; i > 0; i--) {
      const current = column[i];
      const prev = column[i - 1];

      if (current.dataset.number === prev.dataset.number) {
        current.dataset.number = `${+prev.dataset.number * 2}`;
        score += +prev.dataset.number * 2;
        prev.removeAttribute('data-number');
      }
    }
  });

  return score;
}

function moveUp() {
  let score = 0;
  const columns = [
    document.querySelectorAll('.field-row :first-child[data-number]'),
    document.querySelectorAll('.field-row :nth-child(2)[data-number]'),
    document.querySelectorAll('.field-row :nth-child(3)[data-number]'),
    document.querySelectorAll('.field-row :last-child[data-number]'),
  ];

  [...columns].forEach(column => {
    for (let i = 1; i < column.length; i++) {
      const current = column[i];
      const prev = column[i - 1];

      if (current.dataset.number === prev.dataset.number) {
        prev.dataset.number = `${+current.dataset.number * 2}`;
        score += +current.dataset.number * 2;
        current.removeAttribute('data-number');
      }
    }
  });

  return score;
}

function right() {
  let score = 0;
  const rows = document.querySelectorAll('.field-row');

  [...rows].forEach(row => {
    const cells = row.querySelectorAll('.field-cell');
    const cellsWithNumber = [...cells]
      .filter(cell => cell.hasAttribute('data-number'));

    for (let i = cellsWithNumber.length - 1; i > 0; i--) {
      const current = cellsWithNumber[i];
      const prev = cellsWithNumber[i - 1];

      if (current.dataset.number === prev.dataset.number) {
        current.dataset.number = `${+prev.dataset.number * 2}`;
        score += +prev.dataset.number * 2;
        prev.removeAttribute('data-number');
      }
    }
  });

  return score;
}

function left() {
  let score = 0;
  const rows = document.querySelectorAll('.field-row');

  [...rows].forEach(row => {
    const cells = row.querySelectorAll('.field-cell');
    const cellsWithNumber = [...cells]
      .filter(cell => cell.hasAttribute('data-number'));

    // [...cells].filter(cell => cell.hasAttribute('data-number'))
    //   .forEach(cell => row.append(cell));

    for (let i = 1; i < cellsWithNumber.length; i++) {
      const current = cellsWithNumber[i];
      const prev = cellsWithNumber[i - 1];

      if (current.dataset.number === prev.dataset.number) {
        prev.dataset.number = `${+current.dataset.number * 2}`;
        score += +current.dataset.number * 2;
        current.removeAttribute('data-number');
      }
    }
  });

  return score;
}

function updateCells() {
  const cells = document.querySelectorAll('.field-cell');
  const winMessage = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const emptyCells = [...cells]
    .filter(cell => !cell.hasAttribute('data-number'));

  [...cells].forEach(cell => {
    if (cell.hasAttribute('data-number')) {
      cell.classList.add(`field-cell--${cell.dataset.number}`);
      cell.classList.remove(`field-cell--${+cell.dataset.number / 2}`);
      cell.innerHTML = `${cell.dataset.number}`;
    } else {
      cell.innerHTML = '';
      cell.className = 'field-cell';
    }
  });

  if ([...cells].some(cell => cell.dataset.number === '2048')) {
    winMessage.classList.remove('hidden');
  }

  if (emptyCells.length === 0) {
    const hasAvailibleMoves = availibleMoves();

    if (!hasAvailibleMoves) {
      messageLose.classList.remove('hidden');

      return;
    };
  }
}

function addCell() {
  const emptyCells = [...document.querySelectorAll('.field-cell')]
    .filter(cell => !cell.hasAttribute('data-number'));
  const randomCell = Math.floor(Math.random() * emptyCells.length);

  emptyCells[randomCell].dataset.number = probability(0.1) ? '4' : '2';

  emptyCells[randomCell].classList
    .add(`field-cell--${emptyCells[randomCell].dataset.number}`);
  emptyCells[randomCell].innerHTML = `${emptyCells[randomCell].dataset.number}`;
}

function deleteEmptySpaces(direction) {
  const rows = document.querySelectorAll('.field-row');
  const columns = [
    document.querySelectorAll('.field-row :first-child'),
    document.querySelectorAll('.field-row :nth-child(2)'),
    document.querySelectorAll('.field-row :nth-child(3)'),
    document.querySelectorAll('.field-row :last-child'),
  ];

  [...rows].forEach(row => {
    const cells = row.querySelectorAll('.field-cell');
    const emptyCells = [...cells]
      .filter(cell => !cell.hasAttribute('data-number'));

    emptyCells.forEach(cell => {
      if (direction === 'ArrowRight') {
        row.prepend(cell);
      }

      if (direction === 'ArrowLeft') {
        row.append(cell);
      }
    });
  });

  if (direction === 'ArrowUp') {
    [...columns].forEach(column => {
      for (let i = 0; i < column.length - 1; i++) {
        const currentCell = column[i];

        if (!currentCell.hasAttribute('data-number')) {
          for (let n = i + 1; n < column.length; n++) {
            if (column[n].hasAttribute('data-number')) {
              currentCell.dataset.number = column[n].dataset.number;
              column[n].removeAttribute('data-number');

              break;
            }
          }
        }
      }
    });
  }

  if (direction === 'ArrowDown') {
    [...columns].forEach(column => {
      for (let i = column.length - 1; i > 0; i--) {
        const currentCell = column[i];

        if (!currentCell.hasAttribute('data-number')) {
          for (let n = i - 1; n >= 0; n--) {
            if (column[n].hasAttribute('data-number')) {
              currentCell.dataset.number = column[n].dataset.number;
              column[n].removeAttribute('data-number');

              break;
            }
          }
        }
      }
    });
  }
}

window.addEventListener('unhandledrejection', (e) => {
  e.preventDefault();

  const messageLose = document.querySelector('.message-lose');

  messageLose.classList.remove('hidden');
});
