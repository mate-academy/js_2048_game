/* eslint-disable max-len */
'use strict';

const TABLE_SIZE = 4;
const PERCENT_FOR_4 = 0.1;
const MAIN_START_VALUE = 2;
const SECONDATY_START_VALUE = 4;
const VALUE_TO_WIN = 2048;

const movableRow = document.querySelector('.field-row-movable');
const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button');
const scoreBoard = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const maxScoreBoard = document.getElementById('max-score');
let gameIsActive = false;

const gameState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const gameCells = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

const maxScore = localStorage.getItem('maxScore') || 0;

maxScoreBoard.textContent = maxScore;

let score = 0;

function clearField() {
  for (const row of gameCells) {
    for (const cell of row) {
      if (cell instanceof MovableCell) {
        cell.cell.remove();
      }
    }
  }

  for (let row = 0; row < TABLE_SIZE; row++) {
    for (let col = 0; col < 4; col++) {
      gameCells[row][col] = null;
    }
  }
}

function clearValues() {
  for (let row = 0; row < TABLE_SIZE; row++) {
    for (let col = 0; col < 4; col++) {
      gameState[row][col] = 0;
      cells[row * TABLE_SIZE + col].textContent = '';
      removeAllClassesExceptMain(cells[row * TABLE_SIZE + col], 'field-cell');
    }
  }
}

function updateMaxScore(scores) {
  const currentMaxScore = localStorage.getItem('maxScore');

  if (currentMaxScore === null || scores > parseInt(currentMaxScore)) {
    localStorage.setItem('maxScore', scores);
    maxScoreBoard.textContent = scores;
  }
}

class MovableCell {
  constructor(x, y) {
    const cell = document.createElement('td');

    cell.classList.add('movable-cell');
    movableRow.append(cell);
    this.cell = cell;
    this.x = x;
    this.y = y;
    this.cell.style.setProperty('--x', x);
    this.cell.style.setProperty('--y', y);
    this.cell.style.setProperty('top', 'calc(var(--x) * 75px + 10px + var(--x) * 10px)');
    this.cell.style.setProperty('left', 'calc(var(--y) * 75px + 10px + var(--y) * 10px)');

    this.cell.addEventListener('animationend', function() {
      cell.classList.remove('merged');
    });
  }

  setCoordinates(x, y) {
    this.cell.style.setProperty('--x', x);
    this.cell.style.setProperty('--y', y);
  }

  setValue(value) {
    this.value = value;
    this.cell.textContent = value;
    removeAllClassesExceptMain(this.cell, 'movable-cell');
    this.cell.classList.add(`movable-cell--${this.value}`);
  }
}

function movesRemain() {
  for (let row = TABLE_SIZE - 1; row > 0; row--) {
    for (let col = 0; col < TABLE_SIZE; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row - 1][col];

      if (currentCell === nextCell && currentCell && nextCell) {
        return true;
      }
    }
  }

  for (let row = 0; row < TABLE_SIZE - 1; row++) {
    for (let col = 0; col < TABLE_SIZE; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row + 1][col];

      if (currentCell === nextCell && currentCell && nextCell) {
        return true;
      }
    }
  }

  for (let row = 0; row < TABLE_SIZE; row++) {
    for (let col = TABLE_SIZE - 1; col > 0; col--) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row][col - 1];

      if (currentCell === nextCell && currentCell && nextCell) {
        return true;
      }
    }
  }

  for (let row = 0; row < TABLE_SIZE; row++) {
    for (let col = 0; col < TABLE_SIZE - 1; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row][col + 1];

      if (currentCell === nextCell && currentCell && nextCell) {
        return true;
      }
    }
  }

  return false;
}

function addRandomPlate() {
  const emptyCells = [];

  // Знаходимо порожні клітинки
  for (let row = 0; row < TABLE_SIZE; row++) {
    for (let col = 0; col < TABLE_SIZE; col++) {
      if (gameState[row][col] === 0) {
        emptyCells.push(
          {
            row,
            col,
          });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomValue = Math.random() < PERCENT_FOR_4
      ? SECONDATY_START_VALUE
      : MAIN_START_VALUE;

    gameState[randomCell.row][randomCell.col] = randomValue;

    const newCell = new MovableCell(randomCell.row, randomCell.col);

    newCell.setValue(randomValue);

    gameCells[randomCell.row][randomCell.col] = newCell;

    if (!movesRemain() && emptyCells.length === 1) {
      gameOver();
    }
  }
}

function removeAllClassesExceptMain(element, classNameToKeep) {
  const classList = element.classList;
  const classesToRemove = Array.from(classList).filter(className => className !== classNameToKeep);

  classesToRemove.forEach(className => classList.remove(className));
}

function startGame() {
  score = 0;
  scoreBoard.textContent = score;
  gameIsActive = true;

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  messageStart.classList.add('hidden');

  if (!messageWin.classList.contains('hidden')) {
    messageWin.classList.add('hidden');
  }

  if (!messageLose.classList.contains('hidden')) {
    messageLose.classList.add('hidden');
  }

  clearField();

  clearValues();

  addRandomPlate();
  addRandomPlate();
}

function gameOver() {
  gameIsActive = false;

  messageLose.classList.remove('hidden');
  updateMaxScore(score);
}

function gameWinner() {
  gameIsActive = false;

  messageWin.classList.remove('hidden');
  updateMaxScore(score);
}

startButton.addEventListener('click', startGame);

function mergeCells(row1, col1, row2, col2) {
  gameState[row2][col2] *= 2;
  gameState[row1][col1] = 0;

  gameCells[row1][col1].setCoordinates(row2, col2);

  // setTimeout(() => {
  //   gameCells[row2][col2].setValue(gameState[row2][col2]);
  //   gameCells[row1][col1].cell.remove();
  //   gameCells[row1][col1] = null;
  // }, 100);

  const currentCell = gameCells[row1][col1];

  gameCells[row2][col2].cell.remove();

  gameCells[row1][col1] = null;
  gameCells[row2][col2] = currentCell;
  gameCells[row2][col2].cell.classList.add('merged');
  gameCells[row2][col2].setValue(gameState[row2][col2]);

  score += gameState[row2][col2];
  scoreBoard.textContent = score;

  if (gameState[row2][col2] === VALUE_TO_WIN) {
    return gameWinner();
  }
}

function moveUp() {
  const isMerged = {};
  let changes = false;

  changes = moveCellsUp();

  moveCellsUp();

  for (let row = 1; row < TABLE_SIZE; row++) {
    for (let col = 0; col < TABLE_SIZE; col++) {
      const currentCell = gameState[row][col];

      if (isMerged[`${row}-${col}`] || !currentCell) {
        continue;
      }

      const nextCell = gameState[row - 1][col];

      if (currentCell === nextCell && currentCell && nextCell) {
        mergeCells(row, col, row - 1, col);
        isMerged[`${row - 1}-${col}`] = true;
        changes = true;
      }
    }
  }

  moveCellsUp();

  return changes;
}

function moveCellsUp() {
  let changes = false;

  for (let row = 1; row < TABLE_SIZE; row++) {
    for (let col = 0; col < TABLE_SIZE; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row - 1][col];

      if (currentCell && !nextCell) {
        moveCellUp(row, col);
        changes = true;
      }
    }
  }

  return changes;
}

function moveCellUp(row, col) {
  gameState[row - 1][col] = gameState[row][col];
  gameState[row][col] = 0;

  const previousPlate = gameCells[row][col];

  gameCells[row][col].setCoordinates(row - 1, col);
  gameCells[row][col] = null;

  gameCells[row - 1][col] = previousPlate;
}

function moveDown() {
  const isMerged = {};
  let changes = false;

  changes = moveCellsDown();

  moveCellsDown();

  for (let row = TABLE_SIZE - 1; row > 0; row--) {
    for (let col = 0; col < TABLE_SIZE; col++) {
      const currentCell = gameState[row][col];

      if (isMerged[`${row}-${col}`] || !currentCell) {
        continue;
      }

      const nextCell = gameState[row - 1][col];

      if (currentCell === nextCell && currentCell && nextCell) {
        mergeCells(row - 1, col, row, col);
        isMerged[`${row - 1}-${col}`] = true;
        changes = true;
      }
    }
  }

  moveCellsDown();

  return changes;
}

function moveCellsDown() {
  let changes = false;

  for (let row = TABLE_SIZE - 2; row >= 0; row--) {
    for (let col = 0; col < TABLE_SIZE; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row + 1][col];

      if (currentCell && !nextCell) {
        moveCellDown(row, col);
        changes = true;
      }
    }
  }

  return changes;
}

function moveCellDown(row, col) {
  gameState[row + 1][col] = gameState[row][col];
  gameState[row][col] = 0;

  const previousPlate = gameCells[row][col];

  gameCells[row][col].setCoordinates(row + 1, col);
  gameCells[row][col] = null;

  gameCells[row + 1][col] = previousPlate;
}

function moveRight() {
  const isMerged = {};
  let changes = false;

  changes = moveCellsRight();

  moveCellsRight();

  for (let row = 0; row < TABLE_SIZE; row++) {
    for (let col = TABLE_SIZE - 2; col >= 0; col--) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row][col + 1];

      if (isMerged[`${row}-${col}`]) {
        continue;
      }

      if (currentCell === nextCell && currentCell && nextCell) {
        mergeCells(row, col, row, col + 1);
        isMerged[`${row}-${col + 1}`] = true;
        changes = true;
      }
    }
  }

  moveCellsRight();

  return changes;
}

function moveCellsRight() {
  let changes = false;

  for (let row = 0; row < TABLE_SIZE; row++) {
    for (let col = TABLE_SIZE - 2; col >= 0; col--) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row][col + 1];

      if (currentCell && !nextCell) {
        moveCellRight(row, col);
        changes = true;
      }
    }
  }

  return changes;
}

function moveCellRight(row, col) {
  gameState[row][col + 1] = gameState[row][col];
  gameState[row][col] = 0;

  gameCells[row][col + 1] = gameCells[row][col];
  gameCells[row][col].setCoordinates(row, col + 1);

  gameCells[row][col] = null;
}

function moveLeft() {
  const isMerged = {};
  let changes = false;

  changes = moveCellsLeft();

  moveCellsLeft();

  for (let row = 0; row < TABLE_SIZE; row++) {
    for (let col = 1; col < TABLE_SIZE; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row][col - 1];

      if (isMerged[`${row}-${col}`]) {
        continue;
      }

      if (currentCell === nextCell && currentCell && nextCell) {
        mergeCells(row, col, row, col - 1);
        isMerged[`${row}-${col - 1}`] = true;
        changes = true;
      }
    }
  }

  moveCellsLeft();

  return changes;
}

function moveCellsLeft() {
  let changes = false;

  for (let row = 0; row < TABLE_SIZE; row++) {
    for (let col = 1; col < TABLE_SIZE; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row][col - 1];

      if (currentCell && !nextCell) {
        moveCellLeft(row, col);
        changes = true;
      }
    }
  }

  return changes;
}

function moveCellLeft(row, col) {
  gameState[row][col - 1] = gameState[row][col];
  gameState[row][col] = 0;

  gameCells[row][col - 1] = gameCells[row][col];
  gameCells[row][col].setCoordinates(row, col - 1);

  gameCells[row][col] = null;
}

document.addEventListener('keydown', key => {
  if (gameIsActive === true) {
    let change = false;

    switch (key.key) {
      case 'ArrowUp':
        change = moveUp();
        break;

      case 'ArrowDown':
        change = moveDown();
        break;

      case 'ArrowRight':
        change = moveRight();
        break;

      case 'ArrowLeft':
        change = moveLeft();
        break;
    }

    setTimeout(() => {
      if (change) {
        addRandomPlate();
      }
    }, 100);
  }
});
