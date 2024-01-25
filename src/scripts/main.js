'use strict';

const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rows = 4;
const cols = 4;
let score = 0;

const updateTile = (tile, num) => {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;
    tile.classList.add(`field-cell--${num}`);
  }
};

for (let r = 0; r < rows; r++) {
  const fieldRows = document.querySelectorAll('.field-row');
  const fieldRow = fieldRows[r];
  const fieldCells = fieldRow.querySelectorAll('.field-cell');

  for (let c = 0; c < cols; c++) {
    const tile = fieldCells[c];

    tile.id = r + '-' + c;

    const num = board[r][c];

    updateTile(tile, num);
  }
}

const renderBoard = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.getElementById(`${r}-${c}`);

      const num = board[r][c];

      updateTile(cell, num);
    }
  }
};

const setNumberToRundomCell = () => {
  const emptyCells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({
          row: r,
          col: c,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomNumber = Math.random();

    if (emptyCells.length === rows * cols) {
      let prevIndex;

      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const index = randomIndex === prevIndex ? 0 : randomIndex;
        const { row, col } = emptyCells[index];

        prevIndex = randomIndex;
        board[row][col] = 2;
      }
    } else {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      board[row][col] = randomNumber < 0.9 ? 2 : 4;
    }

    renderBoard();
  }
};

const filterZero = (row) => {
  const preparedRow = row.filter(num => num !== 0);

  return preparedRow;
};

const updateGameScore = (newScore) => {
  gameScore.innerText = newScore;
  gameScore.value = newScore;
};

const slide = (row) => {
  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  updateGameScore(score);

  newRow = filterZero(newRow);

  while (newRow.length < rows) {
    newRow.push(0);
  }

  return newRow;
};

const slideLeft = () => {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < cols; c++) {
      const ceil = document.getElementById(`${r}-${c}`);

      updateTile(ceil, board[r][c]);
    }
  }
};

const slideRigth = () => {
  for (let r = 0; r < rows; r++) {
    let row = board[r].reverse();

    row = slide(row).reverse();
    board[r] = row;

    for (let c = 0; c < cols; c++) {
      const ceil = document.getElementById(`${r}-${c}`);

      updateTile(ceil, board[r][c]);
    }
  }
};

const slideUp = () => {
  for (let c = 0; c < cols; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      board[r][c] = row[r];
      board[r][c] = row[r];
      board[r][c] = row[r];

      const ceil = document.getElementById(`${r}-${c}`);

      updateTile(ceil, board[r][c]);
    }
  }
};

const slideDown = () => {
  for (let c = 0; c < cols; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();

    row = slide(row).reverse();

    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    for (let r = 0; r < rows; r++) {
      const ceil = document.getElementById(`${r}-${c}`);

      updateTile(ceil, board[r][c]);
    }
  }
};

const resetGame = () => {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  setNumberToRundomCell();

  score = '';

  updateGameScore(score);

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
};

const hasAvailableMoves = () => {
  let isAvailable = false;

  for (let r = 0; r < rows; r++) {
    const row = board[r];

    for (let c = 0; c < cols - 1; c++) {
      if (row[c] === row[c + 1] || row[c] === 0) {
        isAvailable = true;
      }
    }
  }

  for (let c = 0; c < cols; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      if (row[r] === row[r + 1] || row[r] === 0) {
        isAvailable = true;
      }
    }
  }

  return isAvailable;
};

const hasWinCell = () => {
  let isWin = false;

  board.forEach(cell => {
    if (cell === 2048) {
      isWin = true;
    }
  });

  return isWin;
};

const setGame = () => {
  setNumberToRundomCell();

  messageStart.classList.add('hidden');

  document.addEventListener('keydown', ({ key }) => {
    if (key === 'ArrowLeft') {
      slideLeft();
      setNumberToRundomCell();
    }

    if (key === 'ArrowRight') {
      slideRigth();
      setNumberToRundomCell();
    }

    if (key === 'ArrowUp') {
      slideUp();
      setNumberToRundomCell();
    }

    if (key === 'ArrowDown') {
      slideDown();
      setNumberToRundomCell();
    }

    if (!hasAvailableMoves()) {
      messageLose.classList.remove('hidden');
    }

    if (hasWinCell()) {
      messageWin.classList.remove('hidden');
    }
  });
};

document.addEventListener('click', ({ target }) => {
  const start = target.closest('.start');
  const restart = target.closest('.restart');

  if (start) {
    setGame();

    start.classList.remove('start');
    start.classList.add('restart');
    start.innerText = 'Restart';
    start.style.fontSize = '18px';
  }

  if (restart) {
    resetGame();
  }
});
