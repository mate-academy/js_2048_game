'use strict';

let score = 0;
let best = 0;
const rows = 4;
const columns = 4;
let board = Array.from({ length: rows }, () => new Array(columns).fill(0));
const start = document.getElementById('startbutton');
const restart = document.getElementById('restartbutton');

window.onload = function() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      document.getElementById('board').append(tile);
    }
  }

  restart.style.display = 'none';
};

start.addEventListener('click', setStart);
restart.addEventListener('click', reStart);

function reStart() {
  restart.style.display = 'none';

  setStart();

  document.getElementById('startbutton').style.display = 'flex';
  document.getElementById('restartbutton').style.display = 'none';
}

function setStart() {
  const elements = document.getElementsByClassName('tile');

  document.addEventListener('keyup', handleKeyUp);

  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }

  board = Array.from({ length: rows }, () => new Array(columns).fill(0));

  document.getElementById('loser').classList.add('hidden');
  document.getElementById('winner').classList.add('hidden');
  document.getElementById('start').classList.add('hidden');
  document.getElementById('startbutton').style.display = 'none';
  document.getElementById('restartbutton').style.display = 'flex';

  setGame();
}

function setGame() {
  const columnId = [];
  const rowID = [];

  while (columnId.length < 1) {
    const number = Math.floor(Math.random() * 4);

    if (!columnId.includes(number) && !rowID.includes(number)) {
      columnId.push(number);
    }
  }

  while (rowID.length < 1) {
    const number = Math.floor(Math.random() * 4);

    if (!columnId.includes(number) && !rowID.includes(number)) {
      rowID.push(number);
    }
  }

  columnId.forEach((numberColumn) => {
    rowID.forEach((numberRow) => {
      board[numberColumn][numberRow] = 2;
      board[numberRow][numberColumn] = 2;
    });
  });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      document.getElementById('board').append(tile);
    }
  }

  score = 0;
  document.getElementById('score').innerText = score;
}

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        return false;
      }

      if (i > 0 && board[i][j] === board[i - 1][j]) {
        return false;
      }

      if (j > 0 && board[i][j] === board[i][j - 1]) {
        return false;
      }
    }
  }

  return true;
}

function hasEmptyTile() {
  let hasZero = false;

  board.forEach(row => {
    row.forEach(cell => {
      if (cell === 0) {
        hasZero = true;
      }
    });
  });

  return hasZero;
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = 2;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = '2';

      tile.classList.add('x2');

      found = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num;

    if (num <= 4096) {
      tile.classList.add('x' + num.toString());
    } else {
      tile.classList.add('x8192');
    }
  }

  if (num === 2048) {
    document.getElementById('winner').classList.remove('hidden');
    document.getElementById('start').classList.add('hidden');
    document.getElementById('loser').classList.add('hidden');
    document.getElementById('startbutton').style.display = 'flex';
    document.getElementById('restartbutton').style.display = 'none';
  }
}

function handleKeyUp(e) {
  if (e.code === 'ArrowLeft') {
    slideLeft();
    setTwo();
  } else if (e.code === 'ArrowRight') {
    slideRight();
    setTwo();
  } else if (e.code === 'ArrowUp') {
    slideUp();
    setTwo();
  } else if (e.code === 'ArrowDown') {
    slideDown();
    setTwo();
  }

  if (isGameOver()) {
    document.getElementById('loser').classList.add('hidden');
    document.getElementById('winner').classList.add('hidden');
    document.getElementById('start').classList.remove('hidden');
    document.getElementById('startbutton').style.display = 'unset';
    document.getElementById('restartbutton').style.display = 'none';
    throw new Error('Something went wrong.');
  }

  document.getElementById('score').innerText = score;
  document.getElementById('best').innerText = best;
}

function filterZero(row) {
  return row.filter((number) => {
    return number !== 0;
  });
}

function slide(row) {
  document.getElementById('restartbutton').style.display = 'flex';
  document.getElementById('startbutton').style.display = 'none';

  let rowSecond = filterZero(row);

  rowSecond.forEach((value, i) => {
    if (i < rowSecond.length - 1 && rowSecond[i] === rowSecond[i + 1]) {
      rowSecond[i] *= 2;
      rowSecond[i + 1] = 0;

      score += rowSecond[i];

      if (score > best) {
        best = score;
      }
    }
  });

  rowSecond = filterZero(rowSecond);

  while (rowSecond.length < columns) {
    rowSecond.push(0);
  }

  return rowSecond;
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

    row.reverse();

    board[r] = row;

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
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    for (let r = 0; r < rows; r++) {
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
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    for (let r = 0; r < rows; r++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}
