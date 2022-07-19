'use strict';

const tbody = document.querySelector('tbody');
const field = new Array(tbody.children.length);
const button = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');
let started = false;

function getRandom(max) {
  return Math.trunc(Math.random() * max);
}

function findLastIndex(array, callback) {
  for (let i = array.length - 1; i >= 0; --i) {
    if (callback(array[i], i, array)) {
      return i;
    }
  }

  return -1;
}

function resetField() {
  for (let i = 0; i < field.length; ++i) {
    field[i] = new Array(tbody.children[i].children.length).fill(0);
  }
}

function draw() {
  for (let i = 0; i < field.length; ++i) {
    for (let j = 0; j < field[i].length; ++j) {
      tbody.children[i].children[j].innerText = '';
      tbody.children[i].children[j].className = 'field-cell';

      if (field[i][j]) {
        tbody.children[i].children[j].innerText = field[i][j];

        tbody.children[i].children[j]
          .classList.add(`field-cell--${field[i][j]}`);
      }
    }
  }
}

function spawn() {
  const availableCells = [];

  for (let i = 0; i < field.length; ++i) {
    for (let j = 0; j < field[i].length; ++j) {
      if (!field[i][j]) {
        availableCells.push(i * field[i].length + j);
      }
    }
  }

  const newIndex = availableCells[getRandom(availableCells.length)];

  field[Math.trunc(newIndex / field[0].length)][newIndex % field[0].length]
    = Math.random() >= 0.9 ? 4 : 2;
}

function resetGame() {
  resetField();
  spawn();
  spawn();

  started = true;
  score.innerText = 0;
}

function winGame(i, j) {
  if (field[i][j] === 2048) {
    winMessage.classList.remove('hidden');
    started = false;

    return true;
  }

  return false;
}

function moveDown() {
  let moved = false;

  for (let i = field.length - 1; i >= 0; --i) {
    for (let j = 0; j < field[i].length; ++j) {
      const nextBlock = findLastIndex(field.slice(0, i), value => value[j]);

      if (nextBlock === -1
        || (field[i][j] && field[i][j] !== field[nextBlock][j])) {
        continue;
      }

      const current = field[i][j];

      field[i][j] += field[nextBlock][j];
      field[nextBlock][j] = 0;
      moved = true;

      if (winGame(i, j)) {
        return;
      }

      if (!current) {
        --j;
      } else {
        score.innerText = +score.innerText + current * 2;
      }
    }
  }

  return moved;
}

function moveLeft() {
  let moved = false;

  for (let i = 0; i < field[0].length; ++i) {
    for (let j = 0; j < field.length; ++j) {
      const nextBlock = field[j].slice(i + 1).findIndex(value => value);

      if (nextBlock === -1
        || (field[j][i] && field[j][i] !== field[j][nextBlock + i + 1])) {
        continue;
      }

      const current = field[j][i];

      field[j][i] += field[j][nextBlock + i + 1];
      field[j][nextBlock + i + 1] = 0;
      moved = true;

      if (winGame(j, i)) {
        return;
      }

      if (!current) {
        --j;
      } else {
        score.innerText = +score.innerText + current * 2;
      }
    }
  }

  return moved;
}

function moveRight() {
  let moved = false;

  for (let i = field[0].length - 1; i >= 0; --i) {
    for (let j = 0; j < field.length; ++j) {
      const nextBlock = findLastIndex(field[j].slice(0, i), value => value);

      if (nextBlock === -1
        || (field[j][i] && field[j][i] !== field[j][nextBlock])) {
        continue;
      }

      const current = field[j][i];

      field[j][i] += field[j][nextBlock];
      field[j][nextBlock] = 0;
      moved = true;

      if (winGame(j, i)) {
        return;
      }

      if (!current) {
        --j;
      } else {
        score.innerText = +score.innerText + current * 2;
      }
    }
  }

  return moved;
}

function moveUp() {
  let moved = false;

  for (let i = 0; i < field.length; ++i) {
    for (let j = 0; j < field[i].length; ++j) {
      const nextBlock = field.slice(i + 1).findIndex(value => value[j]);

      if (nextBlock === -1
        || (field[i][j] && field[i][j] !== field[nextBlock + i + 1][j])) {
        continue;
      }

      const current = field[i][j];

      field[i][j] += field[nextBlock + i + 1][j];
      field[nextBlock + i + 1][j] = 0;
      moved = true;

      if (winGame(i, j)) {
        return;
      }

      if (!current) {
        --j;
      } else {
        score.innerText = +score.innerText + current * 2;
      }
    }
  }

  return moved;
}

function checkIsOver() {
  for (let i = 0; i < field.length; ++i) {
    for (let j = 0; j < field[i].length; ++j) {
      if (!field[i][j]) {
        return false;
      }

      if ((i > 0 && field[i][j] === field[i - 1][j])
        || (i < field.length - 1 && field[i][j] === field[i + 1][j])
        || (j > 0 && field[i][j] === field[i][j - 1])
        || (j < field[i].length - 1 && field[i][j] === field[i][j + 1])) {
        return false;
      }
    }
  }

  return true;
}

function loseGame() {
  if (checkIsOver()) {
    loseMessage.classList.remove('hidden');
    started = false;
  }
}

button.addEventListener('click', () => {
  for (const message of messages) {
    message.classList.add('hidden');
  }

  resetGame();
  draw();
});

document.addEventListener('keydown', keyboardEvent => {
  if (!started || !keyboardEvent.key.startsWith('Arrow')) {
    return;
  }

  button.classList.remove('start');
  button.classList.add('restart');
  button.innerText = 'Restart';

  let moved = false;

  switch (keyboardEvent.key) {
    case 'ArrowDown':
      moved = moved || moveDown();

      break;

    case 'ArrowLeft':
      moved = moved || moveLeft();

      break;

    case 'ArrowRight':
      moved = moved || moveRight();

      break;

    case 'ArrowUp':
      moved = moved || moveUp();
  }

  if (moved) {
    spawn();
  }

  draw();
  loseGame();
});
