"use strict";

// * initializing variables
let board;
const gameField = document.querySelector("tbody");
const startButton = document.querySelector(".button.start");
const startMessage = document.querySelector(".message.message-start");
const winMessage = document.querySelector(".message.message-win");
const loseMessage = document.querySelector(".message.message-lose");
const initialClassName = "field-cell";
const score = document.querySelector(".game-score");
let scoreCounter = 0;
let nowhereToGo = false;

startGame();

// * calls handleClick on startButton click
function startGame() {
  startButton.removeEventListener("click", handleClick);
  startButton.addEventListener("click", handleClick);
}

// * main function that starts a game and calls all helper functions
function handleClick() {
  if (startButton.innerText === "Start") {
    clearBoard();
    setRandomTile();
    setRandomTile();
    startButton.innerText = "Restart";
    startButton.classList.add("restart");
    hideMessage(startMessage);
  } else {
    restartGame();
  }

  window.addEventListener("keyup", moveListener);
  updateCells();
}

const getTiles = (arr) => arr.filter((val) => val !== 0);

// * on Arrow clicks cells move
function moveListener(e) {
  const originalBoard = JSON.stringify(board);

  switch (e.key) {
    case "ArrowLeft":
      moveLeft();
      break;

    case "ArrowRight":
      moveRight();
      break;

    case "ArrowUp":
      moveUp();
      break;

    case "ArrowDown":
      moveDown();
      break;
  }

  // * setting random tile if there was a movement
  if (JSON.stringify(board) !== originalBoard) {
    nowhereToGo = false;
    setRandomTile();
  } else {
    nowhereToGo = true;
  }

  checkForWin();
  checkForLose();
  updateCells();
}

// * helper function for movement which checks merging as well
function move(row) {
  row = getTiles(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      scoreCounter += row[i];
      score.innerText = scoreCounter;
    }
  }

  row = getTiles(row);

  while (row.length < board[0].length) {
    row.push(0);
  }

  return row;
}

// * func that provides ability to move cells to the right
function moveRight() {
  for (let r = 0; r < board.length; r++) {
    const row = board[r];

    row.reverse();
    board[r] = move(row);
    board[r].reverse();
  }
}

// * func that provides ability to move cells to the left
function moveLeft() {
  for (let r = 0; r < board.length; r++) {
    let row = board[r];

    row = move(row);
    board[r] = row;
  }
}

// * func that provides ability to move cells to the top
function moveUp() {
  for (let c = 0; c < board[0].length; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = move(row);
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];
  }
}

// * func that provides ability to move cells to the bottom
function moveDown() {
  for (let c = 0; c < board[0].length; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = move(row);
    row.reverse();
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];
  }
}

// * restart button modification
function restartGame() {
  const confirmed = window.confirm("Are you sure you want to restart game?");

  if (!confirmed) {
    return;
  }

  hideMessage(winMessage);
  hideMessage(loseMessage);
  showMessage(startMessage);
  clearBoard();
  score.innerText = 0;
  scoreCounter = 0;

  startButton.innerText = "Start";
  startButton.classList.remove("restart");

  startGame();
}

// * checking if we have a winner
function checkForWin() {
  board.forEach((row) => {
    if (row.some((cell) => cell === 2048)) {
      showMessage(winMessage);
      window.removeEventListener("keyup", moveListener);
    }
  });
}

// * checking if we have a loser
function checkForLose() {
  let hasLost = true;

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 0) {
        hasLost = false;
        break;
      }

      if (r < board.length - 1 && board[r][c] === board[r + 1][c]) {
        hasLost = false;
        break;
      }

      if (c < board[r].length - 1 && board[r][c] === board[r][c + 1]) {
        hasLost = false;
        break;
      }
    }

    if (!hasLost) {
      break;
    }
  }

  if (hasLost) {
    showMessage(loseMessage);
    window.removeEventListener("keyup", moveListener);
  }
}

// * hiding message func
function hideMessage(message) {
  if (!message.classList.contains("hidden")) {
    message.classList.add("hidden");
  }
}

// * showing message func
function showMessage(message) {
  return message.classList.remove("hidden");
}

// * clearing board
function clearBoard() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

// * update Tile's value and class
function updateCells() {
  board.forEach((boardRow, boardRowIndex) => {
    boardRow.forEach((boardCellValue, boardCellIndex) => {
      const cell = gameField.rows[boardRowIndex].cells[boardCellIndex];

      cell.innerText = "";
      cell.className = initialClassName;

      if (boardCellValue > 0 && boardCellValue <= 2048) {
        cell.innerText = boardCellValue;
        cell.classList.add(`${initialClassName}--${boardCellValue}`);

        if (!nowhereToGo) {
          cell.classList.add(`${initialClassName}--merge-animation`);

          setTimeout(() => {
            cell.classList.remove(`${initialClassName}--merge-animation`);
          }, 150);
        }
      }
    });
  });
}

// * func to set 2 or 4 in random position in the board
function setRandomTile() {
  const numberOfRows = 4;
  const numberOfCells = 4;

  const getRandomRow = Math.floor(Math.random() * numberOfRows);
  const getRandomCol = Math.floor(Math.random() * numberOfCells);

  if (board[getRandomRow][getRandomCol] !== 0) {
    setRandomTile();

    return;
  }

  board[getRandomRow][getRandomCol] = getTwoOrFour();
}

// * getting random number (2 or 4)
function getTwoOrFour() {
  const randomNum = Math.random();

  return randomNum > 0.1 ? 2 : 4;
}
