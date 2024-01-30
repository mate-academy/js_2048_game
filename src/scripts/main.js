'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;

const startBtn = document.querySelector('.start');
const scoreItem = document.querySelector('.game-score');
const restartBtn = document.querySelector('.restart');
const againBtn = document.querySelector('.again');
const containerLose = document.querySelector('.container-lose');

let bestScore = localStorage.getItem('2048-highScore') || 0;
const bestScoreElem = document.querySelector('.best-score');

bestScoreElem.textContent = bestScore;

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
againBtn.addEventListener('click', restartGame);

function startGame() {
  clearBoard();
  resetScore();
  setGame();
  startBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');
  document.querySelector('.message-start').classList.add('hidden');
}

function restartGame() {
  clearBoard();
  resetScore();
  startBtn.classList.remove('hidden');
  restartBtn.classList.add('hidden');
  containerLose.classList.add('hidden');
  document.querySelector('.message-start').classList.remove('hidden');
}

function clearBoard() {
  const boardElement = document.querySelector('.board');

  boardElement.innerHTML = '';
}

function resetScore() {
  score = 0;
  scoreItem.innerText = score;
}

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      document.querySelector('.board').append(tile);
    }
  }

  setNew();
  setNew();
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num.toString();

    if (num <= 2048) {
      tile.classList.add('tile--' + num.toString());
    } else {
      tile.classList.add('tile--2048');
    }
  }
  checkForWin();
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
    setNew();
  } else if (e.code === 'ArrowRight') {
    slideRight();
    setNew();
  } else if (e.code === 'ArrowUp') {
    slideUp();
    setNew();
  } else if (e.code === 'ArrowDown') {
    slideDown();
    setNew();
  }
  scoreItem.innerText = score;

  if (score > bestScore) {
    bestScore = score;
    bestScoreElem.textContent = bestScore;
    localStorage.setItem('2048-bestScore', bestScore);
  }
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(originalRow) {
  let row = [...originalRow];

  row = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    board[r] = row.reverse();

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function setNew() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const randomNum = Math.floor(Math.random() * 10);

      board[r][c] = randomNum === 0 ? 4 : 2;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = board[r][c];
      tile.classList.add('tile--' + board[r][c]);
      found = true;
    }
  }

  if (isGameOver()) {
    containerLose.classList.remove('hidden');
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function isGameOver() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 1; r++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function checkForWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        document.querySelector('.message-win').classList.remove('hidden');

        return true;
      }
    }
  }

  return false;
}
