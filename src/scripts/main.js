'use strict';

// write your code here
const gameBoard = document.querySelector('.game-score');
const controlsButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const initMatrix = (size) => Array.from(
  { length: size }, () => Array(size).fill(0));

const getTransposedMatrix = (matrix) => matrix[0].map(
  (_, i) => matrix.map(row => row[i]));

const getElementsMatrix = (
) => Array.from(document.querySelectorAll('.field-row'), row =>
  Array.from(row.querySelectorAll('.field-cell'))
);

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
    cells.forEach((line, i) => {
      const mergedLine = getMergedLine(line);

      cells[i] = mergedLine;
    });
  };

  const mergeRight = () => {
    cells.forEach((line, i) => {
      const reversedLine = [...line].reverse();
      const mergedLine = getMergedLine(reversedLine).reverse();

      cells[i] = mergedLine;
    });
  };

  const mergeUp = () => {
    cells = getTransposedMatrix(cells).map(line => getMergedLine(line));
    cells = getTransposedMatrix(cells);
  };

  const mergeDown = () => {
    cells = getTransposedMatrix(cells).map(line => {
      const reversedLine = line.slice().reverse();
      const mergedLine = getMergedLine(reversedLine);

      return mergedLine.reverse();
    });

    cells = getTransposedMatrix(cells);
  };

  const isWon = () => {
    return cells.flat().some((el) => el === NUMBER_TO_WIN);
  };

  const hasEmptyCells = () => cells.flat().some((el) => !el);

  const canMerged = () => cells.some((row, i) =>
    row.slice(0, -1).some((el, j) =>
      el === (cells[i + 1] && cells[i + 1][j])
    )
  );

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
      gameBoard.textContent = gameScore;
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
