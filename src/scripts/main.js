'use strict';

let gameStatus = 'off';
let score = 0;

const gameBoard = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

const startButton = document.getElementById('startGame');

const touchStartPos = {
  x: 0, y: 0,
};

const touchEndPos = {
  x: 0, y: 0,
};

function handleTouchStart(e) {
  touchStartPos.x = e.touches[0].clientX;
  touchStartPos.y = e.touches[0].clientY;
  e.preventDefault();
}

function handleTouchEnd(e) {
  touchEndPos.x = e.changedTouches[0].clientX;
  touchEndPos.y = e.changedTouches[0].clientY;
  handleSwipeGesture();
  e.preventDefault();
}

function handleTouchMove(e) {
  e.preventDefault();
}

function handleSwipeGesture() {
  const dx = touchEndPos.x - touchStartPos.x;
  const dy = touchEndPos.y - touchStartPos.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (Math.max(absDx, absDy) > 50) {
    if (absDx > absDy) {
      if (dx > 0) {
        moveRight();
      } else {
        moveLeft();
      }
    } else {
      if (dy > 0) {
        moveDown();
      } else {
        moveUp();
      }
    }
    showBoardToUser(gameBoard);
    isGameOver();
    isWin();
  }
}

function countScore(sum) {
  score += sum;

  const showScore = document.querySelector('.game-score');

  showScore.classList.add('zoom-in');

  showScore.addEventListener('animationend', () => {
    showScore.classList.remove('zoom-in');
  });

  showScore.textContent = score;
}

function gameOn() {
  gameStatus = 'on';

  startButton.textContent = 'Restart';

  const infoStart = document.querySelector('.message-start');

  infoStart.classList.add('hidden');
}

function gameOff() {
  gameStatus = 'off';

  startButton.textContent = 'Start';

  gameBoard.forEach(row => {
    row.fill(null);
  });

  showBoardToUser(gameBoard);

  const infoStart = document.querySelector('.message-start');

  infoStart.classList.remove('hidden');

  const infoLose = document.querySelector('.message-lose');

  infoLose.classList.add('hidden');

  const infoWin = document.querySelector('.message-win');

  infoWin.classList.add('hidden');

  score = 0;

  const showScore = document.querySelector('.game-score');

  showScore.textContent = score;
}

function randomRow(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  return Math.floor(Math.random() * (maxFloored - minCeiled)) + minCeiled;
}

function randomColumn(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  return Math.floor(Math.random() * (maxFloored - minCeiled)) + minCeiled;
}

function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateTiles() {
  let row, column;
  const randomNumber = Math.random();

  const tileValue = randomNumber < 0.1 ? 4 : 2;

  do {
    row = randomRow(0, 4);
    column = randomColumn(0, 4);
  } while (gameBoard[row][column] !== null);

  gameBoard[row][column] = tileValue;

  return waitFor(100);
}

function addTwoTiles() {
  generateTiles();
  generateTiles();
}

function showBoardToUser(board) {
  const table = document.querySelector('.game-field');

  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    for (let columnIndex = 0;
      columnIndex < board[rowIndex].length; columnIndex++) {
      const cellValue = board[rowIndex][columnIndex];

      const cell = table.rows[rowIndex].cells[columnIndex];

      cell.textContent = cellValue;

      const classesToRemove = [...cell.classList]
        .filter(className => className.startsWith('field-cell--'));

      classesToRemove.forEach(className => cell.classList.remove(className));

      if (cellValue != null) {
        cell.classList.add('field-cell--' + cellValue);
      };
    }
  }
}

document.getElementById('startGame').addEventListener('click', () => {
  if (gameStatus === 'on') {
    gameOff();
  } else {
    addTwoTiles();
    gameOn();
    showBoardToUser(gameBoard);
  };
});

function moveUp() {
  let registerAction = 0;

  for (let j = 0; j < gameBoard.length; j++) {
    for (let i = 1; i < gameBoard.length; i++) {
      if (gameBoard[i][j] != null) {
        let k = i - 1;

        while (k >= 0 && (gameBoard[k][j] === null
          || gameBoard[k][j] === gameBoard[i][j])) {
          if (gameBoard[k][j] === gameBoard[i][j]) {
            gameBoard[k][j] *= 2;

            countScore(gameBoard[k][j]);

            const cell = document.querySelector(`.game-field
            tr:nth-child(${k + 1})
            td:nth-child(${j + 1})`);

            cell.classList.add('zoom-in');

            cell.addEventListener('animationend', () => {
              cell.classList.remove('zoom-in');
            });

            gameBoard[i][j] = null;

            registerAction++;

            break;
          } else if (gameBoard[k][j] === null) {
            k--;
          }
        }

        if (k !== i - 1) {
          gameBoard[k + 1][j] = gameBoard[i][j];
          gameBoard[i][j] = null;

          registerAction++;
        }
      }
    }
  }

  if (registerAction !== 0) {
    generateTiles();
    registerAction = 0;
  }
}

function moveDown() {
  let registerAction = 0;

  for (let j = 0; j < gameBoard.length; j++) {
    for (let i = gameBoard.length - 2; i >= 0; i--) {
      if (gameBoard[i][j] != null) {
        let k = i + 1;

        while (k < gameBoard.length && (gameBoard[k][j] === null
          || gameBoard[k][j] === gameBoard[i][j])) {
          if (gameBoard[k][j] === gameBoard[i][j]) {
            gameBoard[k][j] *= 2;

            countScore(gameBoard[k][j]);

            const cell = document.querySelector(`.game-field
            tr:nth-child(${k + 1})
            td:nth-child(${j + 1})`);

            cell.classList.add('zoom-in');

            cell.addEventListener('animationend', () => {
              cell.classList.remove('zoom-in');
            });

            gameBoard[i][j] = null;

            registerAction++;

            break;
          } else if (gameBoard[k][j] === null) {
            k++;
          }
        }

        if (k !== i + 1) {
          gameBoard[k - 1][j] = gameBoard[i][j];
          gameBoard[i][j] = null;

          registerAction++;
        }
      }
    }
  }

  if (registerAction !== 0) {
    generateTiles();
    registerAction = 0;
  }
}

function moveLeft() {
  let registerAction = 0;

  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 1; j < gameBoard[i].length; j++) {
      if (gameBoard[i][j] !== null) {
        let k = j - 1;

        while (k >= 0 && (gameBoard[i][k] === null
          || gameBoard[i][k] === gameBoard[i][j])) {
          if (gameBoard[i][k] === gameBoard[i][j]) {
            gameBoard[i][k] *= 2;

            countScore(gameBoard[i][k]);

            const cell = document.querySelector(`.game-field
            tr:nth-child(${i + 1})
            td:nth-child(${k + 1})`);

            cell.classList.add('zoom-in');

            cell.addEventListener('animationend', () => {
              cell.classList.remove('zoom-in');
            });

            gameBoard[i][j] = null;

            registerAction++;

            break;
          } else if (gameBoard[i][k] === null) {
            k--;
          }
        }

        if (k !== j - 1) {
          gameBoard[i][k + 1] = gameBoard[i][j];
          gameBoard[i][j] = null;

          registerAction++;
        }
      }
    }
  }

  if (registerAction !== 0) {
    generateTiles();
    registerAction = 0;
  }
}

function moveRight() {
  let registerAction = 0;

  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = gameBoard[i].length - 2; j >= 0; j--) {
      if (gameBoard[i][j] !== null) {
        let k = j + 1;

        while (k < gameBoard[i].length && (gameBoard[i][k] === null
          || gameBoard[i][k] === gameBoard[i][j])) {
          if (gameBoard[i][k] === gameBoard[i][j]) {
            gameBoard[i][k] *= 2;

            countScore(gameBoard[i][k]);

            const cell = document.querySelector(`.game-field
            tr:nth-child(${i + 1})
            td:nth-child(${k + 1})`);

            cell.classList.add('zoom-in');

            cell.addEventListener('animationend', () => {
              cell.classList.remove('zoom-in');
            });

            gameBoard[i][j] = null;

            registerAction++;

            break;
          } else if (gameBoard[i][k] === null) {
            k++;
          }
        }

        if (k !== j + 1) {
          gameBoard[i][k - 1] = gameBoard[i][j];
          gameBoard[i][j] = null;

          registerAction++;
        }
      }
    }
  }

  if (registerAction !== 0) {
    generateTiles();
    registerAction = 0;
  }
}

function isGameOver() {
  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[i].length; j++) {
      if (gameBoard[i][j] === null) {
        return false;
      }

      if (
        (i > 0 && gameBoard[i][j] === gameBoard[i - 1][j])
        || (i < gameBoard.length - 1
          && gameBoard[i][j] === gameBoard[i + 1][j])
        || (j > 0 && gameBoard[i][j] === gameBoard[i][j - 1])
        || (j < gameBoard[i].length - 1
          && gameBoard[i][j] === gameBoard[i][j + 1])
      ) {
        return false;
      }
    }
  }

  const infoLose = document.querySelector('.message-lose');

  infoLose.classList.remove('hidden');
}

function isWin() {
  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[i].length; j++) {
      if (gameBoard[i][j] === 2048) {
        const infoWin = document.querySelector('.message-win');

        infoWin.classList.remove('hidden');
      }
    }
  }
}

document.addEventListener('keydown', keyEvent => {
  const up = keyEvent.key === 'ArrowUp' || keyEvent.key === 'w';
  const right = keyEvent.key === 'ArrowRight' || keyEvent.key === 'd';
  const down = keyEvent.key === 'ArrowDown' || keyEvent.key === 's';
  const left = keyEvent.key === 'ArrowLeft' || keyEvent.key === 'a';

  if (gameStatus === 'on') {
    if (up || right || down || left) {
      keyEvent.preventDefault();
    }

    switch (true) {
      case up:
        moveUp();
        break;

      case right:
        moveRight();
        break;

      case down:
        moveDown();
        break;

      case left:
        moveLeft();
        break;

      default:
    }

    showBoardToUser(gameBoard);
    isGameOver();
    isWin();
  }
});

const gameContainer = document.querySelector('.game-field');

gameContainer.addEventListener(
  'touchstart',
  handleTouchStart,
  { passive: false }
);

gameContainer.addEventListener(
  'touchmove',
  handleTouchMove,
  { passive: false }
);

gameContainer.addEventListener(
  'touchend',
  handleTouchEnd,
  { passive: false }
);
