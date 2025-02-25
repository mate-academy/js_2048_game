'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.getElementsByClassName('button start')[0];
const fieldRow = document.getElementsByClassName('field-row');
const score = document.getElementsByClassName('info')[0];
const message = document.getElementsByClassName('message-container')[0];
const loseMessage = message.children[0];
const winMessage = message.children[1];
const startMessage = message.children[2];

function scoreGame() {
  score.innerHTML = `Score: ${game.getScore()}`;
}

function showStatus() {
  if (game.getStatus() === 'playing') {
    startMessage.classList.add('hidden');
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'idle') {
    startMessage.classList.remove('hidden');
  }
}

function showNumbers(startState = [[], [], [], []]) {
  for (let i = 0; i < startState.length; i++) {
    for (let j = 0; j < startState[i].length; j++) {
      if (startState[i][j] > 0) {
        fieldRow[i].children[j].textContent = startState[i][j];

        if (+fieldRow[i].children[j].textContent === 2) {
          fieldRow[i].children[j].classList.add(
            `field-cell--${startState[i][j]}`,
          );
        }

        if (+fieldRow[i].children[j].textContent === 4) {
          fieldRow[i].children[j].classList.add(`field-cell--4`);
        }
      }
    }
  }
}

function rewriteNumbers(startState) {
  for (let i = 0; i < startState.length; i++) {
    for (let j = 0; j < startState.length; j++) {
      if (startState[i][j] === 0) {
        fieldRow[i].children[j].textContent = '';
        fieldRow[i].children[j].className = 'field-cell';
      } else {
        fieldRow[i].children[j].textContent = startState[i][j];

        fieldRow[i].children[j].className = 'field-cell';

        fieldRow[i].children[j].classList.add(
          `field-cell--${startState[i][j]}`,
        );
      }
    }
  }
}

button.addEventListener('click', () => {
  scoreGame();

  if (button.textContent === 'Start') {
    game.start();

    const startState = game.getState();

    showNumbers(startState);

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();

    const startState = game.getState();

    rewriteNumbers(startState);
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    score.innerHTML = `Score: 0`;
  }

  showStatus();
});

document.addEventListener('keydown', (e) => {
  if (button.textContent === 'Restart') {
    scoreGame();

    switch (e.key) {
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;

      case 'ArrowLeft':
        game.moveLeft();
        break;
    }

    const startState = game.getState();

    rewriteNumbers(startState);
  }

  showStatus();
  scoreGame();
});
