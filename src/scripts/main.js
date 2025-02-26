import Game from '../modules/Game.class';

const game = new Game();

const gameButton = document.querySelector('.button');
const gameField = document.querySelector('.game-field');
const score = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

gameButton.addEventListener('click', () => {
  const hasStarted = gameButton.textContent === 'Start';

  if (hasStarted) {
    game.start();

    document.addEventListener('keydown', handleKeyDown);
  } else {
    game.restart();

    document.removeEventListener('keydown', handleKeyDown);

    [messageWin, messageLose].forEach((message) => {
      message.classList.add('hidden');
    });

    updateGameScore();
  }

  gameButton.textContent = hasStarted ? 'Restart' : 'Start';
  gameButton.classList.toggle('start', !hasStarted);
  gameButton.classList.toggle('restart', hasStarted);
  messageStart.classList.toggle('hidden', hasStarted);

  updateGameBoard();
});

const updateGameBoard = () => {
  gameField.innerHTML = '';

  const state = game.getState();

  state.forEach((row) => {
    const tableRow = document.createElement('tr');

    row.forEach((cell) => {
      const tableCell = document.createElement('td');

      tableCell.textContent = cell || '';
      tableCell.classList.add('field-cell');

      if (cell) {
        tableCell.classList.add(`field-cell--${cell}`);
      }

      tableRow.appendChild(tableCell);
    });

    gameField.appendChild(tableRow);
  });
};

const updateGameScore = () => {
  score.textContent = game.getScore();
};

const updateGameMessage = () => {
  if (game.getStatus() === Game.STATUS.WIN) {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === Game.STATUS.LOSE) {
    messageLose.classList.remove('hidden');
  }
};

const handleKeyDown = (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  updateGameBoard();
  updateGameScore();
  updateGameMessage();
};
