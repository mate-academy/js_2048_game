'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const gameScore = document.querySelector('.game-score');
  const gameCells = document.querySelectorAll('.field-cell');
  const btnStart = document.querySelector('.button.start');
  const msgWin = document.querySelector('.message-win');
  const msgLose = document.querySelector('.message-lose');
  const rows = 4;
  const cols = rows;
  let crntScore = 0;
  const gameBoard = Array.from({ length: rows },
    () => Array.from({ length: cols }, () => null));
  let prevGameBoard = gameBoard.flat();
  const emptyCells = [];

  btnStart.addEventListener('click', () => {
    for (const boardRow of gameBoard) {
      boardRow.forEach((el, i, arr) => {
        arr[i] = null;
      });
    }
    addTile(2);
    drawBoard();

    document.addEventListener('keydown', arrowHandler);

    btnStart.classList.remove('start');
    btnStart.classList.add('restart');
    btnStart.textContent = 'Restart';

    crntScore = 0;
    gameScore.textContent = crntScore;

    document.querySelector('.message-start').classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  });

  function arrowHandler(evt) {
    evt.preventDefault();

    switch (evt.key) {
      case 'ArrowUp':
        moveCol('up');
        break;

      case 'ArrowDown':
        moveCol('down');
        break;

      case 'ArrowLeft':
        moveRow('left');
        break;

      case 'ArrowRight':
        moveRow('right');
        break;

      default:
        return;
    }

    if (isNeedAdd()) {
      addTile();
    }

    drawBoard();
    verifyWinLose();
    prevGameBoard = gameBoard.flat();
  }

  function verifyWinLose() {
    if (gameBoard.flat().includes(2048)) {
      btnStart.classList.remove('restart');
      btnStart.classList.add('start');
      btnStart.textContent = 'Start';

      msgWin.classList.remove('hidden');
      document.querySelector('.message-start').classList.remove('hidden');
      document.removeEventListener('keydown', arrowHandler);

      return;
    }

    if (emptyCells.length === 0) {
      msgLose.classList.remove('hidden');
      document.removeEventListener('keydown', arrowHandler);
    }
  }

  function drawBoard() {
    gameCells.forEach((cell, indx) => {
      const cellVal = gameBoard[Math.floor(indx / cols)][indx % cols];

      cell.textContent = cellVal || '';
      cell.className = 'field-cell';// clear from prev condition

      if (cellVal) {
        cell.classList.add(`field-cell--${cellVal}`);
      }
    });

    gameScore.textContent = crntScore;
  }

  function verifyEmptyCells() {
    emptyCells.length = 0;

    for (let i = 0, arrLen = rows * cols; i < arrLen; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      if (!gameBoard[row][col]) {
        emptyCells.push([row, col]);
      }
    }
  }

  function addTile(cunt = 1) {
    verifyEmptyCells();

    for (let i = 0; i < cunt && emptyCells.length !== 0; i++) {
      const randIndx = randInt(emptyCells.length - 1);
      const [randRow, randCol] = emptyCells[randIndx];

      gameBoard[randRow][randCol] = (Math.random() < 0.9) ? 2 : 4;
      emptyCells.splice(randIndx, 1);
    }
  }

  function isNeedAdd() {
    const result = prevGameBoard.toString() !== gameBoard.flat().toString();

    return result;
  }

  function randInt(to = Number.MAX_SAFE_INTEGER, from = 0) {
    if (to < from) {
      return randInt(from, to);
    }

    return Math.floor(Math.random() * (to - from)) + from;
  }

  function moveRow(direction = 'right') {
    let cellsVals = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (gameBoard[row][col]) {
          cellsVals.push(gameBoard[row][col]);
        }
      }

      if (direction === 'left') {
        cellsVals.reverse();
      }

      cellsVals = cellMerge(cellsVals);

      if (direction === 'left') {
        cellsVals.reverse();
      }

      for (let col = 0; col < cols; col++) {
        gameBoard[row][col] = cellsVals[col];
      }

      cellsVals.length = 0;
    }
  }

  function moveCol(direction = 'down') {
    let cellsVals = [];

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        if (gameBoard[row][col]) {
          cellsVals.push(gameBoard[row][col]);
        }
      }

      if (direction === 'up') {
        cellsVals.reverse();
      }

      cellsVals
        = cellMerge(cellsVals);

      if (direction === 'up') {
        cellsVals.reverse();
      }

      for (let row = 0; row < rows; row++) {
        gameBoard[row][col] = cellsVals[row];
      }

      cellsVals.length = 0;
    }
  }

  function cellMerge(cellsVals = []) {
    for (let i = 1; i < cellsVals.length; i++) {
      if (cellsVals[i - 1] === cellsVals[i]) {
        cellsVals[i - 1] += cellsVals[i];
        cellsVals.splice(i, 1);
        crntScore += cellsVals[i - 1];
        break;
      }
    }

    return Array.from({ length: (rows - cellsVals.length) }, () => null)
      .concat(cellsVals);
  }
});
