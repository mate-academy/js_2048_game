'use strict';

let board;
let currentScore = 0;
let scoreSum = 0;
const rows = 4;
const colums = 4;
let gameOn = false;

const startGame = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const messageInstruction = document.querySelector('.message-instruction');

const score = document.querySelector('.game-score');

function buttonSwitcher() {
  if (gameOn === true) {
    startGame.classList.remove('start');
    startGame.classList.add('restart');
    startGame.innerHTML = 'Restart';

    document.getElementById('board').innerHTML = '';
    score.textContent = '0';
    scoreSum = 0;
    setGame();
    document.addEventListener('keyup', keyUpHandler);
  } else if (gameOn === false) {
    startGame.classList.remove('restart');
    startGame.classList.add('start');
    startGame.innerHTML = 'Start';
  }
}

startGame.addEventListener('click', e => {
  e.preventDefault();

  setGame();
  gameOn = true;
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');
  messageInstruction.classList.add('hidden');
  buttonSwitcher();
});

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < colums; c++) {
      const tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);

      document.getElementById('board').append(tile);
    }
  }

  setRandom();
  setRandom();
}

function hasEmptyTile() {
  return board.some((row) => row.some((cell) => cell === 0));
}

function setRandom() {
  if (!hasEmptyTile()) {
    messageLose.classList.remove('hidden');
    gameOn = false;
    document.removeEventListener('keyup', keyUpHandler);

    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * colums);

    if (board[r][c] === 0) {
      const random = Math.random() < 0.9 ? 2 : 4;

      board[r][c] = random;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.textContent = random;
      tile.classList.add(`${random}`);

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

    if (num < 2048) {
      tile.classList.add('tile--' + num.toString());
    }

    if (num === 2048) {
      tile.classList.add('tile--' + num.toString());
      messageWin.classList.remove('hidden');
      document.removeEventListener('keyup', keyUpHandler);
    }
  }
}

function keyUpHandler(e) {
  currentScore = 0;

  if (e.code === 'ArrowLeft') {
    slideLeft();
    setRandom();
  } else if (e.code === 'ArrowRight') {
    slideRight();
    setRandom();
  } else if (e.code === 'ArrowUp') {
    slideUp();
    setRandom();
  } else if (e.code === 'ArrowDown') {
    slideDown();
    setRandom();
  }
  score.textContent = scoreSum;

  score.insertAdjacentHTML('afterend', `
    <span class="score-update">+${currentScore}</span>
  `);
}

if (document !== 'undefined') {
  document.addEventListener('keyup', keyUpHandler);
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  row = filterZero(row); // eslint-disable-line no-param-reassign

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      scoreSum += row[i];
      currentScore += row[i];
    }
  }

  row = filterZero(row); // eslint-disable-line no-param-reassign

  while (row.length < colums) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < colums; c++) {
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

    for (let c = 0; c < colums; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < colums; c++) {
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
  for (let c = 0; c < colums; c++) {
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
