
import { Game } from './game';

const startButton = document.querySelector('.start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const score = document.querySelector('.game-score');

const game = new Game(render);

game.render();

startButton.addEventListener('click', startRestartGame);

function startRestartGame() {
  game.startRestartGame();
}

document.addEventListener('keydown', move);

function move(e) {
  e.preventDefault();

  game.move(e.key);
}

function render() {
  // dispay Start or Restart
  if (this.play === 'STARTED') {
    startButton.textContent = 'Restart';
    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  if (this.play === 'NOT_STARTED') {
    startButton.textContent = 'Start';
    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  if (this.play === 'WIN') {
    startButton.textContent = 'Start';
    startMessage.classList.add('hidden');
    winMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
  }

  if (this.play === 'DEFEAT') {
    startButton.textContent = 'Restart';
    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.remove('hidden');
  }

  // display field
  for (let x = 0; x < this.field.length; x++) {
    const row = this.field[x];

    for (let y = 0; y < row.length; y++) {
      const value = row[y];

      const cell = document.querySelector(
        `.game-field .field-row:nth-child(${x + 1}) .field-cell:nth-child(${y + 1})` // eslint-disable-line max-len
      );

      cell.classList = ['field-cell'];

      if (value !== 0) {
        cell.textContent = `${value}`;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
    }
  }

  score.textContent = `${this.scoreCount}`;
}
