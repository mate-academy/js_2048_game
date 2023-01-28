'use strict';

const rows = document.querySelectorAll('.field-row');
const controls = document.querySelector('.controls');
const scoreInfo = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

controls.insertAdjacentHTML('beforeend', `
  <button class="button restart hidden">Restart</button>
`);

const restartButton = document.querySelector('.restart');

const game = {
  isRunning: false,
  isWon: false,
  isLost: false,
  score: 0,
  rowsQty: rows.length,
  colsQty: rows[0].children.length,
  matrix: [],
};

const moves = {
  moveRight(matrix) {
    matrix.forEach(row => {
      row.forEach((num, index) => {
        if (num === 0) {
          row.splice(index, 1);
          row.unshift(0);
        }
      });

      for (let i = row.length - 1; i >= 0; i--) {
        if (row[i] > 0 && row[i] === row[i - 1]) {
          const sum = row[i] * 2;

          row.splice(i - 1, 2, sum);
          row.unshift(0);
          game.score += sum;
        }
      }
    });
  },

  moveLeft(matrix) {
    matrix.forEach(row => {
      for (let i = row.length - 1; i >= 0; i--) {
        if (row[i] === 0) {
          row.splice(i, 1);
          row.push(0);
        }
      }

      for (let i = 0; i < row.length; i++) {
        if (row[i] > 0 && row[i] === row[i + 1]) {
          const sum = row[i] * 2;

          row.splice(i, 2, sum);
          row.push(0);
          game.score += sum;
        }
      }
    });
  },

  moveUp(matrix) {
    const reflectedMatrix = reflectMatrix(matrix);

    this.moveLeft(reflectedMatrix);

    const shiftedUpMatrix = reflectMatrix(reflectedMatrix);

    game.matrix = shiftedUpMatrix;
  },

  moveDown(matrix) {
    const reflectedMatrix = reflectMatrix(matrix);

    this.moveRight(reflectedMatrix);

    const shiftedDownMatrix = reflectMatrix(reflectedMatrix);

    game.matrix = shiftedDownMatrix;
  },
};

const checkDirections = {
  moveLeft(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      const nums = matrix[i];

      for (let n = 0; n < nums.length; n++) {
        if (nums[n] !== 0 && nums[n] === nums[n + 1]) {
          return true;
        }

        let restHasNums = false;

        if (nums[n] === 0) {
          const rest = nums.slice(n);

          restHasNums = rest.some(num => num > 0);
        }

        if (restHasNums) {
          return true;
        }
      }
    }

    return false;
  },

  moveRight(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      const nums = matrix[i];

      for (let n = nums.length; n >= 0; n--) {
        if (nums[n] !== 0 && nums[n] === nums[n - 1]) {
          return true;
        }

        let restHasNums = false;

        if (nums[n] === 0) {
          const rest = nums.slice(0, n);

          restHasNums = rest.some(num => num > 0);
        }

        if (restHasNums) {
          return true;
        }
      }
    }

    return false;
  },

  moveUp(matrix) {
    const reflectedMatrix = reflectMatrix(matrix);

    return this.moveLeft(reflectedMatrix);
  },

  moveDown(matrix) {
    const reflectedMatrix = reflectMatrix(matrix);

    return this.moveRight(reflectedMatrix);
  },
};

startButton.addEventListener('click', () => {
  game.isRunning = true;
  game.isWon = false;
  game.score = 0;
  toggleHidden(startButton, game.isRunning);
  toggleHidden(restartButton, !game.isRunning);
  toggleHidden(messageStart, game.isRunning);
  toggleHidden(messageWin, game.isRunning);
  createMatrix();
  addNum();
  addNum();
  renderNums();
});

restartButton.addEventListener('click', () => {
  game.isRunning = true;
  game.isLost = false;
  game.score = 0;
  toggleHidden(messageLose, !game.isLost);
  createMatrix();
  addNum();
  addNum();
  renderNums();
});

document.addEventListener('keydown', ev => {
  const key = ev.key;

  if (!key.startsWith('Arrow') || !game.isRunning) {
    return;
  }
  ev.preventDefault();

  const moveDirection = key.replace('Arrow', 'move');
  const moveIsPossible = checkDirections[moveDirection](game.matrix);

  if (!moveIsPossible) {
    return;
  }

  moves[moveDirection](game.matrix);

  addNum();
  renderNums();

  if (checkVictory(game.matrix)) {
    processVictory();
  }

  if (checkLose(game.matrix)) {
    processLose();
  }
});

function createMatrix() {
  const matrix = [];

  for (let i = 0; i < game.rowsQty; i++) {
    matrix.push([]);

    for (let n = 0; n < game.colsQty; n++) {
      matrix[i][n] = 0;
    }
  }

  game.matrix = matrix;
}

function renderNums() {
  for (let rowIndex = 0; rowIndex < game.matrix.length; rowIndex++) {
    const row = game.matrix[rowIndex];

    row.forEach((cellValue, cellIndex) => {
      const renderedCell = rows[rowIndex].children[cellIndex];

      renderedCell.className = 'field-cell';
      renderedCell.textContent = '';

      if (cellValue !== 0) {
        renderedCell.classList.add('field-cell--' + cellValue);
        renderedCell.textContent = cellValue;
      }
    });
  }

  scoreInfo.textContent = game.score;
}

function addNum() {
  const num = Math.random() > 0.1 ? 2 : 4;

  for (;;) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);

    if (game.matrix[row][col] === 0) {
      game.matrix[row][col] = num;
      break;
    }
  }
}

function toggleHidden(block, dependence) {
  block.classList.toggle('hidden', dependence);
}

function reflectMatrix(matrix) {
  const columns = [];

  for (let i = 0; i < matrix.length; i++) {
    columns.push([]);

    for (let n = 0; n < matrix[i].length; n++) {
      columns[i].push(matrix[n][i]);
    }
  }

  return columns;
}

function checkVictory(matrix) {
  for (const row of matrix) {
    const has2048 = row.some(num => num === 2048);

    if (has2048) {
      return true;
    }
  }

  return false;
}

function processVictory() {
  game.isWon = true;
  game.isRunning = false;
  toggleHidden(messageWin, !game.isWon);
  toggleHidden(restartButton, !game.isRunning);
  toggleHidden(startButton, game.isRunning);
}

function checkLose(matrix) {
  const moveVariants = [
    checkDirections.moveLeft(matrix),
    checkDirections.moveRight(matrix),
    checkDirections.moveUp(matrix),
    checkDirections.moveDown(matrix),
  ];

  const checkResult = moveVariants.some(variant => variant === true);

  return !checkResult;
}

function processLose() {
  game.isRunning = false;
  game.isLost = true;
  toggleHidden(messageLose, !game.isLost);
}
