'use strict';

// * initializing vars

let board;
const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');
const gameField = document.querySelector('tbody');
const messageStart = document.querySelector('.message.message-start');
const messageWin = document.querySelector('.message.message-win');
const messageLose = document.querySelector('.message.message-lose');
const initialClassName = 'field-cell';

go();

// * starting game
function go() {
  startButton.removeEventListener('click', startGame);
  startButton.addEventListener('click', startGame);
}

// * main semantic of logic

function startGame() {
  if (startButton.innerText === 'Start') {
    clearBoard();
    startButton.innerText = 'Restart';
    startButton.classList.add('restart');
    hideMessage(messageStart);
    setRandomTile();
    setRandomTile();
  } else {
    restartGame();
  }

  window.addEventListener('keyup', moveListener);
  checkForWin();
  checkForLose(); // should be modified
  updateCells();
}

function moveListener(e) {
  switch (e.key) {
    case 'ArrowRight':
      move('right');
      break;

    case 'ArrowLeft':
      move('left');
      break;

    case 'ArrowUp':
      move('up');
      break;

    case 'ArrowDown':
      move('down');
      break;
  }

  updateCells();
}

function move(direction) {
  let noFreeSpace = false;

  switch (direction) {
    case 'right':
      board.forEach((boardRow) => {
        let numberOfEmptyCells = 0;

        for (let i = boardRow.length; i >= 0; i--) {
          if (boardRow[i] === 0) {
            numberOfEmptyCells++;
            continue;
          }

          if (numberOfEmptyCells > 0) {
            boardRow[i + numberOfEmptyCells] = boardRow[i];
            boardRow[i] = 0;
            noFreeSpace = true;
          }
        }
      });

      break;

    case 'left':
      board.forEach((boardRow) => {
        let numberOfEmptyCells = 0;

        for (let i = 0; i < boardRow.length; i++) {
          if (boardRow[i] === 0) {
            numberOfEmptyCells++;
            continue;
          }

          if (numberOfEmptyCells > 0) {
            boardRow[i - numberOfEmptyCells] = boardRow[i];
            boardRow[i] = 0;
            noFreeSpace = true;
          }
        }
      });

      break;

    case 'up':
      board.forEach((boardRow, boardRowIndex) => {
        for (let i = 0; i < boardRow.length; i++) {
          if (boardRow[i] > 0) {
            let targetRow = boardRowIndex;

            for (let j = boardRowIndex - 1; j >= 0; j--) {
              if (board[j][i] !== 0) {
                break;
              }

              targetRow = j;
            }

            if (targetRow !== boardRowIndex) {
              board[targetRow][i] = boardRow[i];
              boardRow[i] = 0;
              noFreeSpace = true;
            }
          }
        }
      });

      break;

    case 'down':
      board.forEach((boardRow, boardRowIndex) => {
        for (let i = 0; i < boardRow.length; i++) {
          if (boardRow[i] > 0) {
            let targetRow = boardRowIndex;

            for (let j = boardRowIndex + 1; j < board.length; j++) {
              if (board[j][i] !== 0) {
                continue;
              }

              targetRow = j;
            }

            if (targetRow !== boardRowIndex) {
              board[targetRow][i] = boardRow[i];
              boardRow[i] = 0;
              noFreeSpace = true;
            }
          }
        }
      });

      break;
  }

  if (noFreeSpace) {
    setRandomTile();
  }
}

// * restart button modification
function restartGame() {
  const confirmed = window.confirm('Are you sure you want to restart game?');

  if (!confirmed) {
    return;
  }

  hideMessage(messageWin);
  hideMessage(messageLose);
  showMessage(messageStart);
  clearBoard();

  startButton.innerText = 'Start';
  startButton.classList.remove('restart');

  go();
}

// * checking if we have a winner
function checkForWin() {
  const isWin = [...cells].some((cell) => cell.innerText === '2048');

  if (isWin) {
    showMessage(messageWin);
  }
}

// * checking if we have a loser
function checkForLose() {
  const isLose = [...cells].every((cell) => cell.innerText !== '');

  if (isLose) {
    showMessage(messageLose);
  }
}

// * hiding message func
function hideMessage(message) {
  if (!message.classList.contains('hidden')) {
    message.classList.add('hidden');
  }
}

// * showing message func
function showMessage(message) {
  return message.classList.remove('hidden');
}

function clearBoard() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

// * update Tile value and class

function updateCells() {
  board.forEach((boardRow, boardRowIndex) => {
    boardRow.forEach((boardCellValue, boardCellIndex) => {
      const cell = gameField.rows[boardRowIndex].cells[boardCellIndex];

      cell.innerText = '';
      cell.className = initialClassName;

      if (boardCellValue > 0 && boardCellValue <= 2048) {
        cell.innerText = boardCellValue;
        cell.classList.add(`${initialClassName}--${boardCellValue}`);
      }
    });
  });
}

function setRandomTile() {
  const numberOfRows = 4;
  const numberOfCells = 4;

  const getRandomRow = Math.floor(Math.random() * numberOfRows);
  const getRandomCell = Math.floor(Math.random() * numberOfCells);

  if (board[getRandomRow][getRandomCell] !== 0) {
    setRandomTile();

    return;
  }

  board[getRandomRow][getRandomCell] = getTwoOrFour();
}

function getTwoOrFour() {
  const randomNum = Math.random();

  return randomNum > 0.1 ? 2 : 4;
}
