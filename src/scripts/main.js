'use strict';
// Добавить логику старт рестарт , скор , в старте рестарте что бы менялся
// статус игры
//

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// #region Getters

game.getState = function () {
  const field = document.querySelector('table');
  const fieldRow = field.rows;
  const state = {
    field: [],
    score: this.getScore(),
  };

  for (let i = 0; i < 4; i++) {
    const row = [];

    for (let j = 0; j < 4; j++) {
      row.push(fieldRow[i].cells[j].textContent);
    }

    state.field.push(row);
  }

  return state;
};

game.getScore = function () {
  return this.score;
};

game.getStatus = function () {
  return this.status;
};

// #endregions

// #region Movies

game.moveLeft = function () {
  const field = game.getState().field;
  const copyField = [[], [], [], []];
  let fieldChanged = false;
  let addScoreIsMove = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      copyField[i][j] = Number(field[i][j]) === 0 ? '' : Number(field[i][j]);
    }
  }

  for (let i = 0; i < 4; i++) {
    let row = [...field[i]]
      .filter((item) => Number(item) !== 0)
      .map((item) => Number(item));

    for (let j = 0; j < row.length; j++) {
      if (Number(row[j]) === Number(row[j + 1])) {
        row[j] = Number(row[j]) * 2;
        addScoreIsMove += Number(row[j]);
        row[j + 1] = '';
        j++;
      }
    }

    row = row.filter((item) => item !== '');

    for (let ite = row.length; ite < 4; ite++) {
      row.push('');
    }

    field[i] = row;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (copyField[i][j] !== field[i][j]) {
        fieldChanged = true;
        break;
      }
    }
  }

  if (fieldChanged) {
    this.score += addScoreIsMove;
    game.spawnRandom(field);
    game.checkGameStatus();
  }
};

game.moveRight = function () {
  const field = game.getState().field;
  const copyField = [[], [], [], []];
  let fieldChanged = false;
  let addScoreIsMove = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      copyField[i][j] = Number(field[i][j]) === 0 ? '' : Number(field[i][j]);
    }
  }

  for (let i = 0; i < 4; i++) {
    let row = [...field[i]]
      .filter((item) => Number(item) !== 0)
      .map((item) => Number(item));

    for (let j = row.length - 1; j > 0; j--) {
      if (Number(row[j]) === Number(row[j - 1])) {
        row[j] = Number(row[j]) * 2;
        addScoreIsMove += Number(row[j]);
        row[j - 1] = '';
        j--;
      }
    }

    row = row.filter((item) => item !== '');

    for (let ite = row.length; ite < 4; ite++) {
      row.unshift('');
    }

    field[i] = row;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (copyField[i][j] !== field[i][j]) {
        fieldChanged = true;
        break;
      }
    }
  }

  if (fieldChanged) {
    this.score += addScoreIsMove;
    game.spawnRandom(field);
    game.checkGameStatus();
  }
};

game.moveDown = function () {
  const field = game.getState().field;
  const columns0 = [];
  const columns1 = [];
  const columns2 = [];
  const columns3 = [];
  const columns = [columns0, columns1, columns2, columns3];
  const copyField = [[], [], [], []];
  let fieldChanged = false;
  let addScoreIsMove = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      copyField[i][j] = Number(field[i][j]) === 0 ? '' : Number(field[i][j]);
    }
  }

  for (let i = 0; i < 4; i++) {
    const row = [...field[i]];

    for (let j = 0; j < 4; j++) {
      if (j === 0) {
        columns[0].push(row[j]);
      }

      if (j === 1) {
        columns[1].push(row[j]);
      }

      if (j === 2) {
        columns[2].push(row[j]);
      }

      if (j === 3) {
        columns[3].push(row[j]);
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    columns[i] = columns[i]
      .filter((item) => Number(item) !== 0)
      .map((item) => Number(item));
  }

  for (let i = 0; i < 4; i++) {
    for (let j = columns[i].length - 1; j > 0; j--) {
      if (Number(columns[i][j]) === Number(columns[i][j - 1])) {
        columns[i][j] = Number(columns[i][j]) * 2;
        addScoreIsMove += Number(columns[i][j]);
        columns[i][j - 1] = '';
        j--;
      }
    }

    columns[i] = columns[i].filter((item) => item !== '');

    for (let ite = columns[i].length; ite < 4; ite++) {
      columns[i].unshift('');
    }
  }

  for (let i = 0; i < 4; i++) {
    const row = [...field[i]];

    for (let j = 0; j < 4; j++) {
      row[j] = columns[j][i];
    }
    field[i] = row;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (copyField[i][j] !== field[i][j]) {
        fieldChanged = true;
        break;
      }
    }
  }

  if (fieldChanged) {
    this.score += addScoreIsMove;
    game.spawnRandom(field);
    game.checkGameStatus();
  }
};

game.moveUp = function () {
  const field = game.getState().field;
  const columns0 = [];
  const columns1 = [];
  const columns2 = [];
  const columns3 = [];
  const columns = [columns0, columns1, columns2, columns3];
  const copyField = [[], [], [], []];
  let fieldChanged = false;
  let addScoreIsMove = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      copyField[i][j] = Number(field[i][j]) === 0 ? '' : Number(field[i][j]);
    }
  }

  for (let i = 0; i < 4; i++) {
    const row = [...field[i]];

    for (let j = 0; j < 4; j++) {
      if (j === 0) {
        columns[0].push(row[j]);
      }

      if (j === 1) {
        columns[1].push(row[j]);
      }

      if (j === 2) {
        columns[2].push(row[j]);
      }

      if (j === 3) {
        columns[3].push(row[j]);
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    columns[i] = columns[i]
      .filter((item) => Number(item) !== 0)
      .map((item) => Number(item));
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < columns[i].length; j++) {
      if (Number(columns[i][j]) === Number(columns[i][j + 1])) {
        columns[i][j] = Number(columns[i][j]) * 2;
        addScoreIsMove += Number(columns[i][j]);
        columns[i][j + 1] = '';
        j++;
      }
    }

    columns[i] = columns[i].filter((item) => item !== '');

    for (let ite = columns[i].length; ite < 4; ite++) {
      columns[i].push('');
    }
  }

  for (let i = 0; i < 4; i++) {
    const row = [...field[i]];

    for (let j = 0; j < 4; j++) {
      row[j] = columns[j][i];
    }
    field[i] = row;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (copyField[i][j] !== field[i][j]) {
        fieldChanged = true;
        break;
      }
    }
  }

  if (fieldChanged) {
    this.score += addScoreIsMove;
    game.spawnRandom(field);
    game.checkGameStatus();
  }
};
// #endregion

// #region Render

game.render = function (field) {
  const table = document.querySelector('table');
  const rowState = table.rows;
  const spanScore = document.querySelector('.game-score');

  spanScore.textContent = game.getScore();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      rowState[i].cells[j].className = 'field-cell';
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      rowState[i].cells[j].textContent = field[i][j];

      if (Number(field[i][j]) !== 0) {
        rowState[i].cells[j].classList.add(`field-cell--${field[i][j]}`);
      }
    }
  }
};

game.spawnRandom = function (field) {
  const emptyCells = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (Number(field[i][j]) === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, column] = emptyCells[randomIndex];

    field[row][column] = Math.random() < 0.1 ? 4 : 2;
  }

  game.render(field);
};

// #endregion

// #region CheckGameStatus

game.checkGameStatus = function () {
  const field = game.getState().field;
  let emptyCells = false;
  let isMoveHorisontal = false;
  let isMoveVertical = false;

  // Is Win

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (Number(field[i][j]) === 2048) {
        const isMessage = document.querySelector('.message-win');

        isMessage.classList.remove('hiden');
        this.status = 'win';

        return;
      }
    }
  }

  // Is Lose

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (Number(field[i][j]) === 0) {
        emptyCells = true;
        break;
      }
    }
  }

  if (emptyCells) {
    this.status = 'playing';

    return;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (Number(field[i][j]) === Number(field[i][j + 1])) {
        isMoveHorisontal = true;
        break;
      }
    }
  }

  if (isMoveHorisontal) {
    this.status = 'playing';

    return;
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (Number(field[i][j]) === Number(field[i + 1][j])) {
        isMoveVertical = true;
        break;
      }
    }
  }

  if (isMoveVertical) {
    this.status = 'playing';

    return;
  }

  this.status = 'lose';

  const messageDiv = document.querySelector('.message-lose');

  messageDiv.classList.remove('hidden');
};

// #endregion

// #region Start-Restart

game.restart = function () {
  this.score = 0;

  const gameScore = document.querySelector('.game-score');

  gameScore.textContent = this.score;

  const isMessageLose = document.querySelector('.message-lose');
  const isMessageWin = document.querySelector('.message-lose');
  const table = document.querySelector('table');
  const rows = table.rows;

  if (isMessageLose) {
    isMessageLose.classList.add('hidden');
  }

  if (isMessageWin) {
    isMessageWin.classList.add('hidden');
  }

  for (let i = 0; i < 4; i++) {
    const row = rows[i];

    for (let j = 0; j < 4; j++) {
      row.cells[j].textContent = '';
      row.cells[j].className = 'field-cell';
    }
  }

  this.status = 'idle';
};

game.start = function () {
  const field = game.getState().field;

  game.spawnRandom(field);
  game.spawnRandom(field);
  this.status = 'playing';
};

document.addEventListener('click', (e) => {
  const button = document.querySelector('button');

  if (e.target.closest('.start')) {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    const messageDiv = document.querySelector('.message-start');

    messageDiv.classList.add('hidden');

    return;
  }

  if (e.target.closest('.restart')) {
    game.restart();
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    const messageDiv = document.querySelector('.message-start');

    messageDiv.classList.remove('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    if (game.getStatus() !== 'idle') {
      game.moveLeft();
    }
  }

  if (e.key === 'ArrowRight') {
    if (game.getStatus() !== 'idle') {
      game.moveRight();
    }
  }

  if (e.key === 'ArrowDown') {
    if (game.getStatus() !== 'idle') {
      game.moveDown();
    }
  }

  if (e.key === 'ArrowUp') {
    if (game.getStatus() !== 'idle') {
      game.moveUp();
    }
  }
});

// #endregion
