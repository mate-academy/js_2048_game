'use strict';

const page = document.documentElement;

const messageLose = page.querySelector('.message-lose');
const messageWin = page.querySelector('.message-win');
const messageStart = page.querySelector('.message-start');
const buttonStartRestart = page.querySelector('.button');
const gameScore = page.querySelector('.game-score');
const fieldRows = page.querySelectorAll('.field-row');

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let copyBoard;

const sizeOfBoard = 4;
let score = 0;
let isWin = false;

const reset = () => {
  score = 0;

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  if (!messageWin.classList.contains('hidden')) {
    messageWin.classList.add('hidden');
  };

  if (!messageLose.classList.contains('hidden')) {
    messageLose.classList.add('hidden');
  }
};

const move = (ev) => {
  copyBoard = [...board];

  switch (ev.key) {
    case 'ArrowLeft':
      moveLeft(copyBoard);
      break;

    case 'ArrowRight':
      moveRight(copyBoard);
      break;

    case 'ArrowUp':
      moveUp(copyBoard);
      break;

    case 'ArrowDown':
      moveDown(copyBoard);
      break;

    default:
      return;
  };

  for (let r = 0; r < sizeOfBoard; r++) {
    for (let c = 0; c < sizeOfBoard; c++) {
      if (copyBoard[r][c] !== board[r][c]) {
        board = copyBoard;
        addNumber();
        render();
      }
    }
  };

  if (isWin) {
    messageWin.classList.remove('hidden');
  };

  if (!possibleToMove()) {
    messageLose.classList.remove('hidden');
    page.removeEventListener('click', move);
  };
};

buttonStartRestart.addEventListener('click', () => {
  page.addEventListener('keydown', move);

  if (buttonStartRestart.classList.contains('start')) {
    buttonStartRestart.textContent = 'Restart';
    buttonStartRestart.classList.replace('start', 'restart');
    messageStart.classList.add('hidden');
  } else {
    isWin = false;
    reset();
  }

  addNumber();
  addNumber();
  render();
});

const checkRows = () => {
  let isDuplicate = false;

  copyBoard.forEach(row => {
    if (row.some((cell, i) => cell === 0 || cell === row[i + 1])) {
      isDuplicate = true;
    }
  });

  return isDuplicate;
};

const checkColumns = () => {
  let isDuplicate = false;

  copyBoard.forEach(col => {
    col.forEach((cell, i) => {
      if (cell === col[i + 1]) {
        isDuplicate = true;
      }
    });
  });

  return isDuplicate;
};

const rowReverse = () => {
  copyBoard.forEach(row => row.reverse());
};

const movingBoard = () => {
  copyBoard = copyBoard[0].map((el, i) =>
    copyBoard.map(row => row[i]),
  );
};

const findEmptyCell = () => {
  const emptyCells = [];

  board.forEach((row, rI) => {
    row.forEach((cell, cI) => {
      if (cell === 0) {
        emptyCells.push([rI, cI]);
      }
    });
  });

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const possibleToMove = () => {
  if (checkRows()) {
    return true;
  }

  movingBoard();

  return checkColumns();
};

const addNumber = () => {
  const [randomX, randomY] = findEmptyCell();

  board[randomX][randomY] = Math.random() < 0.9 ? 2 : 4;
};

const moveLeft = () => {
  if (!checkRows) {
    return;
  }

  copyBoard = copyBoard.map((row) => {
    const newRow = row.filter(cell => cell !== 0);

    newRow.forEach((cell, i) => {
      if (cell === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow.splice(i + 1, 1);
        score += newRow[i];

        if (newRow[i] === 2048) {
          isWin = true;
        }
      }
    });

    return newRow.concat(Array(sizeOfBoard - newRow.length).fill(0));
  });
};

const moveRight = () => {
  if (!checkRows) {
    return;
  }

  rowReverse();
  moveLeft();
  rowReverse();
};

const moveUp = () => {
  movingBoard();
  moveLeft();
  movingBoard();
};

const moveDown = () => {
  movingBoard();
  moveRight();
  movingBoard();
};

const render = () => {
  board.forEach((row, rI) => {
    row.forEach((cell, cI) => {
      const elem = fieldRows[rI].children[cI];

      if (cell === 0) {
        elem.textContent = '';
        elem.className = 'field-cell';
      } else {
        elem.textContent = cell;
        elem.className = `field-cell field-cell--${cell}`;
      }
    });
  });

  gameScore.textContent = score;
};
