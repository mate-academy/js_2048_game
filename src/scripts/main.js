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

// * starting game

startButton.addEventListener('click', startGame);

// * main semantic of logic

function startGame() {
  if (startButton.innerText === 'Start') {
    clearBoard();
    startButton.innerText = 'Restart';
    startButton.classList.add('restart');
    hideMessage(messageStart);
    setRandomCell();
    setRandomCell();
  } else {
    restartGame();
  }

  updateCell();

  checkForWin();
  checkForLose(); // should be modified
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

function updateCell() {
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

function setRandomCell() {
  const numberOfRows = 4;
  const numberOfCells = 4;

  const getRandomRow = Math.floor(Math.random() * numberOfRows);
  const getRandomCell = Math.floor(Math.random() * numberOfCells);

  if (board[getRandomRow][getRandomCell] !== 0) {
    setRandomCell();

    return;
  }

  board[getRandomRow][getRandomCell] = getTwoOrFour();
}

function getTwoOrFour() {
  const randomNum = Math.random();

  return randomNum > 0.1 ? 2 : 4;
}
