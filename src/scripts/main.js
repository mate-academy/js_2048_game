'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const body = document.querySelector('body');

const container = body.querySelector('.container');
// елементи голови нашой гри
const headGame = container.querySelector('.game-header');
const gameControls = headGame.querySelector('.controls');
const relScr = gameControls.querySelector('.info').querySelector('.game-score');
const btnStart = gameControls.querySelector('.button');
// ігрова дошка нашой гри
const allGamefield = container.querySelector('.game-field');
const tBody = allGamefield.querySelector('tbody');
const allRow = tBody.querySelectorAll('.field-row');
// повідомлення про стан гри
const allMessage = container.querySelector('.message-container');
const winMasseg = allMessage.querySelector('.message-win');
const loseMasseg = allMessage.querySelector('.message-lose');
const startMasseg = allMessage.querySelector('.message-start');
// функція для оновлення дошки

function renderBoard(board) {
  allRow.forEach((row, i) => {
    const allCells = row.querySelectorAll('.field-cell');

    allCells.forEach((cell, j) => {
      cell.textContent = board[i][j] === 0 ? '' : board[i][j];
      cell.className = 'field-cell';

      const valeCell = Number(cell.textContent);

      if (valeCell > 0) {
        cell.classList.add(`field-cell--${valeCell}`);
      }
    });
  });
  udateRec();
}
// функція перевірки програшу/виграшу

function statusCheker() {
  cleanAllMes();

  if (game.getStatus() === 'win') {
    addMesage(winMasseg);
  }

  if (game.getStatus() === 'lose') {
    addMesage(loseMasseg);
  }
}
// обробка початку гри

btnStart.addEventListener('click', (e) => {
  cleanAllMes();

  if (btnStart.classList.contains('start')) {
    game.start();
    btnStart.textContent = 'Restart';
    btnStart.classList.replace('start', 'restart');
  } else if (btnStart.classList.contains('restart')) {
    game.restart();
    btnStart.textContent = 'Start';
    btnStart.classList.replace('restart', 'start');
    addMesage(startMasseg);
  }

  renderBoard(game.getState());
});

// прибрати усі повідомлення

function cleanAllMes() {
  startMasseg.classList.add('hidden');
  winMasseg.classList.add('hidden');
  loseMasseg.classList.add('hidden');
}

// вивести повідомлення

function addMesage(message) {
  message.classList.remove('hidden');
}

// зміна рахунку

function udateRec() {
  relScr.textContent = game.getScore();
}

// обробка руху

document.addEventListener('keydown', (e) => {
  let moveTreker = false;

  if (!game.firstMove) {
    return;
  }

  if (game.getStatus() === 'win' || game.getStatus() === 'lose') {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      moveTreker = true;
      break;

    case 'ArrowDown':
      game.moveDown();
      moveTreker = true;
      break;

    case 'ArrowLeft':
      game.moveLeft();
      moveTreker = true;
      break;

    case 'ArrowRight':
      game.moveRight();
      moveTreker = true;
      break;
  }

  if (moveTreker) {
    renderBoard(game.getState());
    statusCheker();
  }
});
