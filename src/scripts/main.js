'use strict';

let gameData = [];
const size = 4;
let score = 0;

function startGame() {
  gameData = [];

  for (let i = 0; i < size; i++) {
    gameData.push(new Array(size).fill(''));
  }
  addNumber();
  addNumber();
  renderGame();
}

function addNumber() {
  const availableCells = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!gameData[y][x]) {
        availableCells.push({
          x: x, y: y,
        });
      }
    }
  }

  if (availableCells.length === 0) {
    return;
  }

  const randomCell = availableCells(Math.floor(Math.random() * availableCells
    .length));

  gameData[randomCell.y][randomCell.x] = Math.random() < 0.9
    ? 2
    : 4;
}

function renderGame() {
  document.querySelector('.game-score').textContent = score;

  const gameField = document.querySelector('.game-field');
  const rows = gameField.querySelectorAll('.field-row');

  for (let y = 0; y < size; y++) {
    const cells = rows[y].querySelectorAll('.field-cell');

    for (let x = 0; x < size; x++) {
      const cell = cells[x];
      const value = gameData[y][x];

      cell.textContent = value || '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}
document.querySelector('.start').addEventListener('click', startGame);

document.addEventListener('keydown', function(evenT) {
  switch (evenT.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
  }
  renderGame();
});

function slideRow(row) {
  let arr = row.filter(val => val);
  const missing = size - arr.length;
  const zeros = Array(missing).fill('');

  arr = zeros.concat(arr);

  return arr;
}

function combineRow(row) {
  for (let i = size - 1; i >= 1; i--) {
    const a = row[i];
    const b = row[i - 1];

    if (a === b) {
      row[i] = a + b;
      score += row[i];
      row[i - 1] = '';
    }
  }

  return row;
}

function moveLeft() {
  for (let i = 0; i < size; i++) {
    gameData[i] = slideRow(gameData[i]);
    gameData[i] = combineRow(gameData[i]);
    gameData[i] = slideRow(gameData[i]);
  }
}

function moveRight() {
  for (let i = 0; i < size; i++) {
    gameData[i] = gameData[i].reverse();
    gameData[i] = slideRow(gameData[i]);
    gameData[i] = combineRow(gameData[i]);
    gameData[i] = slideRow(gameData[i]);
    gameData[i] = gameData[i].reverse();
  }
}

function moveUp() {
  const newGrid = rotateGrid(gameData);

  for (let i = 0; i < size; i++) {
    newGrid[i] = slideRow(newGrid[i]);
    newGrid[i] = combineRow(newGrid[i]);
    newGrid[i] = slideRow(newGrid[i]);
  }
  gameData = rotateGrid(newGrid);
}

function moveDown() {
  const newGrid = rotateGrid(gameData);

  for (let i = 0; i < size; i++) {
    newGrid[i] = newGrid[i].reverse();
    newGrid[i] = slideRow(newGrid[i]);
    newGrid[i] = combineRow(newGrid[i]);
    newGrid[i] = slideRow(newGrid[i]);
    newGrid[i] = newGrid[i].reverse();
  }
  gameData = rotateGrid(newGrid);
}

function rotateGrid(grid) {
  const newGrid = [];

  for (let x = 0; x < size; x++) {
    newGrid[x] = [];

    for (let y = 0; y < size; y++) {
      newGrid[x][y] = grid[y][x];
    }
  }

  return newGrid;
}
