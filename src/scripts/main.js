'use strict';

const gameField = [];
const size = 4;
const score = 0;

function initGame() {
  for (let i = 0; i < size; i++) {
    gameField[i] = [];

    for (let j = 0; j < size; j++) {
      gameField[i][j] = 0;
    }
  }
  addRandomTile();
  addRandomTile();
  renderGameField();
}

function addRandomTile() {
  const availableCells = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (gameField[i][j] === 0) {
        availableCells.push({
          x: i, y: j,
        });
      }
    }
  }

  if (!availableCells.length) {
    return;
  }

  const randomCell = availableCells(Math.floor(Math.random()
    * availableCells.length));

  gameField[randomCell.x][randomCell.y] = Math.random() < 0.9
    ? 2
    : 4;
}

function renderGameField() {
  const gameFieldEl = document.querySelector('.game-field');
  const scoreEl = document.querySelector('.game-score');

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = gameFieldEl.rows[i].cells[j];
      const value = gameField[i][j];

      cell.textContent = value || '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add('field-cell--' + value);
      }
    }
  }
  scoreEl.textContent = score;
}

document.querySelector('.start').addEventListener('click', initGame);
