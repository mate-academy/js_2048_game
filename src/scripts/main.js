'use strict';

// write your code here

const page = document.documentElement;
const cells = page.querySelectorAll('.field-cell');
const button = page.querySelectorAll('.button');
const message = page.querySelectorAll('.message');
const score = page.getElementsByClassName('game-score')[0];

const newGameBoard = [];
const gameBoard = Array(16).fill(0);
let gameScore = 0;
let gameWin = false;
let gameEnd = false;
let movement = false;

button[0].addEventListener('click', () => {
  if (button[0].innerHTML === 'Start') {
    button[0].innerHTML = 'Restart';
    button[0].className = 'button restart';

    message.forEach(elem => {
      elem.classList.add('hidden');
    });
  } else {
    gameEnd = false;
    gameReset();
  }

  addCells();
  addTag();

  document.addEventListener('keydown', e => {
    move(e.key);
  });
});

function move(direction) {
  switch (direction) {
    case 'ArrowUp':
      goUp();
      break;
    case 'ArrowDown':
      goDown();
      break;
    case 'ArrowRight':
      goRight();
      break;
    case 'ArrowLeft':
      goLeft();
      break;
  }

  if (gameEnd) {
    message[0].classList.remove('hidden');
    document.removeEventListener('keydown');

    return;
  }

  if (gameWin) {
    message[1].classList.remove('hidden');
    document.removeEventListener('keydown');

    return;
  }

  if (movement) {
    addCell();
    addTag();
    score.innerHTML = gameScore;
    movement = false;
  }
}

function goLeft() {
  const chunkSize = 4;

  for (let i = 0; i < gameBoard.length; i += chunkSize) {
    const chunk = gameBoard.slice(i, i + chunkSize).filter(elem => elem !== 0);

    for (let j = 0; j < chunk.length - 1; j++) {
      if (chunk[j] === chunk[j + 1]) {
        chunk[j] = chunk[j] * 2;
        chunk.splice(j + 1, 1);
        gameScore += chunk[j];
        j += 1;

        if (chunk[j] === 2048) {
          gameWin = true;
        }
      }
    }

    chunk.concat(Array(4 - chunk.length).fill(0)).forEach(elem => {
      newGameBoard.push(elem);
    });
  }

  if (!arraysEqual(gameBoard, newGameBoard)) {
    gameBoard.forEach((elem, k) => {
      gameBoard[k] = newGameBoard[k];
    });
    movement = true;
  } else if (arraysEqual(gameBoard, newGameBoard)
    && newGameBoard.filter(elem => elem > 0).length === newGameBoard.length) {
    gameEnd = true;
  }

  newGameBoard.length = 0;
}

function goRight() {
  reverse();
  reverse();
  goLeft();
  reverse();
  reverse();
}

function goDown() {
  reverse();
  goLeft();
  reverse();
  reverse();
  reverse();
}

function goUp() {
  reverse();
  reverse();
  reverse();
  goLeft();
  reverse();
}

function reverse() {
  const tempGameBoard = Array(16).fill(0);
  let k = 0;

  for (let i = 3; i > -1; i--) {
    for (let j = 0; j < 4; j++) {
      tempGameBoard[j + k * 4] = gameBoard[15 - i - j * 4];
    }
    k += 1;
  }

  gameBoard.forEach((elem, i) => {
    gameBoard[i] = tempGameBoard[i];
  });
}

function sampleRange(range, n) {
  const sample = [];

  for (let i = 0; i < n; i++) {
    sample.push(range.splice(Math.random() * range.length, 1));
  }

  return sample;
}

function getRandom() {
  const num = Math.random();

  if (num < 0.9) {
    return 2;
  } else {
    return 4;
  }
}

function gameReset() {
  gameBoard.forEach((elem, i) => {
    gameBoard[i] = 0;
  });
  gameScore = 0;
  score.innerHTML = gameScore;

  message.forEach(elem => {
    elem.classList.add('hidden');
  });
}

function addCells() {
  let range = [];

  range = gameBoard.map((elem, index) => {
    if (elem === 0) {
      return index;
    }
  });

  range = range.filter(elem => elem !== undefined);

  const pos = sampleRange(range, 2);

  gameBoard[pos[0]] = getRandom();
  gameBoard[pos[1]] = getRandom();
}

function arraysEqual(a, b) {
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function addCell() {
  let range = [];

  range = gameBoard.map((elem, index) => {
    if (elem === 0) {
      return index;
    }
  });

  range = range.filter(elem => elem !== undefined);

  if (range.length < 1) {
    gameEnd = true;
  } else {
    const pos = sampleRange(range, 1);

    gameBoard[pos[0]] = getRandom();
  }
}

function addTag() {
  gameBoard.forEach((elem, i) => {
    if (elem === 0) {
      cells[i].className = 'field-cell';
      cells[i].innerHTML = '';
    } else {
      cells[i].className = 'field-cell field-cell--' + elem;
      cells[i].innerHTML = elem;
    }
  });
}
