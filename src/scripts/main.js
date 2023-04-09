'use strict';

const start = document.querySelector('.start');
const restart = document.querySelector('.restart');
const tableRows = document.querySelectorAll('tr');
const score = document.querySelector('.game-score');
const messageContainer = document.querySelector('.message-container');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

start.addEventListener('click', () => {
  messageContainer.style.display = 'none';
  start.hidden = true;
  restart.hidden = false;
  startMessage.hidden = true;

  addRandomNum();
  addRandomNum();
});

restart.addEventListener('click', () => {
  messageContainer.style.display = 'none';
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  score.textContent = '0';
  sumOfScore = 0;

  restartTable();
  addRandomNum();
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowUp') {
    moveUp();
    hasWon();
    hasLost();
  }

  if (e.key === 'ArrowRight') {
    moveRight();
    hasWon();
    hasLost();
  }

  if (e.key === 'ArrowDown') {
    moveDown();
    hasWon();
    hasLost();
  }

  if (e.key === 'ArrowLeft') {
    moveLeft();
    hasWon();
    hasLost();
  }
});

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function restartTable() {
  board.forEach(row => {
    row.splice(0, row.length, 0, 0, 0, 0);
  });

  addTileInCSS();
}

let sumOfScore = 0;

function updateScore(num) {
  sumOfScore += num;
  score.textContent = sumOfScore;

  score.insertAdjacentHTML('afterend', `
    <span class="score-update">+${num}</span>
  `);

  const nextSibling = score.nextElementSibling;

  setTimeout(() => {
    nextSibling.remove();
  }, 1000);
}

function deleteZero(row) {
  return row.filter(cell => cell !== 0);
}

function move(tr) {
  let row = deleteZero(tr);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      updateScore(row[i]);
    }
  }

  row = deleteZero(row);

  while (row.length < board.length) {
    row.push(0);
  }

  return row;
}

function hasEmptyTile() {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        return true;
      }
    }
  }

  return false;
}

function addRandomNum() {
  if (!hasEmptyTile()) {
    return;
  }

  while (true) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);

    if (board[row][col] === 0) {
      const random = Math.random() < 0.9 ? 2 : 4;

      board[row][col] = random;

      const randomCell = tableRows[row].children[col];

      randomCell.classList.add(`field-cell--${random}`);
      randomCell.textContent = random;

      break;
    }
  }
}

function addTileInCSS() {
  let canMove = false;

  for (let row = 0; row < board.length; row++) {
    const tr = board[row];

    const trChildren = tableRows[row].children;

    for (let col = 0; col < tr.length; col++) {
      const cell = trChildren[col];

      if (!tr[col] && cell.textContent !== '') {
        cell.classList.remove(`field-cell--${cell.textContent}`);
        cell.textContent = '';
        canMove = true;
      }

      if (tr[col]) {
        cell.classList.remove(`field-cell--${cell.textContent}`);
        cell.classList.add(`field-cell--${tr[col]}`);
        cell.textContent = tr[col];
      }
    }
  }

  if (canMove) {
    addRandomNum();
  }
}

function moveUp() {
  for (let col = 0; col < board.length; col++) {
    let row = [board[0][col], board[1][col], board[2][col], board[3][col]];

    row = move(row);
    board[0][col] = row[0];
    board[1][col] = row[1];
    board[2][col] = row[2];
    board[3][col] = row[3];
  }

  addTileInCSS();
}

function moveRight() {
  for (let r = 0; r < board.length; r++) {
    let row = board[r];

    row.reverse();
    row = move(row);
    row.reverse();
    board[r] = row;
  }

  addTileInCSS();
}

function moveDown() {
  for (let col = 0; col < board.length; col++) {
    let row = [board[0][col], board[1][col], board[2][col], board[3][col]];

    row.reverse();
    row = move(row);
    row.reverse();

    board[0][col] = row[0];
    board[1][col] = row[1];
    board[2][col] = row[2];
    board[3][col] = row[3];
  }

  addTileInCSS();
}

function moveLeft() {
  for (let r = 0; r < board.length; r++) {
    let row = board[r];

    row = move(row);
    board[r] = row;
  }

  addTileInCSS();
}

function hasWon() {
  board.forEach(row => {
    row.forEach(cell => {
      if (cell === 2048) {
        messageContainer.style.display = 'flex';
        winMessage.classList.remove('hidden');
      }
    });
  });
}

function hasLost() {
  if (!hasEmptyTile()) {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (col < board[row].length - 1
          && board[row][col] === board[row][col + 1]) {
          return true;
        }

        if (row < board.length - 1
          && board[row][col] === board[row + 1][col]) {
          return true;
        }
      }
    }

    messageContainer.style.display = 'flex';
    loseMessage.classList.remove('hidden');
  }
}
