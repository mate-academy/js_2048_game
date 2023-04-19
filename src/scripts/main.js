'use strict';

const startButton = document.querySelector('.start');

startButton.insertAdjacentHTML('afterend', `
  <button class="button restart hidden">Reset</button>
  `);

const restartButton = document.querySelector('.restart');
const messageStart = document.querySelector('.message-start');
const gameField = document.querySelector('.game-field').firstElementChild;
const fieldCells = document.querySelectorAll('.field-cell');

const getRandomCellValue = () => {
  return Math.floor(Math.random() * 10) < 9 ? 2 : 4;
};

const getFreeRandomCell = () => {
  const freeCells = [...fieldCells].filter(el => el.classList.length === 1);
  const randomIndex = Math.floor(Math.random() * freeCells.length);

  return freeCells[randomIndex];
};

const fillNewCell = () => {
  const cell = getFreeRandomCell();
  const value = getRandomCellValue();

  cell.textContent = value;
  cell.classList.add(`field-cell--${value}`);
};

const firstMove = () => {
  fillNewCell();
  fillNewCell();
};

const toggleHidden = (element) => {
  element.classList.toggle('hidden');
};

startButton.addEventListener('click', () => {
  // firstMove();
  toggleHidden(startButton);
  toggleHidden(restartButton);
});

restartButton.addEventListener('click', () => {
  [...fieldCells].map(item => {
    item.textContent = '';
    item.className = 'field-cell';
  });
  toggleHidden(restartButton);
  toggleHidden(startButton);
});

// moves

const getCellInfo = (cell) => {
  const parentRow = cell.parentElement;
  const colIndex = [...parentRow.children].findIndex(el => el === cell);
  const rowIndex = [...parentRow.parentElement.children].findIndex(el => el === parentRow);

  return {
    col: colIndex, row: rowIndex, value: cell.textContent,
  };
};

const isChange = (prev) => {
  const curr = getValuesSum();

  return prev !== curr;
};

const getValuesSum = () => {
  return [...fieldCells].reduce((acc, item) => {
    return acc + +item.textContent;
  }, 0);
};

const checkEmptyCells = () => {
  const activeCells = [...fieldCells].filter(item => item.classList.length === 2);

  if (activeCells.length === 16) {
    console.log('finish');
  }
};

const move = (start, endX, endY, step, stepX, stepY) => {
  for (let x = 0; x < endY; x += step) {
    const line = [];

    for (let i = 0 + x; i < fieldCells.length; i += stepY) {
      if (line.length < 4) {
        line.push(fieldCells[i]);
      }
    }

    for (let o = 0; o < 3; o++) {
      for (let i = start; i !== endX; i += stepX) {
        if (line[i].textContent) {
          continue;
        }

        if (!line[i].textContent) {
          const temp = line[i + stepX].textContent;

          line[i].textContent = temp;
          line[i + stepX].textContent = '';
        }
      };
    };
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    // fillNewCell();
    // checkEmptyCells();
    move(3, 0, 4, 1, -1, 4);
  };

  if (e.key === 'ArrowUp') {
    move(0, 3, 4, 1, 1, 4);
  }

  if (e.key === 'ArrowRight') {
    move(3, 0, 16, 4, -1, 1);
  }

  if (e.key === 'ArrowLeft') {
    move(0, 3, 16, 4, 1, 1);
  }
});
