'use strict';

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const cellsArray = Array.from(cells);
let score = 0;
const startMessage = document.querySelector('.message.message-start');
const winMessage = document.querySelector('.message.message-win.hidden');
const loseMessage = document.querySelector('.message.message-lose.hidden');

function startGame() {
  startMessage.className = 'message message-start hidden';
  winMessage.className = 'message message-win hidden';
  loseMessage.className = 'message message-lose hidden';
  startButton.className = 'button restart';
  startButton.textContent = 'Restart';
  score = 0;
  scoreElement.textContent = score;

  for (let i = 0; i < cells.length; i++) {
    cells[i].textContent = '';
  }

  addNumbers();
  styleCells();
}

function getRandomNumber() {
  return Math.random() < 0.1 ? 4 : 2;
}

function addNumbers() {
  const number1 = getRandomNumber();
  const number2 = getRandomNumber();

  const cell1 = getRandomEmptyCell(cellsArray);
  let cell2 = getRandomEmptyCell(cellsArray);

  if (cell2 === cell1) {
    cell2 = getRandomEmptyCell(cellsArray);
  }

  cell1.textContent = number1;
  cell2.textContent = number2;
}

function getRandomEmptyCell(array) {
  const emptyCells = array.filter(cell => !cell.textContent);
  const randomCellIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomCellIndex];

  return randomCell;
}

function styleCells() {
  for (let i = 0; i < cells.length; i++) {
    const value = cells[i].textContent;

    cells[i].className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  }
}

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', makeMove);

function makeMove(e) {
  e.preventDefault();

  switch (e.code) {
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
    default:
      break;
  }
}

function moveValueToCell(sourceCell, targetCell) {
  const value = parseInt(sourceCell.textContent);

  if (isNaN(value)) {
    sourceCell.textContent = '';
    sourceCell.className = 'field-cell';

    return;
  }

  targetCell.textContent = value;
  sourceCell.textContent = '';
  sourceCell.className = 'field-cell';
  targetCell.className = `field-cell field-cell--${value}`;
}

function mergeCells(sourceCell, targetCell) {
  const value = parseInt(sourceCell.textContent);
  const targetValue = parseInt(targetCell.textContent);

  if (isNaN(value) || isNaN(targetValue)) {
    return;
  }

  if (value === targetValue) {
    const newValue = value + targetValue;

    targetCell.textContent = newValue;
    sourceCell.textContent = '';
    sourceCell.className = 'field-cell';
    targetCell.className = `field-cell field-cell--${newValue}`;
    score += newValue;
    scoreElement.textContent = score;

    if (newValue === 2048) {
      winMessage.classList.remove('hidden');
    }
  }
}

function moveUp() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      const currentCell = cells[row * 4 + col];

      if (currentCell.textContent) {
        let targetRow = row - 1;

        while (targetRow >= 0 && !cells[targetRow * 4 + col].textContent) {
          targetRow--;
        }

        if (targetRow === -1) {
          moveValueToCell(currentCell, cells[col]);
          moved = true;
        } else if (
          cells[targetRow * 4 + col].textContent === currentCell.textContent
        ) {
          mergeCells(currentCell, cells[targetRow * 4 + col]);
          moved = true;
        } else {
          if (targetRow + 1 !== row) {
            moveValueToCell(currentCell, cells[(targetRow + 1) * 4 + col]);
            moved = true;
          }
        }
      }
    }
  }

  if (moved) {
    addNumbers();
    styleCells();
    checkGameOver();
  }
}

function moveDown() {
  let moved = false;

  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      const currentCell = cells[row * 4 + col];

      if (currentCell.textContent) {
        let targetRow = row + 1;

        while (targetRow < 4 && !cells[targetRow * 4 + col].textContent) {
          targetRow++;
        }

        if (targetRow === 4) {
          moveValueToCell(currentCell, cells[3 * 4 + col]);
          moved = true;
        } else if (
          cells[targetRow * 4 + col].textContent === currentCell.textContent
        ) {
          mergeCells(currentCell, cells[targetRow * 4 + col]);
          moved = true;
        } else {
          if (targetRow - 1 !== row) {
            moveValueToCell(currentCell, cells[(targetRow - 1) * 4 + col]);
            moved = true;
          }
        }
      }
    }
  }

  if (moved) {
    addNumbers();
    styleCells();
    checkGameOver();
  }
}

function moveLeft() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
      const currentCell = cells[row * 4 + col];

      if (currentCell.textContent) {
        let targetCol = col - 1;

        while (targetCol >= 0 && !cells[row * 4 + targetCol].textContent) {
          targetCol--;
        }

        if (targetCol === -1) {
          moveValueToCell(currentCell, cells[row * 4]);
          moved = true;
        } else if (
          cells[row * 4 + targetCol].textContent === currentCell.textContent
        ) {
          mergeCells(currentCell, cells[row * 4 + targetCol]);
          moved = true;
        } else {
          if (targetCol + 1 !== col) {
            moveValueToCell(currentCell, cells[row * 4 + targetCol + 1]);
            moved = true;
          }
        }
      }
    }
  }

  if (moved) {
    addNumbers();
    styleCells();
    checkGameOver();
  }
}

function moveRight() {
  let moved = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      const currentCell = cells[row * 4 + col];

      if (currentCell.textContent) {
        let targetCol = col + 1;

        while (targetCol < 4 && !cells[row * 4 + targetCol].textContent) {
          targetCol++;
        }

        if (targetCol === 4) {
          moveValueToCell(currentCell, cells[row * 4 + targetCol - 1]);
          moved = true;
        } else if (
          cells[row * 4 + targetCol].textContent === currentCell.textContent
        ) {
          mergeCells(currentCell, cells[row * 4 + targetCol]);
          moved = true;
        } else {
          if (targetCol - 1 !== col) {
            moveValueToCell(currentCell, cells[row * 4 + targetCol - 1]);
            moved = true;
          }
        }
      }
    }
  }

  if (moved) {
    addNumbers();
    styleCells();
    checkGameOver();
  }
}

function checkGameOver() {
  let hasAvailableMoves = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const currentCell = cells[row * 4 + col];

      if (!currentCell.textContent) {
        hasAvailableMoves = true;
        break;
      }

      if (
        (row > 0 && cells[(row - 1) * 4 + col]
          .textContent === currentCell.textContent)
        || (row < 3 && cells[(row + 1) * 4 + col]
          .textContent === currentCell.textContent)
        || (col > 0 && cells[row * 4 + col - 1]
          .textContent === currentCell.textContent)
        || (col < 3 && cells[row * 4 + col + 1]
          .textContent === currentCell.textContent)
      ) {
        hasAvailableMoves = true;
        break;
      }
    }
  }

  if (!hasAvailableMoves) {
    loseMessage.classList.remove('hidden');
  }
}
