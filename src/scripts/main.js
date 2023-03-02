'use strict';

// write your code here
const score = document.querySelector('.game-score');
const initializeGameBtn = document.querySelector('.button.start');
const gameOver = document.querySelector('.message-lose');
const youWin = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const rows = Array.from(document.querySelectorAll('.field-row'));
const board = Array(4).fill(0).map(x => Array(4).fill(0));

function findEmptyCell() {
  const boardSize = {
    row: 0,
    column: 0,
  };

  do {
    boardSize.row = Math.floor(Math.random() * 4);
    boardSize.column = Math.floor(Math.random() * 4);
  } while (board[boardSize.row][boardSize.column] !== 0);

  return boardSize;
}

function addNumber() {
  const { row, column } = findEmptyCell();

  board[row][column] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  board.map((row, rowIdx) => {
    row.map((cell, columnIdx) => {
      const elem = rows[rowIdx].children[columnIdx];

      if (cell === 0) {
        elem.textContent = '';
        elem.classList = 'field-cell';
      } else {
        elem.textContent = cell;
        elem.classList = `field-cell field-cell--${cell}`;
      }
    });
  });

  score.textContent = setScore();
}

function startGame() {
  board.map(row =>
    row.map((cell, cellIdx, cellArr) => (
      cellArr[cellIdx] = 0)));

  render();
  startMessage.classList.add('hidden');
  initializeGameBtn.classList.remove('start');
  initializeGameBtn.classList.add('restart');
  initializeGameBtn.textContent = 'Restart';
  score.textContent = '0';

  if (!youWin.classList.contains('hidden')) {
    youWin.classList.add('hidden');
  }

  if (!gameOver.classList.contains('hidden')) {
    gameOver.classList.add('hidden');
  }

  addNumber();
  addNumber();
  render();
}

function setScore() {
  return board.reduce((prev, row) => (
    prev + row.reduce((sum, cell) => sum + cell)
  ), 0);
}

function normalizeArr(move, initialArray, useReverse = false) {
  const normalizedArray = [[], [], [], []];

  if (move === 'ArrowUp' || move === 'ArrowDown') {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        normalizedArray[column][row] = initialArray[row][column];
      }
    }
  }

  if (move === 'ArrowLeft' || move === 'ArrowRight') {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        normalizedArray[row][column] = initialArray[row][column];
      }
    }
  }

  if (useReverse && (move === 'ArrowRight' || move === 'ArrowDown')) {
    normalizedArray.map(row => row.reverse());
  }

  return normalizedArray;
}

function makeMove(move) {
  const newArr = normalizeArr(move, board, true);
  let moveMaded = false;

  newArr.map((row, rowInd) => {
    const cellsWithData = row.filter(cell => cell !== 0);

    cellsWithData.map((cell, cellIdx, cellArr) => {
      if (cell === cellArr[cellIdx + 1]) {
        cellArr[cellIdx] *= 2;
        cellArr.splice(cellIdx + 1, 1);
        moveMaded = true;
      }
    });
    moveMaded = moveMaded || cellsWithData.length !== 4;

    row.map((cell, cellIdx, cellArr) => {
      cellArr[cellIdx] = cellsWithData[cellIdx] || 0;
    });
  });

  if (!moveMaded) {
    return false;
  }

  if (move === 'ArrowRight' || move === 'ArrowDown') {
    newArr.map(row => row.reverse());
  }

  return normalizeArr(move, newArr);
}

initializeGameBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (pressEvent) => {
  let anyMovesLeft = board.some(row => row.some(cell => cell === 0));
  const moves = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  const move = moves.includes(pressEvent.key) ? pressEvent.key : '';
  let receivedArray = [];

  if (move) {
    receivedArray = makeMove(move);

    if (!receivedArray || !anyMovesLeft) {
      anyMovesLeft = moves.some(shift => {
        if (move === shift) {
          return false;
        }

        return !!makeMove(shift);
      });
    }

    if (!anyMovesLeft) {
      gameOver.classList.remove('hidden');
    }

    if (receivedArray) {
      board.map((row, rowIdx, rowArr) => {
        row.map((cell, columnIdx) => {
          rowArr[rowIdx][columnIdx] = receivedArray[rowIdx][columnIdx];
        });
      });

      if (board.some(row => row.some(cell => cell === 2048))) {
        youWin.classList.remove('hidden');
      }

      addNumber();
      render();
    }
  }
});
