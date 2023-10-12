'use strict';

const game = {
  matrix: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  score: 0,
  moved: false,
};

const messageGame = {
  win: 'Winner! Congrats! You did it!',
  lose: 'You lose! Restart the game?',
  start: 'Press "Start" to begin game. Good luck!',
};

const gameFieldCells = document.querySelector('.game-field tbody');
const messagePlace = document.querySelector('.message-container');
const button = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');

render();

function render() {
  gameFieldCells.innerHTML = '';

  game.matrix.forEach(col => {
    const tr = document.createElement('tr');

    tr.className = 'field-row';

    col.forEach(row => {
      const td = document.createElement('td');

      if (row !== 0) {
        td.className = `field-cell field-cell--${row}`;

        td.textContent = row;
      } else if (row === 0) {
        td.className = `field-cell`;
      }

      tr.append(td);
    });

    gameFieldCells.append(tr);
  });

  gameScore.textContent = game.score;

  renderMessage('message-start', messageGame.start);

  const isWin = isGameWin();

  if (!isWin) {
    isGameLose();
  }
}

function renderMessage(classMessage, message) {
  messagePlace.innerHTML = `
    <p class="message ${classMessage}">
      ${message}
    </p>
  `;
}

function clearData() {
  game.matrix = game.matrix.map(col => col.map(() => 0));
  game.score = 0;
  game.moved = false;

  render();
}

function addRandomCell() {
  const emptyCell = [];

  game.matrix.forEach((col, colInd) => {
    col.forEach((row, rowInd) => {
      if (row === 0) {
        emptyCell.push([colInd, rowInd]);
      }
    });
  });

  const randomCellNum = Math.random() <= 0.1 ? 4 : 2;
  const randomPosition = Math.floor(Math.random() * emptyCell.length);

  const randomCol = emptyCell[randomPosition][0];
  const randomRow = emptyCell[randomPosition][1];

  game.matrix[randomCol][randomRow] = randomCellNum;
}

function isGameLose() {
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      const current = game.matrix[col][row];

      if (current === 0) {
        return;
      }

      if (col !== 3 && current === game.matrix[col + 1][row]) {
        return;
      }

      if (row !== 3 && current === game.matrix[col][row + 1]) {
        return;
      }
    }
  }

  renderMessage('message-lose', messageGame.lose);

  window.removeEventListener('keydown', handlerKey);
}

function isGameWin() {
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      const current = game.matrix[col][row];

      if (current === 2048) {
        renderMessage('message-win', messageGame.win);

        window.removeEventListener('keydown', handlerKey);

        return true;
      }
    }
  }
}

function startGame() {
  clearData();
  addRandomCell();
  addRandomCell();

  render();

  window.addEventListener('keydown', handlerKey);
}

function handlerKey(e) {
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      searchEmptyTails('up');
      searchSameTails('up');
      searchEmptyTails('up');

      break;
    case 's':
    case 'ArrowDown':
      searchEmptyTails('down');
      searchSameTails('down');
      searchEmptyTails('down');

      break;
    case 'a':
    case 'ArrowLeft':
      searchEmptyTails('left');
      searchSameTails('left');
      searchEmptyTails('left');

      break;
    case 'd':
    case 'ArrowRight':
      searchEmptyTails('right');
      searchSameTails('right');
      searchEmptyTails('right');

      break;
  }

  render();

  if (game.moved) {
    addRandomCell();
    render();

    game.moved = false;
  }
}

let startCol = 0;
let startRow = 0;

let actionX = 0;
let actionY = 0;

function setValue(move) {
  startCol = 0;
  startRow = 0;

  actionX = 0;
  actionY = 0;

  switch (move) {
    case 'up':
      startCol = 1;

      actionX = -1;

      break;
    case 'down':
      startCol = 2;

      actionX = 1;

      break;
    case 'left':
      startRow = 1;

      actionY = -1;

      break;
    case 'right':
      startRow = 2;

      actionY = 1;

      break;
  }
}

function searchEmptyTails(move) {
  setValue(move);

  for (
    let col = startCol;
    col >= 0 && col < 4;
    col += (move === 'down' ? -1 : 1)
  ) {
    for (
      let row = startRow;
      row >= 0 && row < 4;
      row += (move === 'right' ? -1 : 1)
    ) {
      if (game.matrix[col][row] === 0) {
        continue;
      }

      let currCol = col;
      let currRow = row;

      while (
        (move === 'up' ? currCol > 0
          : move === 'down' ? currCol < 3
            : move === 'left' ? currRow > 0
              : currRow < 3
        ) && game.matrix[currCol + actionX][currRow + actionY] === 0
      ) {
        currCol += actionX;
        currRow += actionY;
      }

      if (currCol !== col || currRow !== row) {
        game.matrix[currCol][currRow] = game.matrix[col][row];
        game.matrix[col][row] = 0;

        game.moved = true;
      }
    }
  }
}

function searchSameTails(move) {
  setValue(move);

  for (
    let col = startCol;
    col >= 0 && col < 4;
    col += (move === 'down' ? -1 : 1)
  ) {
    for (
      let row = startRow;
      row >= 0 && row < 4;
      row += (move === 'right' ? -1 : 1)
    ) {
      const actionCol = col + actionX;
      const actionRow = row + actionY;

      if (game.matrix[col][row] === 0) {
        continue;
      }

      if (game.matrix[actionCol][actionRow] === game.matrix[col][row]) {
        game.matrix[actionCol][actionRow] *= 2;
        game.score += game.matrix[actionCol][actionRow];
        game.matrix[col][row] = 0;

        game.moved = true;
      }
    }
  }
}

button.addEventListener('click', () => {
  startGame();

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
});
