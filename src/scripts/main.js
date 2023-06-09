'use strict';

const startButton = document.querySelector('.start');

startButton.insertAdjacentHTML('afterend', `
  <button class="button restart hidden">Reset</button>
  `);

const restartButton = document.querySelector('.restart');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const fieldCells = document.querySelectorAll('.field-cell');
const scoreSpan = document.querySelector('.game-score');

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

const toggleHidden = (...elements) => {
  elements.forEach(element => {
    element.classList.toggle('hidden');
  }); ;
};

startButton.addEventListener('click', () => {
  fillNewCell();
  fillNewCell();
  toggleHidden(startButton, restartButton, messageStart);
  document.addEventListener('keydown', handleMove);
});

restartButton.addEventListener('click', () => {
  [...fieldCells].map(item => {
    item.textContent = '';
    item.className = 'field-cell';
  });
  toggleHidden(startButton, restartButton, messageStart, messageLose);
  setScore(0);
  document.addEventListener('keydown', handleMove);
});

const setProperClass = (cell) => {
  if (cell.textContent) {
    cell.className = `field-cell field-cell--${cell.textContent}`;

    return;
  }

  cell.className = `field-cell`;
};

const changeValues = (line, valA, valB, mult = 0) => {
  let temp = line[valA + valB].textContent;

  if (mult) {
    temp *= 2;
  }

  line[valA].textContent = temp;
  setProperClass(line[valA]);
  line[valA + valB].textContent = '';
  setProperClass(line[valA + valB]);
};

const move = (start, endX, endY, step, stepX, stepY) => {
  for (let x = 0; x < endY; x += step) {
    const line = [];

    for (let i = 0 + x; i < fieldCells.length; i += stepY) {
      if (line.length < 4) {
        line.push(fieldCells[i]);
      }
    }

    const moveLine = (a = start, b = stepX) => {
      for (let i = a; i !== endX; i += b) {
        if (!line[i].textContent) {
          changeValues(line, i, b);
        }

        if (line[i].textContent === line[i + b].textContent
           && line[i].textContent) {
          setProperClass(line[i]);
        }
      };
    };

    for (let y = 0; y < 3; y++) {
      moveLine();
    };

    const collapseLine = (i, b) => {
      let equalCount = 0;

      if (line[i].textContent === line[i + b].textContent
        && !!line[i].textContent) {
        equalCount++;
        changeValues(line, i, b, 2);
        setScore(+scoreSpan.textContent + +line[i].textContent * 2);
      }

      return equalCount;
    };

    for (let i = start; i !== endX; i += stepX) {
      if (collapseLine(i, stepX)) {
        moveLine(i, stepX);
      };
    };
  }
};

const handleMove = (e) => {
  const prevState = getFieldState();

  if (e.key === 'ArrowDown') {
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

  const currState = getFieldState();

  if (checkWin()) {
    toggleHidden(messageWin);
  }

  if (checkStateChange(prevState, currState)) {
    fillNewCell();
  }

  if (!checkStateChange(prevState, currState) && !checkEmptyCells()) {
    toggleHidden(messageLose);

    document.removeEventListener('keydown', handleMove);
  }
};

const setScore = (value) => {
  scoreSpan.textContent = value;
};

const getFieldState = (cells = fieldCells) => {
  return [...cells].map(cell => cell.textContent);
};

const checkStateChange = (prev, curr) => {
  for (let i = 0; i < prev.length; i++) {
    if (prev[i] !== curr[i]) {
      return true;
    }
  }

  return false;
};

const checkEmptyCells = () => {
  return [...fieldCells].some(el => {
    return el.classList.length === 1;
  });
};

const checkWin = () => {
  return [...fieldCells].some(el => el.textContent === 2048);
};
