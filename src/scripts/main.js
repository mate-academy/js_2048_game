'use strict';

const startButton = document.querySelector('.start');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');

const size = 4;
let score = 0;
const gameBoard = [];

function initGame() {
  for (let r = 0; r < size; r++) {
    gameBoard[r] = [];

    for (let c = 0; c < size; c++) {
      gameBoard[r][c] = 0;
    }
  }
}

function generate() {
  const emptyCells = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gameBoard[r][c] === 0) {
        emptyCells.push({
          r,
          c,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    gameBoard[randCell.r][randCell.c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function refreshBoard() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cellValue = gameBoard[r][c];
      const cellIndex = r * size + c;
      const cellElement = cells[cellIndex];

      cellElement.textContent = cellValue || '';
      cellElement.className = 'field-cell';

      if (cellValue) {
        cellElement.classList.add(`field-cell--${cellValue}`);
      }
    }
  }
}

function updateScore(newScore) {
  score = newScore;
  gameScore.textContent = score;
}

function ifWinner() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gameBoard[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
};

function ifLooser() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gameBoard[r][c] === 0) {
        return false;
      }

      if (c !== size - 1
        && gameBoard[r][c] === gameBoard[r][c + 1]) {
        return false;
      }

      if (r !== size - 1
        && gameBoard[r][c] === gameBoard[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
};

function moveCommands(command) {
  let moved = false;

  function move(r, c, rCoord, cCoord) {
    let rCopy = r;
    let cCopy = c;
    const cellValue = gameBoard[rCopy][cCopy];

    if (cellValue) {
      let newRow = rCopy + rCoord;
      let newCol = cCopy + cCoord;

      while (
        newRow >= 0
        && newRow < size
        && newCol >= 0
        && newCol < size
      ) {
        const nextCellValue = gameBoard[newRow][newCol];

        if (!nextCellValue) {
          gameBoard[newRow][newCol] = cellValue;
          gameBoard[rCopy][cCopy] = 0;
          rCopy = newRow;
          cCopy = newCol;
          newRow += rCoord;
          newCol += cCoord;
          moved = true;
        } else
        if (nextCellValue === cellValue) {
          gameBoard[newRow][newCol] = cellValue * 2;
          gameBoard[rCopy][cCopy] = 0;
          updateScore(score + cellValue * 2);
          moved = true;

          if (gameBoard[newRow][newCol] === 2048) {
            winMsg.classList.remove('hidden');
          }
          break;
        } else {
          break;
        }
      }
    }
  }

  function moveUp() {
    for (let col = 0; col < size; col++) {
      for (let row = 1; row < size; row++) {
        move(row, col, -1, 0);
      }
    }
  }

  function moveDown() {
    for (let col = 0; col < size; col++) {
      for (let row = size - 2; row >= 0; row--) {
        move(row, col, 1, 0);
      }
    }
  }

  function moveLeft() {
    for (let row = 0; row < size; row++) {
      for (let col = 1; col < size; col++) {
        move(row, col, 0, -1);
      }
    }
  }

  function moveRight() {
    for (let row = 0; row < size; row++) {
      for (let col = size - 2; col >= 0; col--) {
        move(row, col, 0, 1);
      }
    }
  }

  switch (command) {
    case 'up':
      moveUp();
      break;
    case 'down':
      moveDown();
      break;
    case 'left':
      moveLeft();
      break;
    case 'right':
      moveRight();
      break;
  }

  if (moved) {
    generate();
    refreshBoard();

    if (ifLooser()) {
      loseMsg.classList.remove('hidden');
      startButton.classList.replace('restart', 'start');
      startButton.innerHTML = 'Restart';
    }

    if (ifWinner()) {
      winMsg.classList.remove('hidden');
    }
  }
}

startButton.addEventListener('click', (e) => {
  initGame();
  generate();
  generate();
  refreshBoard();
  updateScore(0);

  startButton.classList.replace('start', 'restart');
  startButton.innerHTML = 'Start';
  startMsg.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    moveCommands('up');
  } else if (e.key === 'ArrowDown') {
    moveCommands('down');
  } else if (e.key === 'ArrowLeft') {
    moveCommands('left');
  } else if (e.key === 'ArrowRight') {
    moveCommands('right');
  }
});
