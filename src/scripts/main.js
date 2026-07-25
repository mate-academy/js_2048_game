'use strict';

'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-start').classList.add('hidden');
    game.restart();
  }

  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');

    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-start').classList.add('hidden');
    startButton.classList.add('restart');
    startButton.innerHTML = 'Restart';

    game.restart();
  }

  rendering(game.field);
});

document.addEventListener('keydown', (keydownEvent) => {
  switch (keydownEvent.code) {
    case 'ArrowLeft':
    case 'KeyA':
      game.moveLeft(game.field);
      break;
    case 'ArrowRight':
    case 'KeyD':
      game.moveRight(game.field);
      break;
    case 'ArrowUp':
    case 'KeyW':
      game.moveUp(game.field);
      break;
    case 'ArrowDown':
    case 'KeyS':
      game.moveDown(game.field);
      break;
    default:
      break;
  }

  game.randomSpawn();
  rendering(game.field);

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.innerHTML = 'Start';
  }

  if (gameStatus === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  document.querySelector('.game-score').innerHTML = game.getScore();
});

const gameField = document.querySelector('.body-field');

function rendering(field) {
  for (let i = 0; i < field.length; i += 1) {
    for (let j = 0; j < field[i].length; j += 1) {
      const fieldCell = gameField.children[i].children[j];
      const value = field[i][j];

      [...fieldCell.classList].forEach((element) => {
        if (element.startsWith('field-cell--')) {
          fieldCell.classList.remove(element);
          fieldCell.innerHTML = '';
        }
      });

      if (value !== 0) {
        fieldCell.innerHTML = value;
        fieldCell.classList.add(`field-cell--${value}`);
      }
    }
  }
}
