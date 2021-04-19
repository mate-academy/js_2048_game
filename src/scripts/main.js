import { Game, State, Left, Up, Right, Down } from './game.js';

const gameField = document.querySelector('.game-field tbody');
const score = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const gameSize = 4;
const game = new Game(gameSize);

function render() {
  const inProgress = (game.gameState === State.InProgress);

  startMessage.hidden = game.gameState >= State.Started;
  startButton.classList.remove(inProgress ? 'start' : 'restart');
  startButton.classList.add(inProgress ? 'restart' : 'start');
  startButton.textContent = inProgress ? 'Restart' : 'Start';

  winMessage.classList.toggle('hidden', game.gameState !== State.Win);
  loseMessage.classList.toggle('hidden', game.gameState !== State.GameOver);
  score.textContent = game.gameScore;

  const rows = gameField.children;

  for (let i = 0; i < game.gameCells.length; i++) {
    const cellValue = game.gameCells[i];
    const rowIndex = Math.floor(i / game.gameSize);
    const columnIndex = i % game.gameSize;
    const cell = rows[rowIndex].children[columnIndex];
    const oldValue = cell.textContent;

    cell.textContent = '';

    if (oldValue.length) {
      cell.classList.remove(`field-cell--${oldValue}`);
    }

    if (cellValue !== -1) {
      cell.textContent = cellValue;
      cell.classList.add(`field-cell--${cellValue}`);
    }
  }
};

function move(direction) {
  game.move(direction);
  render();
}

startButton.addEventListener('click', (_event) => {
  game.reset();
  render();
});

document.addEventListener('keyup', (_event) => {
  if (game.gameState !== State.Started
    && game.gameState !== State.InProgress) {
    return;
  }

  switch (_event.key) {
    case 'ArrowLeft':
      move(Left);
      break;
    case 'ArrowRight':
      move(Right);
      break;
    case 'ArrowUp':
      move(Up);
      break;
    case 'ArrowDown':
      move(Down);
      break;
    default:
      break;
  }
});
