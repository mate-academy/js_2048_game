export function start(args) {
  const { Game, game, dialog, restartButton, cancelButton, controlHandler } =
    args;

  if (game.getStatus() === Game.STATUSES.idle) {
    game.start();
  } else if (game.getStatus() === Game.STATUSES.playing) {
    dialog.showModal();

    document.removeEventListener('keydown', controlHandler);

    restartButton.addEventListener('click', () => {
      game.restart();
      dialog.close();
      updateGame(args);
      document.addEventListener('keydown', controlHandler);
    });

    cancelButton.addEventListener('click', () => {
      dialog.close();
      document.addEventListener('keydown', controlHandler);
    });
  } else {
    game.restart();
  }

  updateGame(args);
}

export function control(e, args) {
  const { game, button } = args;

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

  updateGame(args);
  button.blur();
}

function updateGame(args) {
  updateGameField(args);
  updateMessage(args);
  updateButton(args);
  updateScore(args);
}

function updateScore(args) {
  const { game, gameScore } = args;

  gameScore.textContent = game.getScore();
}

function updateButton(args) {
  const { Game, game, button } = args;

  if (game.getStatus() === Game.STATUSES.idle) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
}

function updateMessage(args) {
  const { game, Game, messages } = args;

  switch (game.getStatus()) {
    case Game.STATUSES.idle:
      messages.forEach((message) => {
        if (message.classList.contains('message-start')) {
          message.classList.remove('hidden');
        } else {
          message.classList.add('hidden');
        }
      });
      break;

    case Game.STATUSES.playing:
      messages.forEach((message) => message.classList.add('hidden'));
      break;

    case Game.STATUSES.win:
      messages.forEach((message) => {
        if (message.classList.contains('message-win')) {
          message.classList.remove('hidden');
        } else {
          message.classList.add('hidden');
        }
      });
      break;

    case Game.STATUSES.lose:
      messages.forEach((message) => {
        if (message.classList.contains('message-lose')) {
          message.classList.remove('hidden');
        } else {
          message.classList.add('hidden');
        }
      });
      break;
  }
}

function updateGameField(args) {
  const { game } = args;
  const cells = document.querySelectorAll('.field-cell');
  const newState = game.getState();
  const prevState = game.getPrevState();
  let index = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = cells[index];
      const prevValue = prevState ? prevState[r][c] : 0;
      const newValue = newState[r][c];

      cell.textContent = newValue || '';
      cell.className = `field-cell field-cell--${newValue}`;

      if (newValue !== 0 && prevValue === 0) {
        cell.classList.add('field-cell--new');
      } else if (newValue !== 0 && newValue !== prevValue) {
        cell.classList.add('field-cell--merged');
      }

      index++;
    }
  }

  game.setPrevState(structuredClone(newState));
}
