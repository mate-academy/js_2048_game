'use strict';

const tbody = document.querySelector('tbody');
const scoreInfo = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWon = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const button = document.querySelector('button');

let grid;
let score = 0;

function isGameWon() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function isGameOver() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        return false;
      }

      if (i !== 3 && grid[i][j] === grid[i + 1][j]) {
        return false;
      }

      if (j !== 3 && grid[i][j] === grid[i][j + 1]) {
        return false;
      }
    }
  }

  return true;
}

function blankGrid() {
  return [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function createBoard() {
  grid = blankGrid();
  generateNumber();
  generateNumber();
}

function generateNumber() {
  const options = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push([i, j]);
      }
    }
  }

  if (options.length > 0) {
    const cell = options[Math.floor(Math.random() * options.length + 0)];
    const random = Math.random();

    grid[cell[0]][cell[1]] = random > 0.9 ? 4 : 2;
    updateBoard();
  };
}

function compare(a, b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (a[i][j] !== b[i][j]) {
        return true;
      }
    }
  }

  return false;
}

function copyGrid(grid) {
  const extra = blankGrid();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      extra[i][j] = grid[i][j];
    }
  }

  return extra;
}

function flipGrid(grid) {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse();
  }

  return grid;
}

function rotateGrid(grid) {
  const newGrid = blankGrid();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i];
    }
  }

  return newGrid;
}

function keyPressed() {
  addEventListener('keydown', e => {
    let flipped = false;
    let rotated = false;
    let played = true;

    switch (e.code) {
      case 'ArrowRight':
        break;
      case 'ArrowLeft':
        grid = flipGrid(grid);
        flipped = true;
        break;
      case 'ArrowDown':
        grid = rotateGrid(grid);
        rotated = true;
        break;
      case 'ArrowUp':
        grid = rotateGrid(grid);
        grid = flipGrid(grid);
        rotated = true;
        flipped = true;
        break;
      default:
        played = false;
    }

    if (played) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.innerHTML = 'Restart';

      const past = copyGrid(grid);

      for (let i = 0; i < 4; i++) {
        grid[i] = operate(grid[i]);
      }

      const changed = compare(past, grid);

      if (flipped) {
        grid = flipGrid(grid);
      }

      if (rotated) {
        grid = rotateGrid(grid);
        grid = rotateGrid(grid);
        grid = rotateGrid(grid);
      }

      if (changed) {
        generateNumber();
        updateBoard();
      }

      const gameOver = isGameOver();

      if (gameOver) {
        messageLose.classList.remove('hidden');
      }

      const gameWon = isGameWon();

      if (gameWon) {
        messageWon.classList.remove('hidden');
      }
    }
  });
}
// keyPressed();

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);

  return row;
}

function slide(row) {
  let arr = row.filter(num => num);
  const missing = 4 - arr.length;
  const zeros = Array(missing).fill(0);

  arr = zeros.concat(arr);

  return arr;
}

function combine(row) {
  for (let i = 3; i >= 1; i--) {
    const a = row[i];
    const b = row[i - 1];

    if (a === b) {
      row[i] = a + b;
      score += row[i];
      scoreInfo.innerHTML = score;

      row[i - 1] = 0;
    }
  }

  return row;
}

function updateBoard() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] !== 0) {
        tbody.children[i].children[j].classList
          .remove(`field-cell--${tbody.children[i].children[j].innerHTML}`);

        tbody.children[i].children[j].classList
          .add(`field-cell--${grid[i][j]}`);
        tbody.children[i].children[j].innerHTML = grid[i][j];
      }

      if (grid[i][j] === 0) {
        tbody.children[i].children[j].className = 'field-cell';
        tbody.children[i].children[j].innerHTML = '';
      }
    }
  }
}

function startGame() {
  keyPressed();

  button.addEventListener('click', e => {
    if (button.classList.contains(('start'))
      && !button.classList.contains(('clicked'))) {
      createBoard();
      messageStart.classList.add('hidden');
      button.classList.add('clicked');
    }

    if (button.classList.contains('restart')) {
      messageStart.classList.remove('hidden');

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          tbody.children[i].children[j].innerHTML = '';
          tbody.children[i].children[j].className = 'field-cell';
          button.classList.remove('clicked');
          scoreInfo.innerHTML = 0;
          score = 0;
        }
      }
      button.classList.remove('restart');
      button.classList.add('start');
      button.innerHTML = 'Start';
    }
  });
}

startGame();
