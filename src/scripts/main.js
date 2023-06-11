'use strict';

let gameField;
let score = 0;
let change;
const button = document.querySelector('button');
const startMessages = document.querySelector('.message-start');
const loseMessages = document.querySelector('.message-lose');
const winMessages = document.querySelector('.message-win');
const elementScore = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

function fillGameField(board) {
  let count = 0;
  let stopGame = true;
  let cellListNum = 0;

  board.forEach((element, i) => {
    element.forEach((item, j) => {
      if (item) {
        cells[cellListNum].textContent = item;
        cells[cellListNum].className = `field-cell field-cell--${item}`;

        if (item === 2048) {
          document.removeEventListener('keydown', keyPress);
          winMessages.classList.remove('hidden');
        }

        count++;

        if (item === board[i][j + 1] || (i < 3 && item === board[i + 1][j])) {
          stopGame = false;
        }
      } else {
        cells[cellListNum].textContent = '';
        cells[cellListNum].className = 'field-cell';
      }
      cellListNum++;
    });
  });

  if (count === 16 && stopGame === true) {
    document.removeEventListener('keydown', keyPress);
    loseMessages.classList.remove('hidden');
  }
}

function addCell(board) {
  let row, col;

  do {
    row = Math.floor(Math.random() * 4);
    col = Math.floor(Math.random() * 4);
  } while (board[row][col]);

  board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function stepX(board, reverse = false) {
  change = false;

  board.forEach((item, i) => {
    let row = item.filter(el => el !== 0);

    row = reverse ? row.reverse() : row;

    row.forEach((el, j) => {
      if (el === row[j + 1]) {
        row[j] *= 2;
        score += row[j];
        elementScore.innerText = score;
        row[j + 1] = 0;
      }
    });

    row = row.filter(el => el !== 0);
    row = [...row, 0, 0, 0, 0];
    row.length = 4;
    row = reverse ? row.reverse() : row;

    if (row.toString() !== item.toString()) {
      board[i] = row;
      change = true;
    }
  });

  return board;
}

function stepY(board, reverse = false) {
  let rotateBoard = board.map((el, i) =>
    el.map((item, j) => board[j][3 - i])
  );

  rotateBoard = stepX(rotateBoard, reverse);

  rotateBoard.forEach((element, i) => {
    element.forEach((item, j) => {
      board[i][j] = rotateBoard[3 - j][i];
    });
  });

  return board;
}

function nextCell(board) {
  if (change) {
    addCell(board);
    setTimeout(() => fillGameField(board), 200);
  }
}

const keyPress = (e) => {
  e.preventDefault();

  if (e.code === 'ArrowLeft') {
    fillGameField(stepX(gameField));
    nextCell(gameField);
  }

  if (e.code === 'ArrowRight') {
    fillGameField(stepX(gameField, true));
    nextCell(gameField);
  }

  if (e.code === 'ArrowUp') {
    fillGameField(stepY(gameField));
    nextCell(gameField);
  }

  if (e.code === 'ArrowDown') {
    fillGameField(stepY(gameField, true));
    nextCell(gameField);
  }
};

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.textContent = 'Restart';
    button.className = 'button restart';
    startMessages.hidden = true;
  } else {
    score = 0;
    elementScore.innerText = score;
    loseMessages.classList.add('hidden');
    document.removeEventListener('keydown', keyPress);
  }

  gameField = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

  addCell(gameField);
  addCell(gameField);
  fillGameField(gameField);

  document.addEventListener('keydown', keyPress);
});
