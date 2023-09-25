'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const gameScore = document.querySelector('.game-score');
  const startBtn = document.querySelector('.button.start');
  const gameCells = document.querySelectorAll('.field-cell');
  const loseMessage = document.querySelector('.message-lose');
  const winMessage = document.querySelector('.message-win');
  let score = 0;
  let board = [];

  function initBoard() {
    board = [...Array(4)].map(row => Array(4).fill(null));
    addTile();
    addTile();
    renderBoard();
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';

    score = 0;
    gameScore.textContent = score;

    document.querySelector('.message-start').classList.add('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  function renderBoard() {
    gameCells.forEach((cell, idx) => {
      const row = Math.floor(idx / 4);
      const col = idx % 4;
      const value = board[row][col];

      cell.textContent = value || '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
    gameScore.textContent = score;
  }

  function addTile() {
    const emptyCells = [];

    board.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        if (!tile) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length) {
      const [
        randomRow,
        randomCol,
      ] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      board[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function move(direction) {
    let moved = false;

    if (direction === 'up' || direction === 'down') {
      for (let col = 0; col < 4; col++) {
        let tiles = [];

        for (let row = 0; row < 4; row++) {
          if (board[row][col]) {
            tiles.push(board[row][col]);
          }
        }
        tiles = mergeTiles(tiles, direction);

        for (let row = 0; row < 4; row++) {
          const value = tiles[row];

          if (board[row][col] !== value) {
            moved = true;
            board[row][col] = value;
          }
        }
      }
    } else {
      for (let row = 0; row < 4; row++) {
        let tiles = [];

        for (let col = 0; col < 4; col++) {
          if (board[row][col]) {
            tiles.push(board[row][col]);
          }
        }
        tiles = mergeTiles(tiles, direction);

        for (let col = 0; col < 4; col++) {
          const value = tiles[col];

          if (board[row][col] !== value) {
            moved = true;
            board[row][col] = value;
          }
        }
      }
    }

    if (moved) {
      addTile();
      renderBoard();
      checkEndGame();
    }
  }

  function mergeTiles(tiles, direction) {
    if (direction === 'down' || direction === 'right') {
      tiles.reverse();
    }

    const mergedTiles = [];
    let skipMerge = false;

    for (const tile of tiles) {
      if (mergedTiles.length
          && mergedTiles[mergedTiles.length - 1]
          === tile
          && !skipMerge) {
        mergedTiles[mergedTiles.length - 1] += tile;
        score += tile * 2;
        skipMerge = true;
      } else {
        mergedTiles.push(tile);
        skipMerge = false;
      }
    }

    while (mergedTiles.length < 4) {
      mergedTiles.push(null);
    }

    if (direction === 'down' || direction === 'right') {
      mergedTiles.reverse();
    }

    return mergedTiles;
  }

  function checkEndGame() {
    // check win
    for (const row of board) {
      for (const tile of row) {
        if (tile === 2048) {
          winMessage.classList.remove('hidden');

          return;
        }
      }
    }
    // check lose

    if (isBoardFull() && !canMove()) {
      loseMessage.classList.remove('hidden');
    }
  }

  function isBoardFull() {
    for (const row of board) {
      for (const tile of row) {
        if (!tile) {
          return false;
        }
      }
    }

    return true;
  }

  function canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (row < 3 && board[row][col] === board[row + 1][col]) {
          return true;
        }

        if (col < 3 && board[row][col] === board[row][col + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  startBtn.addEventListener('click', initBoard);

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        move('up');
        break;

      case 'ArrowDown':
        move('down');
        break;

      case 'ArrowLeft':
        move('left');
        break;

      case 'ArrowRight':
        move('right');
        break;
    }
  });
});
