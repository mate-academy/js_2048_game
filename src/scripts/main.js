// ...existing code...
import Game from '../modules/Game.class.js';

// DOM-елементи
const boardElement = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// створюємо поле 4x4 в DOM, якщо воно не задане в HTML
const createField = () => {
  if (!boardElement) {
    return;
  }

  if (boardElement.querySelectorAll('.field-row').length) {
    return;
  }

  boardElement.innerHTML = '';

  for (let i = 0; i < 4; i += 1) {
    const row = document.createElement('tr');

    row.className = 'field-row';

    for (let j = 0; j < 4; j += 1) {
      const cell = document.createElement('td');

      cell.className = 'field-cell';
      cell.textContent = '';
      row.appendChild(cell);
    }
    boardElement.appendChild(row);
  }
};

createField();

// Ігровий екземпляр
let game = null;

let lastGameStatus = null;

function monitorGameStatus() {
  if (!game) {
    lastGameStatus = null;
    requestAnimationFrame(monitorGameStatus);

    return;
  }

  const currentStatus =
    typeof game.getStatus === 'function' ? game.getStatus() : null;

  if (currentStatus !== lastGameStatus) {
    lastGameStatus = currentStatus;

    if (currentStatus === null) {
      showMessage('start');
    } else {
      showMessage(currentStatus);
    }
  }

  requestAnimationFrame(monitorGameStatus);
}

// Запускаємо моніторинг один раз
monitorGameStatus();

// Показ/ховання повідомлень та керування видимістю кнопки Restart
function showMessage(someStatus) {
  if (messageStart) {
    messageStart.classList.add('hidden');
  }

  if (messageWin) {
    messageWin.classList.add('hidden');
  }

  if (messageLose) {
    messageLose.classList.add('hidden');
  }

  if (someStatus === 'win') {
    if (messageWin) {
      messageWin.classList.remove('hidden');
    }

    if (startButton) {
      startButton.classList.remove('hidden');
    }

    return;
  }

  if (someStatus === 'lose') {
    if (messageLose) {
      messageLose.classList.remove('hidden');
    }

    if (startButton) {
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
      startButton.classList.remove('hidden');
    }

    return;
  }

  if (someStatus === 'start') {
    if (messageStart) {
      messageStart.classList.remove('hidden');
    }

    if (startButton) {
      startButton.classList.remove('hidden');
    }

    return;
  }

  if (someStatus === 'playing') {
    if (messageStart) {
      messageStart.classList.add('hidden');
    }

    if (messageWin) {
      messageWin.classList.add('hidden');
    }

    if (messageLose) {
      messageLose.classList.add('hidden');
    }

    if (startButton) {
      startButton.classList.remove('hidden');
    }
  }
}

// Старт/Restart кнопка
if (startButton) {
  startButton.addEventListener('click', () => {
    const isStartButton = startButton.classList.contains('start');

    if (
      isStartButton &&
      game &&
      typeof game.getStatus === 'function' &&
      game.getStatus() === 'playing'
    ) {
      return;
    }

    if (!game) {
      game = new Game();
    }

    game.restart();
    render();

    if (messageStart) {
      messageStart.classList.add('hidden');
    }

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.classList.remove('hidden');
    showMessage('playing');
  });
}

// Обробник клавіш для руху плиток
document.addEventListener('keydown', (evt) => {
  if (
    !game ||
    typeof game.getStatus !== 'function' ||
    game.getStatus() !== 'playing'
  ) {
    return;
  }

  switch (evt.key) {
    case 'ArrowLeft':
      if (typeof game.moveLeft === 'function') {
        game.moveLeft();
      }
      break;

    case 'ArrowRight':
      if (typeof game.moveRight === 'function') {
        game.moveRight();
      }
      break;

    case 'ArrowUp':
      if (typeof game.moveUp === 'function') {
        game.moveUp();
      }
      break;

    case 'ArrowDown':
      if (typeof game.moveDown === 'function') {
        game.moveDown();
      }
      break;

    default:
      return;
  }

  render();

  const gameStatus =
    typeof game.getStatus === 'function' ? game.getStatus() : null;

  if (gameStatus === 'win') {
    showMessage('win');
  } else if (gameStatus === 'lose') {
    showMessage('lose');
  } else {
    showMessage('playing');
  }
});

// Функція рендеру поля і рахунку
function render() {
  if (!game) {
    return;
  }

  const board = typeof game.getState === 'function' ? game.getState() : null;
  const score = typeof game.getScore === 'function' ? game.getScore() : 0;

  if (!board || !Array.isArray(board) || board.length === 0) {
    return;
  }

  const rows = boardElement.querySelectorAll('.field-row');

  rows.forEach((rowEl, rowIdx) => {
    const cells = rowEl.querySelectorAll('.field-cell');

    cells.forEach((cellEl, colIdx) => {
      const value = board[rowIdx][colIdx];

      cellEl.textContent = value === 0 ? '' : value;
      cellEl.className = 'field-cell';

      if (value !== 0) {
        cellEl.classList.add(`field-cell--${value}`);
      }
    });
  });

  if (scoreElement) {
    scoreElement.textContent = String(score);
  }
}

// Початковий стан інтерфейсу
showMessage('start');
