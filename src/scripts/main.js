'use strict';

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const gameField = document.querySelector('.game-field');
const gameFieldWidth = 4;

const buttonStart = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');

const winScore = 2048;
let score = 0;
let isGameStarted = false;

let gameBoard = boardInit();

function boardInit() {
  return Array.from({ length: gameFieldWidth },
    () => Array(gameFieldWidth).fill(0));
}

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start') && !isGameStarted) {
    isGameStarted = true;

    messageStart.classList.add('hidden');
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.innerText = 'Restart';
  } else if (buttonStart.classList.contains('restart')) {
    isGameStarted = false;
    gameScore.innerText = 0;
    score = 0;

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  resetGameBoard();
  fillRandomCell();
  fillRandomCell();
  fillBoard();

  document.addEventListener('keyup', movesController);
});

function resetGameBoard() {
  gameBoard = boardInit();
}

function handleWin() {
  const userWon = gameBoard.flat().includes(winScore);

  if (userWon) {
    messageWin.classList.remove('hidden');
    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');
    buttonStart.innerText = 'Start';

    resetGameBoard();
    document.removeEventListener('keyup', movesController);
  }
}

function handleLose() {
  const hasEmptyCell = gameBoard.flat().some((cell) => cell === 0);

  if (!hasEmptyCell) {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    document.removeEventListener('keyup', movesController);
  }
}

function randomNumber() {
  return Math.floor(Math.random() * gameFieldWidth);
}

function fillRandomCell() {
  const [row, col] = [randomNumber(), randomNumber()];

  if (!gameBoard[row][col]) {
    gameBoard[row][col] = Math.random() > 0.9 ? 4 : 2;
    handleLose();
  } else {
    fillRandomCell();
  }
}

function fillBoard() {
  gameBoard.forEach((row, rowCount) => {
    row.forEach((_, cellCount) => {
      const tile = gameField.rows[rowCount].cells[cellCount];
      const tileValue = gameBoard[rowCount][cellCount];

      tile.classList = 'field-cell';
      tile.innerText = tileValue;

      if (tileValue > 0) {
        tile.classList.add('field-cell--' + tileValue);
      } else {
        tile.innerText = '';
      }
    });
  });
}

function duplicateGameBoard() {
  return gameBoard.map((row) => row.slice());
}

function compareArrays(newArr, prevArr) {
  return JSON.stringify(newArr) === JSON.stringify(prevArr);
}

function flipGridVertical(grid) {
  return grid.map((row) => [...row].reverse());
}

function spinGrid(grid) {
  const newGrid = boardInit();

  newGrid.forEach((row, rowCount) => {
    row.forEach((_, colCount) => {
      newGrid[rowCount][colCount] = grid[colCount][rowCount];
    });
  });

  return newGrid;
}

function slideRight(row) {
  const notEmptyCells = row.filter((cell) => cell > 0);
  const emptyCells = Array(gameFieldWidth - notEmptyCells.length).fill(0);

  return emptyCells.concat(notEmptyCells);
}

function mergeCells(arr) {
  for (let i = gameFieldWidth - 1; i > 0; i--) {
    if (arr[i] === arr[i - 1]) {
      arr[i] += arr[i - 1];
      arr[i - 1] = 0;
      score += arr[i];
    }
  }

  gameScore.innerText = score;

  return arr;
}

function makeMove(keypress) {
  let undoFlip = false;
  let undoSpin = false;

  switch (keypress) {
    case 'ArrowUp':
      gameBoard = spinGrid(gameBoard);
      gameBoard = flipGridVertical(gameBoard);
      undoFlip = true;
      undoSpin = true;
      break;
    case 'ArrowDown':
      gameBoard = spinGrid(gameBoard);
      undoSpin = true;
      break;
    case 'ArrowLeft':
      gameBoard = flipGridVertical(gameBoard);
      undoFlip = true;
      break;
    default:
      break;
  }

  const preMergeGrid = duplicateGameBoard();

  gameBoard = gameBoard.map((row) => {
    return slideRight(mergeCells(slideRight(row)));
  });

  const preUndoGridsCompare = compareArrays(gameBoard, preMergeGrid);

  if (undoFlip) {
    gameBoard = flipGridVertical(gameBoard);
  }

  if (undoSpin) {
    gameBoard = spinGrid(gameBoard);
  }

  if (!preUndoGridsCompare) {
    fillRandomCell();
  }
}

function movesController(e) {
  makeMove(e.key);
  fillBoard();
  handleWin();
}
