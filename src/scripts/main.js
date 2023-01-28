'use strict';

let board = 0;
let score = 0;
const fieldCell = 4;
const start = document.querySelector('.start');
const restart = document.querySelector('.restart');
const messageStart = document.querySelector('.message__start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

restart.style.display = 'none';

start.addEventListener('click', () => {
  setTwo();
  setTwo();
  start.style.display = 'none';
  messageStart.style.display = 'none';
  restart.style.display = 'block';

  document.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'ArrowLeft':
        setTwo();
        slideLeft();
        break;
      case 'ArrowRight':
        setTwo();
        slideRight();
        break;
      case 'ArrowUp':
        setTwo();
        slideUp();
        break;
      case 'ArrowDown':
        setTwo();
        slideDown();
        break;

      default:
        break;
    }

    document.querySelector('.game-score').innerText = score;
  });
});

restart.addEventListener('click', () => {
  for (let i = 0; i < fieldCell; i++) {
    for (let j = 0; j < fieldCell; j++) {
      board[i][j] = 0;

      const tile = document.getElementById(`${i}-${j}`);

      tile.innerText = '';
      tile.classList = 'tile';
    }
  }

  score = 0;
  setTwo();
  setTwo();
  document.querySelector('.game-score').innerText = score;
  messageLose.classList.add('hidden');
});

window.onload = function() {
  setGame();
};

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < fieldCell; i++) {
    for (let j = 0; j < fieldCell; j++) {
      const tile = document.createElement('div');

      tile.id = `${i}-${j}`;

      const num = board[i][j];

      updateTile(tile, num);

      document.querySelector('.board').append(tile);
    }
  }
}

function isGameOver() {
  for (let i = 0; i < fieldCell; i++) {
    for (let j = 0; j < fieldCell; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }

  for (let i = 0; i < fieldCell; i++) {
    for (let j = 0; j < fieldCell - 1; j++) {
      if (board[i][j] === board[i][j + 1] || board[j][i] === board[j + 1][i]) {
        return false;
      }
    }
  }

  return true;
}

function hasEmptyTile() {
  for (let i = 0; i < fieldCell; i++) {
    for (let j = 0; j < fieldCell; j++) {
      if (board[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setTwo() {
  if (isGameOver()) {
    messageLose.classList.remove('hidden');

    return;
  }

  if (!hasEmptyTile()) {
    return;
  }

  let isfound = false;

  while (!isfound) {
    const rowRandom = Math.floor(Math.random() * fieldCell);
    const columnRandom = Math.floor(Math.random() * fieldCell);

    if (board[rowRandom][columnRandom] === 0) {
      board[rowRandom][columnRandom] = 2;

      const tile = document.getElementById(
        rowRandom.toString() + '-' + columnRandom.toString()
      );

      tile.innerText = '2';
      tile.classList.add('tile--2');
      isfound = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num;

    if (num <= 2048) {
      tile.classList.add('tile--' + num.toString());
    }

    if (num === 2048) {
      messageWin.classList.remove('hidden');
    }
  }
}

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  let copyRow = [...row];

  copyRow = filterZero(copyRow);

  for (let i = 0; i < copyRow.length; i++) {
    if (copyRow[i] === copyRow[i + 1]) {
      copyRow[i] *= 2;
      copyRow[i + 1] = 0;
      score += copyRow[i];
    }
  }

  copyRow = filterZero(copyRow);

  while (copyRow.length < fieldCell) {
    copyRow.push(0);
  }

  return copyRow;
}

function slideLeft() {
  for (let i = 0; i < fieldCell; i++) {
    let row = board[i];

    row = slide(row);
    board[i] = row;

    for (let j = 0; j < fieldCell; j++) {
      const tile = document.getElementById(`${i}-${j}`);
      const num = board[i][j];

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let i = 0; i < fieldCell; i++) {
    let row = board[i];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[i] = row;

    for (let j = 0; j < fieldCell; j++) {
      const tile = document.getElementById(`${i}-${j}`);
      const num = board[i][j];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let i = 0; i < fieldCell; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row = slide(row);

    for (let j = 0; j < fieldCell; j++) {
      board[j][i] = row[j];

      const tile = document.getElementById(`${j}-${i}`);
      const num = board[j][i];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let i = 0; i < fieldCell; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let j = 0; j < fieldCell; j++) {
      board[j][i] = row[j];

      const tile = document.getElementById(`${j}-${i}`);
      const num = board[j][i];

      updateTile(tile, num);
    }
  }
}
