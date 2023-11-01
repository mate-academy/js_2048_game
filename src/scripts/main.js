'use strict';

let score = 0;
const boardRows = 4;
const boardColumn = 4;
const board = [];

let touchStartX, touchStartY, touchEndX, touchEndY;
let slideDirection = '';

const rows = document.getElementsByTagName('tr');
const start = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

let keyInit = false;

function startGame() {
  const oldBoard = JSON.stringify(board);

  switch (slideDirection) {
    case 'up':
      slide('up');

      if (JSON.stringify(board) !== oldBoard) {
        setNumbers();
      }
      break;

    case 'down':
      slide('down');

      if (JSON.stringify(board) !== oldBoard) {
        setNumbers();
      }
      break;

    case 'left':
      slide('left');

      if (JSON.stringify(board) !== oldBoard) {
        setNumbers();
      }
      break;

    case 'right':
      slide('right');

      if (JSON.stringify(board) !== oldBoard) {
        setNumbers();
      }
      break;
  }

  addScore();
  keyInit = true;

  if (win()) {
    messageWin.classList.remove('hidden');
  }

  if (!canMove('up')
    && !canMove('down')
    && !canMove('right')
    && !canMove('left')) {
    messageLose.classList.remove('hidden');
  }
}

start.addEventListener('click', () => {
  board.length = 0;

  for (let r = 0; r < boardRows; r++) {
    const arr = [];

    for (let c = 0; c < boardColumn; c++) {
      arr.push(0);
    }
    board.push(arr);
  };

  if (!keyInit) {
    document.addEventListener('keydown', (keyEvent) => {
      slideDirection = getDirectionFromKey(keyEvent.key);
      startGame();
    });
  }

  setNumbers();
  setNumbers();
  score = 0;

  start.textContent = 'Restart';
  start.classList.add('restart');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
});

document.addEventListener('touchstart', (startEvent) => {
  touchStartX = startEvent.touches[0].clientX;
  touchStartY = startEvent.touches[0].clientY;
});

document.addEventListener('touchend', (endEvent) => {
  touchEndX = endEvent.changedTouches[0].clientX;
  touchEndY = endEvent.changedTouches[0].clientY;

  handleSwipe();
});

function getDirectionFromKey(key) {
  if (key === 'ArrowUp') {
    return 'up';
  } else if (key === 'ArrowDown') {
    return 'down';
  } else if (key === 'ArrowLeft') {
    return 'left';
  } else if (key === 'ArrowRight') {
    return 'right';
  }

  return '';
}

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  if (Math.max(absDeltaX, absDeltaY) < 100) {
    return;
  }

  if (absDeltaX > absDeltaY) {
    slideDirection = deltaX > 0 ? 'right' : 'left';
  } else {
    slideDirection = deltaY > 0 ? 'down' : 'up';
  }

  startGame();
}

function addScore() {
  const scoreOnPage = document.querySelector('.game-score');

  scoreOnPage.textContent = score;
}

function findEmpty() {
  for (const line of board) {
    const finds = line.some((element) => element === 0);

    if (finds) {
      return true;
    }
  };

  return false;
};

function getRandomNumber() {
  const randomNumber = Math.floor(Math.random() * 100);

  if (randomNumber < 10) {
    return 4;
  } else {
    return 2;
  }
};

function setNumbers() {
  if (!findEmpty()) {
    return;
  };

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * boardRows);
    const c = Math.floor(Math.random() * boardColumn);

    if (board[r][c] === 0) {
      board[r][c] = getRandomNumber();
      cellsAndNumbers();
      found = true;
    }
  }
};

function cellsAndNumbers() {
  for (let r = 0; r < board.length; r++) {
    const row = rows[r];
    const cells = row.getElementsByTagName('td');

    for (let c = 0; c < cells.length; c++) {
      const cell = cells[c];
      const number = board[r][c];

      updateTyle(cell, number);
    };
  };
};

function updateTyle(cell, number) {
  if (number) {
    cell.textContent = '';
    cell.textContent = `${number}`;
    cell.className = 'field-cell';
    cell.classList.add(`field-cell--${number}`);
  } else {
    cell.textContent = '';
    cell.className = 'field-cell';
  }
};

function slide(moveDerection) {
  for (let r = 0; r < boardRows; r++) {
    const column = [];

    for (let c = 0; c < boardColumn; c++) {
      let number = 0;

      if (moveDerection === 'right' || moveDerection === 'left') {
        number = board[r][c];
      } else {
        number = board[c][r];
      }
      column.push(number);
    }

    const result = sameCells(column, moveDerection);

    while (result.length < column.length) {
      if (moveDerection === 'right' || moveDerection === 'down') {
        result.unshift(0);
      } else {
        result.push(0);
      }
    };

    for (let i = 0; i < boardColumn; i++) {
      if (moveDerection === 'right' || moveDerection === 'left') {
        board[r][i] = result[i];
      } else {
        board[i][r] = result[i];
      }
    }
  };

  cellsAndNumbers();
};

function sameCells(column, moveDerection) {
  if (moveDerection === 'right' || moveDerection === 'down') {
    return column
      .reverse()
      .filter(n => n > 0)
      .map((num, i, arr) => {
        if (num === arr[i + 1]) {
          arr[i + 1] = 0;

          const res = num * 2;

          score += res;

          return res;
        } else {
          return num;
        }
      })
      .reverse()
      .filter(n => n > 0);
  } else {
    return column
      .filter(n => n > 0)
      .map((num, i, arr) => {
        if (num === arr[i + 1]) {
          arr[i + 1] = 0;

          const res = num * 2;

          score += res;

          return res;
        } else {
          return num;
        }
      })
      .filter(n => n > 0);
  }
};

function canMove(direction) {
  for (let r = 0; r < boardRows; r++) {
    for (let c = 0; c < boardColumn; c++) {
      const currentCell = board[r][c];
      let neighborCell;

      if (direction === 'up') {
        neighborCell = r > 0 ? board[r - 1][c] : undefined;
      } else if (direction === 'right') {
        neighborCell = c < boardColumn - 1 ? board[r][c + 1] : undefined;
      } else if (direction === 'down') {
        neighborCell = r < boardRows - 1 ? board[r + 1][c] : undefined;
      } else if (direction === 'left') {
        neighborCell = c > 0 ? board[r][c - 1] : undefined;
      }

      if (currentCell !== 0
        && (neighborCell === 0 || currentCell === neighborCell)) {
        return true;
      }
    }
  }

  return false;
}

function win() {
  if (board.some(rov => rov.some(cell => cell === 2048))) {
    return true;
  }

  return false;
}
