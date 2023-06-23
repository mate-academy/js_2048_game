'use strict';

const cells = document.querySelectorAll('.field-cell');
const rows = document.querySelectorAll('.field-row');
const start = document.querySelector('.start');
const messages = document.querySelector('.message-container');
const scoreGame = document.querySelector('.game-score');
const grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function random(integer) {
  return Math.floor(Math.random() * integer);
};

function randomCell() {
  const twoFour = random(10);
  const x = random(4);
  const y = random(4);

  if (grid[x][y] === 0) {
    (twoFour < 9)
      ? grid[x][y] = 2
      : grid[x][y] = 4;

    return;
  }
  randomCell();
}

function createBoard() {
  let score = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      rows[i].cells[j].textContent = grid[i][j];
      score = score + grid[i][j];

      if (rows[i].cells[j].textContent === '0') {
        rows[i].cells[j].textContent = '';
      }
    }
  }
  scoreGame.textContent = score;

  cheker();
}

function cheker() {
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length - 1; j++) {
      if (grid[i][j] === 0) {
        count++;
      }

      if (grid[i][j] === grid[i][j + 1] && grid[i][j] > 0) {
        count++;
      }
    }

    const column = [
      grid[0][i],
      grid[1][i],
      grid[2][i],
      grid[3][i],
    ];

    for (let k = 0; k < column.length; k++) {
      if (column[k] === 0) {
        count++;
      }

      if (column[k] === column[k + 1]) {
        count++;
      }
    }
  }

  if (count === 0) {
    hidden('lose');
  }

  for (const cell of cells) {
    const className = cell.classList.item(1);

    if (className) {
      cell.classList.toggle(className);
    }

    cell.classList.add(`field-cell--${cell.textContent}`);

    if (cell.classList.contains('field-cell--2048')) {
      hidden('win');
    }
  }
}

function moveHorizontal(key) {
  for (let i = 0; i < grid.length; i++) {
    const filterRow = grid[i].filter(item => item !== 0);
    const filterValue = move(filterRow, key);

    if (filterValue.length >= 1) {
      if (key === 'ArrowLeft') {
        while (filterValue.length < 4) {
          filterValue.push(0);
        }
      }

      if (key === 'ArrowRight') {
        while (filterValue.length < 4) {
          filterValue.unshift(0);
        }
      }

      for (let j = 0; j < grid.length; j++) {
        grid[i][j] = filterValue[j];
      }
    }
  }
  randomCell();
  createBoard();
}

function moveVertical(key) {
  for (let i = 0; i < grid.length; i++) {
    const column = [
      grid[0][i],
      grid[1][i],
      grid[2][i],
      grid[3][i],
    ];
    const filterColumn = column.filter(item => item !== 0);
    const filterValue = move(filterColumn, key);

    if (key === 'ArrowUp') {
      while (filterValue.length < 4) {
        filterValue.push(0);
      }
    }

    if (key === 'ArrowDown') {
      while (filterValue.length < 4) {
        filterValue.unshift(0);
      }
    }

    grid[0][i] = filterValue[0];
    grid[1][i] = filterValue[1];
    grid[2][i] = filterValue[2];
    grid[3][i] = filterValue[3];
  }
  randomCell();
  createBoard();
}

function move(line, direction) {
  if (direction === 'ArrowDown' || direction === 'ArrowRight') {
    for (let i = line.length; i >= 0; i--) {
      if (line[i] === line[i - 1]) {
        line[i] += line[i - 1];
        line[i - 1] = 0;
      }
    }
  }

  if (direction === 'ArrowUp' || direction === 'ArrowLeft') {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === line[i + 1]) {
        line[i] += line[i + 1];
        line[i + 1] = 0;
      }
    }
  }

  return line.filter(item => item > 0);
}

document.addEventListener('keydown', e => {
  if (start.classList.contains('start')) {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      moveVertical(e.key);
      break;
    case 'ArrowDown':
      moveVertical(e.key);
      break;
    case 'ArrowRight':
      moveHorizontal(e.key);
      break;
    case 'ArrowLeft':
      moveHorizontal(e.key);
      break;
  }
});

function reset() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      grid[i][j] = 0;
    }
  }
}

messages.insertAdjacentHTML('beforeend', `
  <p class="message message-restart hidden">
    Press "Restart" to begin new game.
  </p>
`);

start.addEventListener('click', (e) => {
  if (start.classList.contains('start')) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.textContent = 'restart';
  }

  hidden('restart');
  reset();
  randomCell();
  randomCell();
  createBoard();
});

function hidden(message) {
  for (const mess of messages.children) {
    (mess.classList.contains(`message-${message}`))
      ? mess.classList.remove('hidden')
      : mess.classList.add('hidden');
  }
}
