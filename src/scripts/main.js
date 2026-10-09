'use strict';

const game = {
  state: Array.from({ length: 4 }, () => Array(4).fill(0)),
  score: 0,
  status: 'idle',
};

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function addRandomTile() {
  const emptyCells = [];

  game.state.forEach((currentRow, r) => {
    currentRow.forEach((value, c) => {
      if (value === 0) {
        emptyCells.push([r, c]);
      }
    });
  });

  if (emptyCells.length === 0) {
    return;
  }

  const [randomRow, randomCol] =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];

  game.state[randomRow][randomCol] = Math.random() < 0.1 ? 4 : 2;
}

function render() {
  cells.forEach((cell, index) => {
    const value = game.state[Math.floor(index / 4)][index % 4];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.score;

  startMessage.classList.toggle('hidden', game.status !== 'idle');
  winMessage.classList.toggle('hidden', game.status !== 'win');
  loseMessage.classList.toggle('hidden', game.status !== 'lose');

  startButton.textContent = game.status === 'idle' ? 'Start' : 'Restart';

  startButton.classList.toggle('restart', game.status !== 'idle');
}

function canMove() {
  for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      if (
        game.state[rowIndex][colIndex] === 0 ||
        (colIndex < 3 &&
          game.state[rowIndex][colIndex] ===
            game.state[rowIndex][colIndex + 1]) ||
        (rowIndex < 3 &&
          game.state[rowIndex][colIndex] === game.state[rowIndex + 1][colIndex])
      ) {
        return true;
      }
    }
  }

  return false;
}

function move(direction) {
  if (game.status !== 'playing') {
    return;
  }

  const previousState = JSON.stringify(game.state);

  for (let line = 0; line < 4; line++) {
    let values = [];

    for (let index = 0; index < 4; index++) {
      const rowIndex =
        direction === 'up' ? index : direction === 'down' ? 3 - index : line;

      const colIndex =
        direction === 'left' ? index : direction === 'right' ? 3 - index : line;

      values.push(game.state[rowIndex][colIndex]);
    }

    values = values.filter((value) => value !== 0);

    const merged = [];

    for (let index = 0; index < values.length; index++) {
      if (values[index] === values[index + 1]) {
        const mergedValue = values[index] * 2;

        merged.push(mergedValue);
        game.score += mergedValue;
        index++;
      } else {
        merged.push(values[index]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    for (let index = 0; index < 4; index++) {
      const rowIndex =
        direction === 'up' ? index : direction === 'down' ? 3 - index : line;

      const colIndex =
        direction === 'left' ? index : direction === 'right' ? 3 - index : line;

      game.state[rowIndex][colIndex] = merged[index];
    }
  }

  if (previousState === JSON.stringify(game.state)) {
    return;
  }

  if (game.state.some((currentRow) => currentRow.includes(2048))) {
    game.status = 'win';
  } else {
    addRandomTile();

    if (!canMove()) {
      game.status = 'lose';
    }
  }

  render();
}

startButton.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.status = 'playing';
    addRandomTile();
    addRandomTile();
  } else {
    game.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    game.score = 0;
    game.status = 'idle';
  }

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  const moves = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };

  if (moves[keyboardEvent.key]) {
    keyboardEvent.preventDefault();
    move(moves[keyboardEvent.key]);
  }
});

render();
