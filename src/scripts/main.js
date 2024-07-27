'use strict';

const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const fieldCells = document.querySelectorAll('.field-cell');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

let score = 0;
let gameField = [];

function initGame() {
  startButton.addEventListener('click', startGame);
  document.addEventListener('keydown', handleKeyPress);
  resetGame();
}

function startGame() {
  resetGame();
  updateUI();
}

function resetGame() {
  score = 0;
  gameScore.textContent = score;
  gameField = Array.from({ length: 4 }, () => Array(4).fill(0));
  startButton.textContent = 'Restart';
  startButton.classList.replace('start', 'restart');
  hideMessages();
  generateNewNumber();
  generateNewNumber();
}

function hideMessages() {
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');
}

function generateNewNumber() {
  const emptyCells = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameField[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameField[row][col] = Math.random() < 0.9 ? 2 : 4;
    updateUI();
  }
}

function updateUI() {
  fieldCells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    cell.textContent = gameField[row][col] === 0 ? '' : gameField[row][col];
    cell.className = 'field-cell';

    if (gameField[row][col] !== 0) {
      cell.classList.add(`field-cell--${gameField[row][col]}`);
    }
  });

  gameScore.textContent = score;
}

function handleKeyPress(e) {
  let moved = false;

  switch (e.key) {
    case 'ArrowUp':
      moved = moveUp();
      break;
    case 'ArrowDown':
      moved = moveDown();
      break;
    case 'ArrowRight':
      moved = moveRight();
      break;
    case 'ArrowLeft':
      moved = moveLeft();
      break;
  }

  if (moved) {
    generateNewNumber();
    if (checkGameOver()) {
      messageLose.classList.remove('hidden');
    } else if (checkWin()) {
      messageWin.classList.remove('hidden');
    }
  }
}

function moveUp() {
  return move((row, col) => row > 0, (row, col) => [row - 1, col]);
}

function moveDown() {
  return move((row, col) => row < 3, (row, col) => [row + 1, col]);
}

function moveRight() {
  return move((row, col) => col < 3, (row, col) => [row, col + 1]);
}

function moveLeft() {
  return move((row, col) => col > 0, (row, col) => [row, col - 1]);
}

function move(condition, getNextPos) {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameField[row][col] !== 0) {
        let [nextRow, nextCol] = getNextPos(row, col);
        while (condition(nextRow, nextCol) && gameField[nextRow][nextCol] === 0) {
          gameField[nextRow][nextCol] = gameField[row][col];
          gameField[row][col] = 0;
          [row, col] = [nextRow, nextCol];
          [nextRow, nextCol] = getNextPos(row, col);
          moved = true;
        }
        if (condition(nextRow, nextCol) && gameField[nextRow][nextCol] === gameField[row][col]) {
          gameField[nextRow][nextCol] *= 2;
          score += gameField[nextRow][nextCol];
          gameField[row][col] = 0;
          moved = true;
        }
      }
    }
  }

  return moved;
}

function checkGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (gameField[row][col] === 0 ||
          (row < 3 && gameField[row][col] === gameField[row + 1][col]) ||
          (col < 3 && gameField[row][col] === gameField[row][col + 1])) {
        return false;
      }
    }
  }

  return true;
}

function checkWin() {
  return gameField.flat().includes(2048);
}

// Initialize the game
initGame();
