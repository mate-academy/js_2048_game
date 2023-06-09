'use strict';

const gameBoard = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const gameButton = document.querySelector('.button');
const gameMessages = document.querySelectorAll('.message');

const rowsCount = 4;
const cellsCount = rowsCount;
const cellsArray = [];
let totalScore = 0;

(function(array, rows, cells) {
  for (let r = 0; r < rows; r++) {
    const rowArr = [];

    array.push(rowArr);

    for (let c = 0; c < cells; c++) {
      const cellArr = 0;

      rowArr.push(cellArr);
    }
  }
  renderGameBoard();
})(cellsArray, rowsCount, cellsCount);

function resetArray() {
  for (let i = 0; i < cellsArray.length; i++) {
    for (let j = 0; j < cellsArray[i].length; j++) {
      cellsArray[i][j] = 0;
    }
  }
  totalScore = 0;
}

function renderGameBoard() {
  gameBoard.innerHTML = `
    <tbody>${cellsArray.map(row => `
      <tr class="field-row">${row.map(cell => `
        <td class="field-cell field-cell--${cell}">
          ${cell > 0 ? cell : ''}
        </td>
      `).join('')}
      </tr>
    `).join('')}
    </tbody>
  `;
  gameScore.textContent = totalScore;
};

function insertRandomPlate() {
  const zeroCells = [];

  for (let row = 0; row < cellsArray.length; row++) {
    for (let cell = 0; cell < cellsArray[row].length; cell++) {
      if (cellsArray[row][cell] === 0) {
        zeroCells.push([row, cell]);
      }
    }
  }

  if (zeroCells.length > 0) {
    const randomIndx = zeroCells[Math.floor(Math.random() * zeroCells.length)];
    const randomPlateValue = Math.random() > 0.1 ? 2 : 4;
    const [row, cell] = randomIndx;

    cellsArray[row][cell] = randomPlateValue;
  }
};

function slide(row) {
  const slidingRow = row.filter(value => value !== 0);

  for (let i = 0; i < slidingRow.length - 1; i++) {
    if (slidingRow[i] === slidingRow[i + 1]) {
      slidingRow[i] *= 2;
      slidingRow[i + 1] = 0;
      totalScore += slidingRow[i];
    }
  }

  const rowWithoutZero = slidingRow.filter(value => value !== 0);
  const zeroForRow = Array(cellsCount - rowWithoutZero.length).fill(0);
  const resultSlidingRow = [...rowWithoutZero, ...zeroForRow];

  return resultSlidingRow;
};

function slideLeft(boardArray) {
  for (let row = 0; row < boardArray.length; row++) {
    let rowToSlide = boardArray[row];

    rowToSlide = slide(rowToSlide);
    boardArray[row] = rowToSlide;
  }
};

function slideRigth(boardArray) {
  for (let row = 0; row < boardArray.length; row++) {
    let rowToSlide = boardArray[row];

    rowToSlide.reverse();
    rowToSlide = slide(rowToSlide);
    rowToSlide.reverse();
    boardArray[row] = rowToSlide;
  }
};

function slideUp(boardArray) {
  for (let cell = 0; cell < cellsCount; cell++) {
    let rowToSlide = [
      boardArray[0][cell],
      boardArray[1][cell],
      boardArray[2][cell],
      boardArray[3][cell],
    ];

    rowToSlide = slide(rowToSlide);

    for (let row = 0; row < rowsCount; row++) {
      boardArray[row][cell] = rowToSlide[row];
    }
  }
};

function slideDown(boardArray) {
  for (let cell = 0; cell < cellsCount; cell++) {
    let rowToSlide = [
      boardArray[0][cell],
      boardArray[1][cell],
      boardArray[2][cell],
      boardArray[3][cell],
    ];

    rowToSlide.reverse();
    rowToSlide = slide(rowToSlide);
    rowToSlide.reverse();

    for (let row = 0; row < rowsCount; row++) {
      boardArray[row][cell] = rowToSlide[row];
    }
  }
};

function canSlide(boardArray, direction) {
  const copyBoardArray = JSON.parse(JSON.stringify(boardArray));
  const testArray = JSON.parse(JSON.stringify(copyBoardArray));

  switch (direction) {
    case 'left':
      slideLeft(testArray);
      break;

    case 'right':
      slideRigth(testArray);
      break;

    case 'up':
      slideUp(testArray);
      break;

    case 'down':
      slideDown(testArray);
      break;
  };

  return !(testArray.flat()
    .every((element, index) => element === copyBoardArray.flat()[index]));
};

function showMessage(state) {
  gameMessages.forEach(msg => {
    msg.classList.toggle('hidden', !msg.classList.contains(`message-${state}`));
  });
};

function checkGame() {
  if (!canSlide(cellsArray, 'left') && !canSlide(cellsArray, 'right')
    && !canSlide(cellsArray, 'up' && !canSlide(cellsArray, 'down'))) {
    showMessage('lose');
    window.removeEventListener('keyup', arrowPress);
  }

  if (cellsArray.flat().some(value => value === 2048)) {
    showMessage('win');
  }
};

gameButton.addEventListener('click', e => {
  const button = e.target;

  switch (true) {
    case (button.classList.contains('start')):
      insertRandomPlate();
      insertRandomPlate();
      renderGameBoard();
      showMessage('running');
      button.classList.replace('start', 'restart');
      button.textContent = 'Restart';
      window.addEventListener('keyup', arrowPress);
      break;

    case (button.classList.contains('restart')):
      resetArray();
      insertRandomPlate();
      insertRandomPlate();
      renderGameBoard();
      showMessage('running');
      window.addEventListener('keyup', arrowPress);
      break;

    default:
      window.addEventListener('keyup', arrowPress);
  }
});

function arrowPress(pressEvent) {
  switch (pressEvent.key) {
    case 'ArrowLeft':
      checkGame();

      if (!canSlide(cellsArray, 'left')) {
        return;
      }
      slideLeft(cellsArray);
      insertRandomPlate();
      renderGameBoard();
      break;

    case 'ArrowRight':
      checkGame();

      if (!canSlide(cellsArray, 'right')) {
        return;
      }
      slideRigth(cellsArray);
      insertRandomPlate();
      renderGameBoard();
      break;

    case 'ArrowUp':
      checkGame();

      if (!canSlide(cellsArray, 'up')) {
        return;
      }
      slideUp(cellsArray);
      insertRandomPlate();
      renderGameBoard();
      break;

    case 'ArrowDown':
      checkGame();

      if (!canSlide(cellsArray, 'down')) {
        return;
      }
      slideDown(cellsArray);
      insertRandomPlate();
      renderGameBoard();
      break;
  }
};
