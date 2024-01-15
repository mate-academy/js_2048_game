'use strict';

const button = document.querySelector('button');
const gameScore = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

let newGame;
let gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const gameBoardLength = gameBoard.length;
let SCORE = 0;
const WIN_SCORE = 2048;
let isWin = false;

button.addEventListener('click', e => {
  document.addEventListener('keydown', move);

  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    startMessage.classList.add('hidden');
  } else {
    isWin = false;
    reset();
  }

  addNumber();
  addNumber();
  render();
});

function addNumber() {
  const emptyCells = [];

  gameBoard.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) =>
      cell === 0 && emptyCells.push([rowIndex, colIndex])
    )
  );

  const [randomRow, randomCol]
    = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  gameBoard[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  for (let y = 0; y < gameBoardLength; y++) {
    for (let x = 0; x < gameBoardLength; x++) {
      const el = fieldRows[y].children[x];
      const cell = gameBoard[y][x];

      el.textContent = cell || '';

      el.className
        = `field-cell ${cell ? `field-cell--${cell}` : ''}`;
    }
  }

  gameScore.textContent = SCORE;
}

function move(e) {
  newGame = gameBoard;

  switch (e.key) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    default:
      return;
  }

  if (JSON.stringify(newGame) !== JSON.stringify(gameBoard)) {
    gameBoard = newGame;
    addNumber();
    render();
  }

  if (isWin) {
    winMessage.classList.remove('hidden');
  }

  if (!checkMove()) {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    document.removeEventListener('keydown', move);
  }
}

function reset() {
  gameBoard = gameBoard.map((y) => y.map(() => 0));
  SCORE = 0;

  [winMessage, loseMessage].forEach(message => message.classList.add('hidden'));
}

function reverseLine() {
  newGame.forEach(line => line.reverse());
}

function moveLeft() {
  if (!checkRows()) {
    return;
  }

  newGame = newGame.map(y => {
    const newY
      = y.filter(cell => cell !== 0)
        .reduce((acc, cell) => {
          const preCell = acc[acc.length - 1];

          if (preCell === cell) {
            acc[acc.length - 1] *= 2;
            SCORE += acc[acc.length - 1];

            if (acc[acc.length - 1] === WIN_SCORE) {
              isWin = true;
            }
          } else {
            acc.push(cell);
          }

          return acc;
        }, []);

    return newY.concat(Array(gameBoardLength - newY.length).fill(0));
  });
}

function moveRight() {
  if (!checkRows()) {
    return;
  }

  reverseLine();
  moveLeft();
  reverseLine();
}

function moveDown() {
  movingField();
  moveRight();
  movingField();
}

function moveUp() {
  movingField();
  moveLeft();
  movingField();
}

function movingField() {
  newGame
    = newGame[0].map((_, xIndex) =>
      newGame.map(y => y[xIndex])
    );
}

function checkColumns() {
  return newGame.some(columm =>
    columm.some((cell, x) => cell === columm[x + 1]) || columm.includes(0)
  );
}

function checkRows() {
  return newGame.some(row =>
    row.some((cell, x) => cell === row[x + 1]) || row.includes(0)
  );
}

function checkMove() {
  return checkRows() || (movingField(), checkColumns());
}
