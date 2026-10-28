'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const trAll = document.querySelectorAll('tr');
const buttonSR = document.querySelector('.start');

buttonSR.addEventListener('click', () => {
  if (buttonSR.className === 'button start') {
    gameStart();
  } else {
    gameRestart();
  }
});

document.addEventListener('keydown', (even) => {
  if (game.getStatus() === 'playing') {
    if (even.key === 'ArrowLeft') {
      game.moveLeft(even.key);
    }

    if (even.key === 'ArrowRight') {
      game.moveRight(even.key);
    }

    if (even.key === 'ArrowUp') {
      game.moveUp(even.key);
    }

    if (even.key === 'ArrowDown') {
      game.moveDown(even.key);
    }

    scoreUpdate(game.getScore());
    changeHTNL();
  } else if (game.getStatus() === 'lose') {
    changeMessageContainer(game.getStatus());
  } else if (game.getStatus() === 'win') {
    changeMessageContainer(game.getStatus());
  }
});

function scoreUpdate(score) {
  const spanScore = document.querySelector('.game-score');

  spanScore.textContent = score;
}

function changeHTNL() {
  for (let i = 0; i < game.state.length; i++) {
    const row = game.state[i];

    for (let cell = 0; cell < row.length; cell++) {
      const changeCell = trAll[i].children[cell];

      changeCell.setAttribute('class', 'field-cell');

      if (row[cell] === 0) {
        changeCell.textContent = '';
        changeCell.setAttribute('class', 'field-cell');
      } else {
        changeCell.textContent = row[cell];
        changeCell.classList.add(`field-cell--${row[cell]}`);
      }
    }
  }
}

function gameStart() {
  game.start();
  buttonSR.classList.remove('start');
  buttonSR.classList.add('restart');
  buttonSR.textContent = 'Restart';
  document.querySelector('.message-start').classList.toggle('hidden');
  changeHTNL();
}

function gameRestart() {
  game.restart();
  changeMessageContainer('Restart');
  changeHTNL();
  scoreUpdate(game.getScore());
}

function changeMessageContainer(gameStatus) {
  if (gameStatus === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  }

  if (gameStatus === 'Restart') {
    document.querySelector('.message-win').classList.toggle('hidden', true);
    document.querySelector('.message-lose').classList.toggle('hidden', true);
  }
}
