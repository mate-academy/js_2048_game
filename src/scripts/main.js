// Uncomment the next lines to use your game instance in the browser
import Game from './modules/Game.class';

const game = new Game();

// listening the classes from html files

const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const fieldCell = document.querySelector('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateDisplay() {
  scoreDisplay.textContent = game.getScore();

  const state = game.getState();

  for (let i = 0; i < fieldCell.length; i++) {
    // eslint-disable-next-line no-console
    console.log(fieldCell);

    fieldCell[i].textContent = state[Math.floor(i / 4)][i % 4] || '';
  }
}

function loseGame() {
  messageLose.classList.remove('hidden');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
}

function winGame() {
  messageWin.classList.remove('hidden');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
}

startButton.addEventListener('click', () => {
  game.start();
});

document.addEventListener('keypress', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      // eslint-disable-next-line no-console
      console.log('left');
      game.moveLeft();
      updateDisplay();

      break;
    case 'ArrowRight':
      game.moveRight();
      updateDisplay();

      break;
    case 'ArrowUp':
      game.moveUp();
      updateDisplay();

      break;
    case 'ArrowDown':
      winGame();
      game.moveDown();
      updateDisplay();

      break;
    case 'Enter':
      game.start();
      updateDisplay();

      break;
    case 'Escape':
      game.restart();
      updateDisplay();
      messageStart.classList.toggle('hidden');
      break;
    default:
      break;
  }
});
