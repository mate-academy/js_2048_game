'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');
let gameActive = false;

button.addEventListener('click', () => {
  game.start(button, hideMessages, spawnNumbers);
});

document.addEventListener('keydown', handleKeyDown);

function spawnNumbers() {
  const cels = document.querySelectorAll('.field-cell');
  const emptyCells = Array.from(cels).filter((cell) => cell.textContent === '');

  if (emptyCells.length < 2) {
    hideMessages();
    document.querySelector('.message-lose').classList.remove('hidden');
    gameActive = false;

    return;
  }

  const randomIndex1 = Math.floor(Math.random() * emptyCells.length);
  const cell1 = emptyCells[randomIndex1];

  emptyCells.splice(randomIndex1, 1);

  const randomIndex2 = Math.floor(Math.random() * emptyCells.length);
  const cell2 = emptyCells[randomIndex2];

  cell1.innerHTML = '2';
  cell1.classList.add('field-cell--2');

  const number2 = Math.random() < 0.1 ? 4 : 2;

  cell2.innerHTML = number2.toString();
  cell2.classList.add(`field-cell--${number2}`);

  if (number2 === 2048) {
    hideMessages();
    document.querySelector('.message-win').classList.remove('hidden');
    gameActive = false;
  }
}

function handleKeyDown(evt) {
  if (!gameActive) {
    return;
  }

  const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (!validKeys.includes(evt.key)) {
    return;
  }

  let hasChanged = false;

  switch (evt.key) {
    case 'ArrowUp':
      hasChanged = game.moveUp(hideMessages);
      break;
    case 'ArrowDown':
      hasChanged = game.moveDown(hideMessages);
      break;
    case 'ArrowLeft':
      hasChanged = game.moveLeft(hideMessages);
      break;
    case 'ArrowRight':
      hasChanged = game.moveRight(hideMessages);
      break;
  }

  if (hasChanged) {
    spawnRandomNumber();
    checkLoseCondition();
  }
}

function spawnRandomNumber() {
  const cels = document.querySelectorAll('.field-cell');
  const emptyCells = Array.from(cels).filter((cell) => cell.textContent === '');

  if (emptyCells.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  const number = Math.random() < 0.1 ? 4 : 2;

  randomCell.innerHTML = number.toString();
  randomCell.classList.add(`field-cell--${number}`);
}

function hideMessages() {
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-start').classList.add('hidden');
}

button.addEventListener('click', () => {
  game.restart(button, hideMessages, spawnNumbers);
  gameActive = true;
});

function checkLoseCondition() {
  const cels = document.querySelectorAll('.field-cell');
  const emptyCells = Array.from(cels).filter((cell) => cell.textContent === '');

  if (emptyCells.length === 0) {
    const canMerge = checkPossibleMerges(cels);

    if (!canMerge) {
      hideMessages();
      document.querySelector('.message-lose').classList.remove('hidden');
      gameActive = false;
    }
  }
}

function checkPossibleMerges(cels) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = cels[row * 4 + col].textContent;

      if (cell === '') {
        return true;
      }

      if (col < 3 && cell === cels[row * 4 + (col + 1)].textContent) {
        return true;
      }

      if (row < 3 && cell === cels[(row + 1) * 4 + col].textContent) {
        return true;
      }
    }
  }

  return false;
}
