/* eslint-disable max-len */
'use strict';

// const CELL_WIDTH = 75;
// const CELL_BORDER = 10;

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button');
const scoreBoard = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
let gameIsActive = false;

const gameState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;

// function setCoordinates(x, y, cell) {
//   cell.style.setProperty('--x', x);
//   cell.style.setProperty('--x', y);
// }

function movesRemain() {
  for (let row = 3; row > 0; row--) {
    for (let col = 0; col < 4; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row - 1][col];

      if (currentCell === nextCell && currentCell && nextCell) {
        return true;
      }
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row + 1][col];

      if (currentCell === nextCell && currentCell && nextCell) {
        return true;
      }
    }
  }

  for (let row = 0; row < 4; row++) {
    for (let col = 3; col > 0; col--) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row][col - 1];

      if (currentCell === nextCell && currentCell && nextCell) {
        return true;
      }
    }
  }

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
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
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
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

    gameState[randomCell.row][randomCell.col] = Math.random() < 0.1
      ? 4
      : 2;

    cells[randomCell.row * 4 + randomCell.col].textContent
    = gameState[randomCell.row][randomCell.col];

    const classToAdd = gameState[randomCell.row][randomCell.col] === 2
      ? 'field-cell--2'
      : 'field-cell--4';

    cells[randomCell.row * 4 + randomCell.col].classList.add(classToAdd);

    if (!movesRemain() && emptyCells.length === 1) {
      gameOver();
    }
  }
}

function removeAllClassesExceptMain(element, classNameToKeep) {
  const classList = element.classList;
  const classesToRemove = Array.from(classList).filter(className => className !== classNameToKeep);

  // Видаляємо всі класи, крім збереженого
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

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      gameState[row][col] = 0;
      cells[row * 4 + col].textContent = '';
      removeAllClassesExceptMain(cells[row * 4 + col], 'field-cell');
    }
  }

  addRandomPlate();
  addRandomPlate();
}

function gameOver() {
  gameIsActive = false;

  messageLose.classList.remove('hidden');
}

function gameWinner() {
  gameIsActive = false;

  messageWin.classList.remove('hidden');
}

startButton.addEventListener('click', startGame);

function mergeCells(row1, col1, row2, col2) {
  gameState[row2][col2] *= 2;
  gameState[row1][col1] = 0;

  cells[row2 * 4 + col2].textContent = gameState[row2][col2];
  cells[row1 * 4 + col1].textContent = gameState[row1][col1] === 0 ? '' : gameState[row1][col1];

  removeAllClassesExceptMain(cells[row2 * 4 + col2], 'field-cell');
  removeAllClassesExceptMain(cells[row1 * 4 + col1], 'field-cell');

  cells[row2 * 4 + col2].classList.add(`field-cell--${gameState[row2][col2]}`);

  score += gameState[row2][col2];
  scoreBoard.textContent = score;

  if (gameState[row2][col2] === 2048) {
    return gameWinner();
  }
}

// function moveUp() {
//   const isMerged = {};
//   let changes = false;

//   for (let row = 3; row > 0; row--) {
//     for (let col = 0; col < 4; col++) {
//       const currentCell = gameState[row][col];
//       const nextCell = gameState[row - 1][col];

//       if (isMerged[`${row}-${col}`]) {
//         continue;
//       }

//       if (currentCell === nextCell && currentCell && nextCell) {
//         mergeCells(row, col, row - 1, col);
//         isMerged[`${row - 1}-${col}`] = true;
//         changes = true;
//       } else if (currentCell && !nextCell) {
//         moveCellUp(row, col);
//         changes = true;
//       }
//     }
//   }

//   for (let row = 3; row > 0; row--) {
//     for (let col = 0; col < 4; col++) {
//       const currentCell = gameState[row][col];
//       const nextCell = gameState[row - 1][col];

//       if (currentCell && !nextCell) {
//         moveCellUp(row, col);
//       }
//     }
//   }

//   return changes;
// }

function moveUp() {
  const isMerged = {};
  let changes = false;

  changes = moveCellsUp();

  moveCellsUp();

  for (let row = 1; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row - 1][col];

      if (isMerged[`${row}-${col}`]) {
        continue;
      }

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

  for (let row = 1; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
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

  cells[(row - 1) * 4 + col].textContent = gameState[row - 1][col];
  cells[row * 4 + col].textContent = '';

  removeAllClassesExceptMain(cells[(row - 1) * 4 + col], 'field-cell');
  removeAllClassesExceptMain(cells[row * 4 + col], 'field-cell');

  cells[(row - 1) * 4 + col].classList.add(`field-cell--${gameState[row - 1][col]}`);
}

function moveDown() {
  const isMerged = {};
  let changes = false;

  changes = moveCellsDown();

  moveCellsDown();

  for (let row = 3; row > 0; row--) {
    for (let col = 0; col < 4; col++) {
      const currentCell = gameState[row][col];
      const nextCell = gameState[row - 1][col];

      if (isMerged[`${row}-${col}`]) {
        continue;
      }

      if (currentCell === nextCell && currentCell && nextCell) {
        mergeCells(row, col, row - 1, col);
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

  for (let row = 2; row >= 0; row--) {
    for (let col = 0; col < 4; col++) {
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

  cells[(row + 1) * 4 + col].textContent = gameState[row + 1][col];
  cells[row * 4 + col].textContent = '';

  removeAllClassesExceptMain(cells[(row + 1) * 4 + col], 'field-cell');
  removeAllClassesExceptMain(cells[row * 4 + col], 'field-cell');

  cells[(row + 1) * 4 + col].classList.add(`field-cell--${gameState[row + 1][col]}`);
}

function moveRight() {
  const isMerged = {};
  let changes = false;

  changes = moveCellsRight();

  moveCellsRight();

  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
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

  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
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

  cells[row * 4 + (col + 1)].textContent = gameState[row][col + 1];
  cells[row * 4 + col].textContent = '';

  removeAllClassesExceptMain(cells[row * 4 + (col + 1)], 'field-cell');
  removeAllClassesExceptMain(cells[row * 4 + col], 'field-cell');

  cells[row * 4 + (col + 1)].classList.add(`field-cell--${gameState[row][col + 1]}`);
}

function moveLeft() {
  const isMerged = {};
  let changes = false;

  changes = moveCellsLeft();

  moveCellsLeft();

  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
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

  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
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

  cells[row * 4 + (col - 1)].textContent = gameState[row][col - 1];
  cells[row * 4 + col].textContent = '';

  removeAllClassesExceptMain(cells[row * 4 + (col - 1)], 'field-cell');
  removeAllClassesExceptMain(cells[row * 4 + col], 'field-cell');

  cells[row * 4 + (col - 1)].classList.add(`field-cell--${gameState[row][col - 1]}`);
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
