'use strict';

const app = document.querySelector('.app');
const gameField = app.querySelector('.game-field');
const gameHeader = app.querySelector('.game-header');
const startButton = gameHeader.querySelector('.start');
const scoreElem = gameHeader.querySelector('.game-score');
const messages = document.querySelectorAll('.message');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
// const backButton = gameHeader.querySelector('.back');

let win = false;
let board;
let score = 0;
const rows = 4;
const columns = 4;
let gameStarted = false;

let techCheckBoard;

window.onload = function() {
  setGame();
};

startButton.addEventListener('click', () => {
  gameStarted = true;
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerHTML = 'Restart';
  restartGame();
});

// backButton.addEventListener('click', () => {
//   const allCeils = gameField.querySelectorAll(`.game-ceil`);

//   allCeils.forEach(elem => elem.remove());

//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < columns; c++) {
//       const ceil = document.createElement('div');

//       ceil.id = `${r}-${c}`;

//       const num = board[r][c];

//       updateTile(ceil, num);
//       gameField.append(ceil);
//     }
//   }
// });

function setGame() {
  score = 0;
  scoreElem.innerHTML = score;

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const ceil = document.createElement('div');

      ceil.id = `${r}-${c}`;

      const num = board[r][c];

      updateTile(ceil, num);
      gameField.append(ceil);
    }
  }

  messages.forEach(elem => elem.classList.add('hidden'));
  startMessage.classList.remove('hidden');
}

function restartGame() {
  const allCeils = gameField.querySelectorAll(`.game-ceil`);

  allCeils.forEach(elem => elem.remove());
  setGame();
  setTwoOrFour();
  setTwoOrFour();
}

function updateTile(ceil, num) {
  ceil.innerHTML = '';
  ceil.classList.value = '';
  ceil.classList.add('game-ceil');

  if (num > 0) {
    ceil.innerHTML = `${num}`;

    if (num <= 4096) {
      ceil.classList.add(`game-ceil--${num}`);
    } else {
      ceil.classList.add('game-ceil--8192');
    }

    if (num >= 2048 && !win) {
      winMessage.classList.remove('hidden');
      startMessage.classList.add('hidden');
      win = true;
    }
  }
}

function gameLose() {
  loseMessage.classList.remove('hidden');

  if (!winMessage.classList.contains('hidden')) {
    winMessage.classList.add('hidden');
  }

  if (!startMessage.classList.contains('hidden')) {
    startMessage.classList.add('hidden');
  }
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let rowSlide = filterZero(row);

  for (let i = 0; i < rowSlide.length - 1; i++) {
    if (rowSlide[i] === rowSlide[i + 1]) {
      rowSlide[i] *= 2;
      rowSlide[i + 1] = 0;
      score += rowSlide[i];
    }
  }
  rowSlide = filterZero(rowSlide);

  while (rowSlide.length < columns) {
    rowSlide.push(0);
  };

  return rowSlide;
}
// #region arrows slide

app.addEventListener('keyup', (e) => {
  if (gameStarted) {
    techCheckBoard = [
      [ ...board[0] ],
      [ ...board[1] ],
      [ ...board[2] ],
      [ ...board[3] ],
    ];

    switch (e.code) {
      case 'ArrowLeft' :
        slideLeft();
        CanBeMoved();
        break;
      case 'ArrowRight' :
        slideRight();
        CanBeMoved();
        break;
      case 'ArrowUp' :
        slideUp();
        CanBeMoved();
        break;
      case 'ArrowDown' :
        slideDown();
        CanBeMoved();
        break;
    }
  }
  scoreElem.innerHTML = score;
});

function CanBeMoved() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (techCheckBoard[r][c] !== board[r][c]) {
        checkForLose();
        setTwoOrFour();
        checkForLose();

        return;
      }
    }
  }
}

function checkForLose() {
  if (!hasEmptyTile()) {
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < columns - 1; c++) {
        if (board[r][c] === board[r + 1][c]
          || board[r][c] === board[r][c + 1]
          || board[r][c + 1] === board[r + 1][c + 1]
          || board[r + 1][c] === board[r + 1][c + 1]) {
          return;
        }
      }
    }
    gameLose();
  }
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const ceil = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(ceil, num);
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
      const ceil = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(ceil, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const ceil = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(ceil, num);
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

      const ceil = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(ceil, num);
    }
  }
}

// #endregion

function setTwoOrFour() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const rand = Math.floor(Math.random() * 10);
      let tempRes = 2;

      if (rand === 1) {
        tempRes = 4;
      }
      board[r][c] = tempRes;

      const tile = document.getElementById(`${r}-${c}`);

      tile.innerHTML = `${tempRes}`;
      tile.classList.add(`game-ceil--${tempRes}`);
      found = true;
    }
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

// #region MobileControls
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

app.addEventListener('touchstart', function(a) {
  touchstartX = a.screenX;
  touchstartY = a.screenY;
}, false);

app.addEventListener('touchend', function(a) {
  touchendX = a.screenX;
  touchendY = a.screenY;
  handleGesure();
}, false);

function handleGesure() {
  if (gameStarted) {
    if (touchendX < touchstartX) {
      slideLeft();
      setTwoOrFour();
    }

    if (touchendX > touchstartX) {
      slideRight();
      setTwoOrFour();
    }

    if (touchendY < touchstartY) {
      slideDown();
      setTwoOrFour();
    }

    if (touchendY > touchstartY) {
      slideUp();
      setTwoOrFour();
    }
  }
}

// #endregion
