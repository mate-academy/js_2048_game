'use strict';

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
let scoreValue = score.innerText;
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');

let grid = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

let mergedCells = [
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
];

const gridSize = 4;

function updateGrid() {
  cells.forEach(function(cell, index) {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    const value = grid[y][x];

    cell.textContent = value !== null ? value : '';
    cell.className = 'field-cell';

    if (value !== null) {
      cell.classList.add('field-cell--' + value);
    }
  });
}

function generateNumber() {
  const emptyCells = [];

  grid.forEach(function(row, y) {
    row.forEach(function(value, x) {
      if (value === null) {
        emptyCells.push({
          x: x, y: y,
        });
      }
    });
  });

  if (emptyCells.length > 0) {
    const randomCell
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    grid[randomCell.y][randomCell.x] = newValue;
    updateGrid();
  }
  scoreInfo();
}

function initGame() {
  startMessage.classList.remove('hidden');
  loseMessage.classList.add('hidden');

  grid = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];

  mergedCells = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];

  generateNumber();
  generateNumber();
}

function handleKeyPress(keyEvent) {
  const key = keyEvent.key;

  if (key === 'ArrowUp') {
    moveUp();
  } else if (key === 'ArrowDown') {
    moveDown();
  } else if (key === 'ArrowLeft') {
    moveLeft();
  } else if (key === 'ArrowRight') {
    moveRight();
  }
}

function resetMergedCells() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      mergedCells[y][x] = false;
    }
  }
}

function scoreInfo() {
  let sumBall = 0;

  cells.forEach((el) => {
    sumBall += +el.innerText;
    scoreValue = sumBall;
  });
  scoreValue = sumBall;
  score.innerText = scoreValue;
}

function checkGameOver() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] === null) {
        return false;
      }
    }
  }

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize - 1; x++) {
      if (grid[y][x] === grid[y][x + 1]) {
        return false;
      }
    }
  }

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize - 1; y++) {
      if (grid[y][x] === grid[y + 1][x]) {
        return false;
      }
    }
  }

  startMessage.classList.add('hidden');
  loseMessage.classList.remove('hidden');

  return true;
}

function checkWin() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] === 2048) {
        startMessage.classList.add('hidden');
        winMessage.classList.remove('hidden');

        return true;
      }
    }
  }
}

function moveUp() {
  resetMergedCells();

  let moved = false;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 1; y < gridSize; y++) {
      if (grid[y][x] !== null) {
        const value = grid[y][x];
        let targetY = y;

        while (targetY > 0 && grid[targetY - 1][x] === null) {
          targetY--;
        }

        if (targetY > 0 && grid[targetY - 1][x] === value
          && !mergedCells[targetY - 1][x]) {
          grid[targetY - 1][x] *= 2;
          grid[y][x] = null;
          mergedCells[targetY - 1][x] = true;
          mergedCells[targetY][x] = false;
          moved = true;
        } else if (targetY !== y) {
          grid[targetY][x] = value;
          grid[y][x] = null;
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateNumber();
    updateGrid();
    checkGameOver();
    checkWin();
  }
}

function moveDown() {
  resetMergedCells();

  let moved = false;

  for (let x = 0; x < gridSize; x++) {
    for (let y = gridSize - 1; y >= 0; y--) {
      if (grid[y][x] !== null) {
        const value = grid[y][x];
        let targetY = y;

        while (targetY < gridSize - 1 && grid[targetY + 1][x] === null) {
          targetY++;
        }

        if (targetY < gridSize - 1 && grid[targetY + 1][x] === value
          && !mergedCells[targetY + 1][x]) {
          grid[targetY + 1][x] *= 2;
          grid[y][x] = null;
          mergedCells[targetY + 1][x] = true;
          mergedCells[targetY][x] = false;
          moved = true;
        } else if (targetY !== y) {
          grid[targetY][x] = value;
          grid[y][x] = null;
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateNumber();
    updateGrid();
    checkGameOver();
    checkWin();
  }
}

function moveLeft() {
  resetMergedCells();

  let moved = false;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 1; x < gridSize; x++) {
      if (grid[y][x] !== null) {
        const value = grid[y][x];
        let targetX = x;

        while (targetX > 0 && grid[y][targetX - 1] === null) {
          targetX--;
        }

        if (targetX > 0 && grid[y][targetX - 1] === value
          && !mergedCells[y][targetX - 1]) {
          grid[y][targetX - 1] *= 2;
          grid[y][x] = null;
          mergedCells[y][targetX - 1] = true;
          mergedCells[y][targetX] = false;
          moved = true;
        } else if (targetX !== x) {
          grid[y][targetX] = value;
          grid[y][x] = null;
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateNumber();
    updateGrid();
    checkGameOver();
    checkWin();
  }
}

function moveRight() {
  resetMergedCells();

  let moved = false;

  for (let y = 0; y < gridSize; y++) {
    for (let x = gridSize - 1; x >= 0; x--) {
      if (grid[y][x] !== null) {
        const value = grid[y][x];
        let targetX = x;

        while (targetX < gridSize - 1 && grid[y][targetX + 1] === null) {
          targetX++;
        }

        if (targetX < gridSize - 1 && grid[y][targetX + 1] === value
          && !mergedCells[y][targetX + 1]) {
          grid[y][targetX + 1] *= 2;
          grid[y][x] = null;
          mergedCells[y][targetX + 1] = true;
          mergedCells[y][targetX] = false;
          moved = true;
        } else if (targetX !== x) {
          grid[y][targetX] = value;
          grid[y][x] = null;
          moved = true;
        }
      }
    }
  }

  if (moved) {
    generateNumber();
    updateGrid();
    checkGameOver();
    checkWin();
    scoreInfo();
  }
}

const startButton = document.querySelector('.button.start');


startButton.addEventListener('click', function() {
  initGame();
  startMessage.classList.add('hidden');
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';
});

document.addEventListener('keydown', handleKeyPress);
