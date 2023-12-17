'use strict';

const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const cellsInRow = 4;
let scoreCount = 0;
let board;

let movesLeft = true;

startButton.addEventListener('click', () => {
  startButton.classList.replace('start', 'restart');
  startButton.innerText = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  startTheGame();
});

function hasEmptyTile() {
  return board.some(row => row.includes(0));
}

function placeTiles() {
  if (movesLeft) {
    while (hasEmptyTile()) {
      const randomRow = Math.floor(Math.random() * cellsInRow);
      const randomCol = Math.floor(Math.random() * cellsInRow);

      if (board[randomRow][randomCol] === 0) {
        const numb = Math.random() < 0.9 ? 2 : 4;

        board[randomRow][randomCol] = numb;
        setCells();
        break;
      }
    }

    movesLeft = false;
  } else if (!hasEmptyTile() && loseTheGame()) {
    messageLose.classList.remove('hidden');
  }

  movesLeft = true;
}

function startTheGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  scoreCount = 0;
  gameScore.innerText = scoreCount;

  setCells();
  placeTiles();
  placeTiles();
  movesLeft = true;
}

function loseTheGame() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow - 1; c++) {
      if (board[r][c] === board[r][c + 1] || board[c][r] === board[c + 1][r]) {
        return false;
      }
    }
  }

  return true;
}

function setCells() {
  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      const currentCell = gameField.rows[r].cells[c];
      const num = board[r][c];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.classList.add('field-cell');

      if (num > 0) {
        currentCell.innerText = num;
        currentCell.classList.add(`field-cell--${num}`);
      }

      if (num === 2048) {
        messageWin.classList.remove('hidden');
        startButton.classList.replace('restart', 'start');
      }
    }
  }

  if (loseTheGame()) {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
  }
}

function removeEmptyTiles(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = removeEmptyTiles(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      scoreCount += newRow[i];

      gameScore.innerText = scoreCount;
    }
  }

  newRow = removeEmptyTiles(newRow);

  while (newRow.length < cellsInRow) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  const prevBoard = cloneBoard(board);

  for (let r = 0; r < cellsInRow; r++) {
    board[r] = slide(board[r]);
  }
  movesLeft = !isBoardEqual(board, prevBoard);
}

function slideRight() {
  const prevBoard = cloneBoard(board);

  for (let r = 0; r < cellsInRow; r++) {
    board[r] = slide(board[r].reverse()).reverse();
  }
  movesLeft = !isBoardEqual(board, prevBoard);
}

function slideUp() {
  const prevBoard = cloneBoard(board);

  for (let c = 0; c < cellsInRow; c++) {
    const column = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const newColumn = slide(column);

    for (let r = 0; r < cellsInRow; r++) {
      board[r][c] = newColumn[r];
    }
  }
  movesLeft = !isBoardEqual(board, prevBoard);
}

function slideDown() {
  const prevBoard = cloneBoard(board);

  for (let c = 0; c < cellsInRow; c++) {
    const column = [
      board[0][c],
      board[1][c],
      board[2][c],
      board[3][c],
    ].reverse();
    const newColumn = slide(column).reverse();

    for (let r = 0; r < cellsInRow; r++) {
      board[r][c] = newColumn[r];
    }
  }
  movesLeft = !isBoardEqual(board, prevBoard);
}

function cloneBoard(boardCopy) {
  return boardCopy.map(row => row.slice());
}

function isBoardEqual(board1, board2) {
  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      if (board1[r][c] !== board2[r][c]) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      slideDown();
      break;
  }

  placeTiles();
  setCells();
});
