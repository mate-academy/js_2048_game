'use strict';

const scoreEl = document.querySelector('.game-score');

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  addNewTile();
  addNewTile();
  updateBoard();
}

function addNewTile() {
  const emptyTiles = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        emptyTiles.push({
          row, col,
        });
      }
    }
  }

  if (emptyTiles.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const { row, col } = emptyTiles[randomIndex];

    const newValue = Math.random < 0.9 ? 4 : 2;

    board[row][col] = newValue;
  }
}

function updateBoard() {
  const gameBoard = document.getElementById('game-board');

  gameBoard.innerHTML = '';

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const tileValue = board[row][col];
      const tile = document.createElement('div');

      tile.className = 'field-cell';
      tile.textContent = tileValue !== 0 ? tileValue : '';

      tile.style.backgroundColor = getTileColor(tileValue);
      tile.style.color = [2, 4, 8].includes(tileValue) ? '#6b6359' : '#f9f6f2';

      gameBoard.appendChild(tile);
    }
  }

  if (isGameOver()) {
    startButton.style.backgroundColor = '#f87474';
    messageLose.hidden = false;
  }

  if (score === 2048) {
    messageWin.hidden = false;
  }
}

function getTileColor(value) {
  if (value === 0) {
    return '#d6cdc4';
  }

  const colorMap = new Map([
    [2, '#eee4da'],
    [4, '#ede0c8'],
    [8, '#f2b179'],
    [16, '#f59563'],
    [32, '#f67c5f'],
    [64, '#f65e3b'],
    [128, '#edcf72'],
    [256, '#edcc61'],
    [512, '#edc850'],
    [1024, '#edc53f'],
    [2048, '#edc22e'],
  ]);

  if (colorMap.has(value)) {
    return colorMap.get(value);
  }

  return '#ecc95c';
}

function moveTiles(direction) {
  let tileMoved = false;

  const rowIndices = direction === 'up' ? [0, 1, 2, 3] : [3, 2, 1, 0];
  const colIndices = direction === 'left' ? [0, 1, 2, 3] : [3, 2, 1, 0];

  for (const row of rowIndices) {
    for (const col of colIndices) {
      const currentValue = board[row][col];

      if (currentValue === 0) {
        continue;
      }

      let newRow = row;
      let newCol = col;
      let currentRow = row;
      let currentCol = col;

      while (true) {
        if (direction === 'up') {
          newRow--;
          currentRow = newRow + 1;
        } else if (direction === 'down') {
          newRow++;
          currentRow = newRow - 1;
        } else if (direction === 'left') {
          newCol--;
          currentCol = newCol + 1;
        } else if (direction === 'right') {
          newCol++;
          currentCol = newCol - 1;
        }

        if (newRow < 0 || newRow >= 4 || newCol < 0 || newCol >= 4) {
          newRow -= direction === 'up' ? -1 : 1;
          newCol -= direction === 'left' ? -1 : 1;
          break;
        }

        const newValue = board[newRow][newCol];

        if (newValue === 0) {
          board[newRow][newCol] = currentValue;
          board[currentRow][currentCol] = 0;
          tileMoved = true;
        } else if (newValue === currentValue) {
          board[newRow][newCol] += currentValue;
          board[currentRow][currentCol] = 0;
          tileMoved = true;
          score += currentValue;
          scoreEl.innerText = score;
          break;
        } else {
          newRow -= direction === 'up' ? -1 : 1;
          newCol -= direction === 'left' ? -1 : 1;
          break;
        }
      }
    }
  }

  if (tileMoved) {
    addNewTile();
    updateBoard();
  }
}

function isGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const currentValue = board[row][col];

      if (currentValue === 0) {
        return false;
      }

      if (
        (row < 3 && board[row + 1][col] === currentValue)
        || (col < 3 && board[row][col + 1] === currentValue)
      ) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    moveTiles('up');
  } else if (e.key === 'ArrowDown') {
    moveTiles('down');
  } else if (e.key === 'ArrowLeft') {
    moveTiles('left');
  } else if (e.key === 'ArrowRight') {
    moveTiles('right');
  }
});

const startButton = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

messageWin.hidden = true;
messageLose.hidden = true;

startButton.addEventListener('click', () => {
  const startMessage = document.querySelector('.message-start');

  messageWin.hidden = true;
  messageLose.hidden = true;
  startMessage.hidden = true;

  startGame();
  startButton.className = 'button restart';
  startButton.textContent = 'Restart';
  startButton.style.backgroundColor = '';
});
