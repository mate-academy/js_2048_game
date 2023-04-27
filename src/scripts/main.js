'use strict';

const boardSize = 4;
const gameBoard = document.querySelector('.game-board');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const handlerSlide = e => {
  switch (e.code) {
    case 'ArrowLeft':
      if (slideLeft()) {
        setTimeout(function() {
          createTile();
        }, 200);
      }
      break;

    case 'ArrowRight':
      if (slideRight()) {
        setTimeout(function() {
          createTile();
        }, 200);
      }
      break;

    case 'ArrowDown':
      if (slideDown()) {
        setTimeout(function() {
          createTile();
        }, 200);
      }
      break;

    case 'ArrowUp':
      if (slideUp()) {
        setTimeout(function() {
          createTile();
        }, 200);
      }
      break;

    default:
      return true;
  }
};

window.onload = function() {
  createBoard();
};

function createBoard() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const cell = document.createElement('div');

      cell.classList.add('cell');
      gameBoard.append(cell);
    }
  }
}

button.addEventListener('click', e => {
  e.preventDefault();

  button.classList.remove('start');
  button.classList.add('restart');
  button.innerText = 'Restart';
  button.blur();

  getStart();
});

function getStart() {
  document.querySelectorAll('.tile')
    .forEach(tile => tile.remove());

  gameScore.innerText = 0;
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  document.addEventListener('keyup', handlerSlide);

  createTile();
  createTile();
};

function getWin() {
  messageWin.classList.remove('hidden');
  button.classList.remove('restart');
  button.classList.add('start');
  button.innerText = 'Start';
  document.removeEventListener('keyup', handlerSlide);
}

function createTile() {
  let y;
  let x;
  let found;

  do {
    y = Math.floor(Math.random() * boardSize);
    x = Math.floor(Math.random() * boardSize);
    found = !!document.getElementById(`${y}-${x}`);
  } while (found);

  const tile = document.createElement('div');
  const value = Math.random() < 0.9 ? 2 : 4;

  tile.id = `${y}-${x}`;
  tile.classList.add('tile', `tile--${value}`);
  tile.style.setProperty('--x', x);
  tile.style.setProperty('--y', y);
  tile.innerText = value;
  gameBoard.append(tile);

  if (checkGameOver()) {
    messageLose.classList.remove('hidden');
  }
}

function createValuesArray() {
  const values = [];

  for (let i = 0; i < boardSize; i++) {
    values[i] = [];

    for (let j = 0; j < boardSize; j++) {
      if (document.getElementById(`${i}-${j}`)) {
        values[i].push(document.getElementById(`${i}-${j}`).innerText);
      } else {
        values[i].push('');
      }
    }
  }

  return values;
}

function checkGameWin() {
  const values = createValuesArray();

  return values.some(arr => arr.includes('2048'));
}

function checkGameOver() {
  const values = createValuesArray();

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (!values[r][c] || canSlideTiles(values, r, c)) {
        return false;
      }
    }
  }

  return true;
}

function canSlideTiles(values, r, c) {
  if ((r > 0 && values[r][c] === values[r - 1][c])
  || (r < boardSize - 1 && values[r][c] === values[r + 1][c])
  || (c > 0 && values[r][c] === values[r][c - 1])
  || (c < boardSize - 1 && values[r][c] === values[r][c + 1])) {
    return true;
  }

  return false;
}

function horizontalMoveTile(tile, y, x) {
  tile.id = `${y}-${x}`;
  tile.style.setProperty('--x', x);
}

function horizontalMergeTiles(tile, y, x) {
  const value = +tile.innerText;

  document.getElementById(`${y}-${x}`).remove();
  tile.id = `${y}-${x}`;
  tile.innerText = +tile.innerText * 2;
  tile.style.setProperty('--x', x);
  tile.classList.remove(`tile--${value}`);
  tile.classList.add(`tile--${value * 2}`);
  gameScore.innerText = +gameScore.innerText + value * 2;

  if (checkGameWin()) {
    getWin();
  }
}

function verticalMoveTile(tile, y, x) {
  tile.id = `${y}-${x}`;
  tile.style.setProperty('--y', y);
}

function verticalMergeTiles(tile, y, x) {
  const value = +tile.innerText;

  document.getElementById(`${y}-${x}`).remove();
  tile.id = `${y}-${x}`;
  tile.innerText = +tile.innerText * 2;
  tile.style.setProperty('--y', y);
  tile.classList.remove(`tile--${value}`);
  tile.classList.add(`tile--${value * 2}`);
  gameScore.innerText = +gameScore.innerText + value * 2;

  if (checkGameWin()) {
    getWin();
  }
}

function slideLeft() {
  let tilesHaveMoved = false;

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const currentTile = document.getElementById(`${r}-${c}`);

      if (currentTile) {
        let x;
        let iterator = c;
        let nextValue = '';

        while (iterator > 0 && nextValue === '') {
          iterator--;

          const nextTile = document.getElementById(`${r}-${iterator}`);

          nextValue = (nextTile)
            ? +nextTile.innerText
            : '';
        }

        if (nextValue === +currentTile.innerText && nextValue !== '') {
          x = iterator;
          horizontalMergeTiles(currentTile, r, x);
        } else if (nextValue === '') {
          x = 0;
          horizontalMoveTile(currentTile, r, x);
        } else {
          x = iterator + 1;
          horizontalMoveTile(currentTile, r, x);
        }

        if (c !== x) {
          tilesHaveMoved = true;
        }
      }
    }
  }

  return tilesHaveMoved;
}

function slideRight() {
  let tilesHaveMoved = false;

  for (let r = 0; r < boardSize; r++) {
    for (let c = boardSize - 1; c >= 0; c--) {
      const currentTile = document.getElementById(`${r}-${c}`);

      if (currentTile) {
        let x;
        let iterator = c;
        let nextValue = '';

        while (iterator < boardSize - 1 && nextValue === '') {
          iterator++;

          const nextTile = document.getElementById(`${r}-${iterator}`);

          nextValue = (nextTile)
            ? +nextTile.innerText
            : '';
        }

        if (nextValue === +currentTile.innerText && nextValue !== '') {
          x = iterator;
          horizontalMergeTiles(currentTile, r, x);
        } else if (nextValue === '') {
          x = boardSize - 1;
          horizontalMoveTile(currentTile, r, x);
        } else {
          x = iterator - 1;
          horizontalMoveTile(currentTile, r, x);
        }

        if (c !== x) {
          tilesHaveMoved = true;
        }
      }
    }
  }

  return tilesHaveMoved;
}

function slideDown() {
  let tilesHaveMoved = false;

  for (let c = 0; c < boardSize; c++) {
    for (let r = boardSize - 1; r >= 0; r--) {
      const currentTile = document.getElementById(`${r}-${c}`);

      if (currentTile) {
        let y;
        let iterator = r;
        let nextValue = '';

        while (iterator < boardSize - 1 && nextValue === '') {
          iterator++;

          const nextTile = document.getElementById(`${iterator}-${c}`);

          nextValue = (nextTile)
            ? +nextTile.innerText
            : '';
        }

        if (nextValue === +currentTile.innerText && nextValue !== '') {
          y = iterator;
          verticalMergeTiles(currentTile, y, c);
        } else if (nextValue === '') {
          y = boardSize - 1;
          verticalMoveTile(currentTile, y, c);
        } else {
          y = iterator - 1;
          verticalMoveTile(currentTile, y, c);
        }

        if (r !== y) {
          tilesHaveMoved = true;
        }
      }
    }
  }

  return tilesHaveMoved;
}

function slideUp() {
  let tilesHaveMoved = false;

  for (let c = 0; c < boardSize; c++) {
    for (let r = 0; r < boardSize; r++) {
      const currentTile = document.getElementById(`${r}-${c}`);

      if (currentTile) {
        let y;
        let iterator = r;
        let nextValue = '';

        while (iterator > 0 && nextValue === '') {
          iterator--;

          const nextTile = document.getElementById(`${iterator}-${c}`);

          nextValue = (nextTile)
            ? +nextTile.innerText
            : '';
        }

        if (nextValue === +currentTile.innerText && nextValue !== '') {
          y = iterator;
          verticalMergeTiles(currentTile, y, c);
        } else if (nextValue === '') {
          y = 0;
          verticalMoveTile(currentTile, y, c);
        } else {
          y = iterator + 1;
          verticalMoveTile(currentTile, y, c);
        }

        if (r !== y) {
          tilesHaveMoved = true;
        }
      }
    }
  }

  return tilesHaveMoved;
}
