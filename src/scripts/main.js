'use strict';

const rows = 4;
const columns = 4;
const defaultBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const scoreShow = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
let board = defaultBoard;
let finish = '';
let score = '';

startButton.addEventListener('click', () => {
  startButton.classList.add('restart');
  startButton.innerHTML = 'restart';

  board = defaultBoard;
  winLose(finish, 'add');
  randomNumber();
  randomNumber();
  startGame(board);
  styleCell(board);
});

function hasEmpty() {
  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < columns; k++) {
      if (board[i][k] === 0) {
        return true;
      }
    }
  }

  return false;
}

function randomNumber() {
  if (!hasEmpty()) {
    return;
  }

  let empty = false;

  while (!empty) {
    const i = Math.floor(Math.random() * rows);
    const k = Math.floor(Math.random() * columns);

    if (board[i][k] === 0) {
      board[i][k] = 2;

      empty = true;
    }
  }
}

const checker = [2, 4, 6, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

startGame(board);
styleCell(board);

function styleCell(changeBoard) {
  for (let i = 0; i < changeBoard.length; i++) {
    for (let k = 0; k < changeBoard.length; k++) {
      const element = document.querySelector(`.cell--${i}${k}`);

      checker.forEach((el) => {
        element.classList.remove(`field-cell--${el}`);
      });

      element.classList.add(`field-cell--${changeBoard[i][k]}`);
    }
  }
}

function startGame(gameBoard) {
  for (let i = 0; i < gameBoard.length; i++) {
    for (let k = 0; k < gameBoard.length; k++) {
      const element = document.querySelector(`.cell--${i}${k}`);

      if (element && gameBoard[i][k] > 0) {
        element.innerText = gameBoard[i][k];
      } else {
        element.innerText = '';
      }
    }
  }
}

document.addEventListener('keydown', (element) => {
  if (element.code === 'ArrowDown') {
    slideDown();
    startGame(board);
    styleCell(board);
    randomNumber();
  } else if (element.code === 'ArrowUp') {
    slideUp();
    startGame(board);
    styleCell(board);
    randomNumber();
  } else if (element.code === 'ArrowRight') {
    slideRight();
    startGame(board);
    styleCell(board);
    randomNumber();
  } else if (element.code === 'ArrowLeft') {
    slideLeft();
    startGame(board);
    styleCell(board);
    randomNumber();
  }
});

function slideLeft() {
  board.forEach((row, i) => {
    board[i] = slide(row);
  });
}

function slideRight() {
  board.forEach((row, i) => {
    board[i] = slide(row.reverse()).reverse();
  });
}

function slideUp() {
  for (let i = 0; i < columns; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row = slide(row);

    board[0][i] = row[0];
    board[1][i] = row[1];
    board[2][i] = row[2];
    board[3][i] = row[3];
  }
}

function slideDown() {
  for (let i = 0; i < columns; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row.reverse();

    row = slide(row);

    row.reverse();

    board[0][i] = row[0];
    board[1][i] = row[1];
    board[2][i] = row[2];
    board[3][i] = row[3];
  }
}

function slide(array) {
  let row = array.filter((element) => {
    return element !== 0;
  });

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score = (score - 0) + row[i];
      scoreUpdate();
    }
  }

  if (isGameOver()) {
    winLose('lose', 'remove');
  }

  if (win()) {
    winLose('win', 'remove');
  }

  row = row.filter((element) => {
    return element !== 0;
  });

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function isGameOver() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length - 1; j++) {
      if (board[i][j] !== 0 && board[i][j] === board[i][j + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < board.length - 1; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0 && board[i][j] === board[i + 1][j]) {
        return false;
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }

  return true;
}

function scoreUpdate() {
  scoreShow.innerHTML = score;
}

function win() {
  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < columns; k++) {
      if (board[i][k] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function winLose(result, action) {
  if (!result) {
    return;
  }

  const message = document.querySelector(`.message-${result}`);

  if (action === 'remove') {
    message.classList.remove('hidden');
    finish = result;
  } else if (action === 'add') {
    message.classList.add('hidden');
  }

  startButton.classList.remove('restart');
  startButton.innerHTML = 'start';
}
