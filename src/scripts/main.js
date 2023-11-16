'use strict';

const gameScoreBoard = document.querySelector('.game-score');
const controlsButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const initMatrix = (size) => {
  return [...Array(size)].map(() => [...Array(size)].fill(0));
};

const getTransposedMatrix = (matrix) => {
  const transposed = [...matrix];

  for (let i = 0; i < transposed.length; i++) {
    for (let j = 0; j < i; j++) {
      const temp = transposed[i][j];

      transposed[i][j] = transposed[j][i];
      transposed[j][i] = temp;
    }
  }

  return transposed;
};

const getElementsMatrix = () => {
  const elementsMatrix = [];
  const rows = document.querySelectorAll('.field-row');

  for (const row of rows) {
    const elementsRow = [];
    const cells = row.querySelectorAll('.field-cell');

    for (const cell of cells) {
      elementsRow.push(cell);
    }

    elementsMatrix.push(elementsRow);
  }

  return elementsMatrix;
};

const startGame = () => {
  const SIZE = 4;
  const NUMBER_TO_WIN = 2048;
  const elements = getElementsMatrix();
  let cells = initMatrix(SIZE);
  let gameScore = 0;

  const renderNumber = (num, row, cell) => {
    elements[row][cell].className = `field-cell field-cell--${num}`;
    elements[row][cell].textContent = num;
  };

  const renderNumbers = () => {
    for (let i = 0; i < elements.length; i++) {
      for (let j = 0; j < elements.length; j++) {
        if (cells[i][j]) {
          renderNumber(cells[i][j], i, j);
          continue;
        }

        elements[i][j].className = 'field-cell';
        elements[i][j].textContent = '';
      }
    }
  };

  const addNewNumbers = () => {
    while (true) {
      const row = getRandomInt(0, SIZE - 1);
      const cell = getRandomInt(0, SIZE - 1);

      if (cells[row][cell] === 0) {
        const newNumber = Math.random() < 0.1 ? 4 : 2;

        cells[row][cell] = newNumber;
        renderNumber(newNumber, row, cell);

        return;
      }
    }
  };

  const getMergedLine = (line) => {
    const merged = line.filter((el) => el);

    for (let i = 0; i < merged.length - 1; i++) {
      if (merged[i] === merged[i + 1]) {
        merged[i] = 2 * merged[i];
        merged.splice(i + 1, 1);
        gameScore += merged[i];
      }
    }

    return [...merged, ...Array(SIZE - merged.length).fill(0)];
  };

  const mergeLeft = () => {
    for (let i = 0; i < SIZE; i++) {
      const line = cells[i];

      cells[i] = getMergedLine(line);
    }
  };

  const mergeRight = () => {
    for (let i = 0; i < SIZE; i++) {
      const line = cells[i].reverse();

      cells[i] = getMergedLine(line).reverse();
    }
  };

  const mergeUp = () => {
    const transposedCells = getTransposedMatrix(cells);

    for (let i = 0; i < SIZE; i++) {
      const line = transposedCells[i];

      transposedCells[i] = getMergedLine(line);
    }

    cells = getTransposedMatrix(transposedCells);
  };

  const mergeDown = () => {
    const transposedCells = getTransposedMatrix(cells);

    for (let i = 0; i < SIZE; i++) {
      const line = transposedCells[i].reverse();

      transposedCells[i] = getMergedLine(line).reverse();
    }

    cells = getTransposedMatrix(transposedCells);
  };

  const isWon = () => {
    return cells.flat().some((el) => el === NUMBER_TO_WIN);
  };

  const hasEmptyCells = () => cells.flat().some((el) => !el);

  const canMerged = () => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (j + 1 < SIZE && cells[i][j] === cells[i][j + 1]) {
          return true;
        }

        if (i + 1 < SIZE && cells[i][j] === cells[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  };

  const isLose = () => {
    return !hasEmptyCells() && !canMerged();
  };

  const keydownEvent = (e) => {
    const stateBefore = JSON.stringify(cells);

    switch (e.key) {
      case 'ArrowLeft':
        mergeLeft();
        break;
      case 'ArrowRight':
        mergeRight();
        break;
      case 'ArrowUp':
        mergeUp();
        break;
      case 'ArrowDown':
        mergeDown();
        break;
    }

    const stateAfter = JSON.stringify(cells);

    if (stateBefore !== stateAfter) {
      renderNumbers();
      addNewNumbers();
      gameScoreBoard.textContent = gameScore;
    }

    if (isWon()) {
      messageWin.classList.remove('hidden');
    }

    if (isLose()) {
      messageLose.classList.remove('hidden');
      document.removeEventListener('keydown', keydownEvent);
    }
  };

  renderNumbers();

  for (let i = 0; i < 2; i++) {
    addNewNumbers();
  }

  document.addEventListener('keydown', keydownEvent);
};

const app = () => {
  controlsButton.addEventListener('click', (e) => {
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.textContent = 'Restart';

    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    startGame();
  });
};

app();
