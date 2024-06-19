'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button');
  const restartButton = document.getElementById('restart-button');
  const scoreDisplay = document.getElementById('score');
  const cells = document.querySelectorAll('.field-cell');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const messageFirst = document.querySelector('.message-start');
  const size = 4;
  let board;
  let score = 0;

  startButton.addEventListener('click', start);
  restartButton.addEventListener('click', restart);

  function restart() {
    const newGame = confirm(
      'Are you sure you want to start a new game? All progress will be lost.',
    );

    if (newGame) {
      messageLose.style.display = 'none';
      messageWin.style.display = 'none';
      start();
    }
  }

  function start() {
    board = Array(size)
      .fill()
      .map(() => Array(size).fill(0));

    score = 0;
    getScore();

    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
    messageFirst.style.display = 'none';

    cells.forEach((cell) => {
      cell.innerHTML = '';
      cell.style.backgroundColor = '#cdc1b4';
    });

    addRandomTile();
    addRandomTile();
    updateBoard();
  }

  function addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { x, y } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function updateBoard() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = board[i][j];
        const cell = cells[i * size + j];

        cell.textContent = value === 0 ? '' : value;
        cell.style.backgroundColor = getTileColor(value);
      }
    }
  }

  function getScore() {
    scoreDisplay.textContent = score;
  }

  function updateGame() {
    addRandomTile();
    updateBoard();
    checkGameOver();
    getScore();
  }

  function getTileColor(value) {
    const colors = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };

    return colors[value] || '#3c3a32';
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        moveUp();
        break;
      case 'ArrowDown':
      case 's':
        moveDown();
        break;
      case 'ArrowLeft':
      case 'a':
        moveLeft();
        break;
      case 'ArrowRight':
      case 'd':
        moveRight();
        break;
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  function removeKeydownEventListener() {
    document.removeEventListener('keydown', handleKeyDown);
  }

  function slide(array, reverse = false) {
    let newArray = reverse ? [...array].reverse() : [...array];

    newArray = newArray.filter((val) => val !== 0);

    let points = 0;

    for (let i = 0; i < newArray.length - 1; i++) {
      if (newArray[i] === newArray[i + 1]) {
        newArray[i] *= 2;
        newArray[i + 1] = 0;
        points += newArray[i];
      }
    }

    newArray = newArray.filter((val) => val !== 0);

    while (newArray.length < size) {
      newArray.push(0);
    }

    if (reverse) {
      newArray = newArray.reverse();
    }

    return { newArray, points };
  }

  function moveLeft() {
    const originalBoard = JSON.parse(JSON.stringify(board));
    let moved = false;

    for (let i = 0; i < size; i++) {
      const row = board[i];
      const result = slide(row);
      const newRow = result.newArray;

      if (newRow.some((val, index) => val !== row[index])) {
        moved = true;
      }
      board[i] = newRow;
      score += result.points;
    }

    if (moved && JSON.stringify(originalBoard) !== JSON.stringify(board)) {
      updateGame();
    }
  }

  function moveRight() {
    const originalBoard = JSON.parse(JSON.stringify(board));
    let moved = false;

    for (let i = 0; i < size; i++) {
      const row = board[i];
      const result = slide(row, true);
      const newRow = result.newArray;

      if (newRow.some((val, index) => val !== row[index])) {
        moved = true;
      }
      board[i] = newRow;
      score += result.points;
    }

    if (moved && JSON.stringify(originalBoard) !== JSON.stringify(board)) {
      updateGame();
    }
  }

  function moveUp() {
    const originalBoard = JSON.parse(JSON.stringify(board));
    let moved = false;

    for (let j = 0; j < size; j++) {
      const column = board.map((row) => row[j]);
      const result = slide(column);
      const newColumn = result.newArray;

      if (newColumn.some((val, index) => val !== column[index])) {
        moved = true;
      }

      for (let i = 0; i < size; i++) {
        board[i][j] = newColumn[i];
      }
      score += result.points;
    }

    if (moved && JSON.stringify(originalBoard) !== JSON.stringify(board)) {
      updateGame();
    }
  }

  function moveDown() {
    const originalBoard = JSON.parse(JSON.stringify(board));
    let moved = false;

    for (let j = 0; j < size; j++) {
      const column = board.map((row) => row[j]);
      const result = slide(column, true);
      const newColumn = result.newArray;

      if (newColumn.some((val, index) => val !== column[index])) {
        moved = true;
      }

      for (let i = 0; i < size; i++) {
        board[i][j] = newColumn[i];
      }
      score += result.points;
    }

    if (moved && JSON.stringify(originalBoard) !== JSON.stringify(board)) {
      updateGame();
    }
  }

  function checkGameOver() {
    if (isGameOver()) {
      messageLose.style.display = 'inline-block';
    } else if (isGameWon()) {
      messageWin.style.display = 'inline-block';

      removeKeydownEventListener();
    }
  }

  function isGameOver() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          return false;
        }

        if (j < size - 1 && board[i][j] === board[i][j + 1]) {
          return false;
        }

        if (i < size - 1 && board[i][j] === board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  function isGameWon() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }
});
