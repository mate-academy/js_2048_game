'use strict';
class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }
  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 1; j < 4; j++) {
        if (this.board[i][j] !== 0) {
          let k = j;

          while (k > 0 && this.board[i][k - 1] === 0) {
            this.board[i][k - 1] = this.board[i][k];
            this.board[i][k] = 0;
            k--;
            moved = true;
          }

          if (k > 0 && this.board[i][k - 1] === this.board[i][k]) {
            this.board[i][k - 1] *= 2;
            this.score += this.board[i][k - 1];
            this.board[i][k] = 0;
            moved = true;
          }
        }
      }
    }

    if (moved) {
      this.generateNewNumber();
    }
  }
  moveRight() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 2; j >= 0; j--) {
        if (this.board[i][j] !== 0) {
          let k = j;

          while (k < 3 && this.board[i][k + 1] === 0) {
            this.board[i][k + 1] = this.board[i][k];
            this.board[i][k] = 0;
            k++;
            moved = true;
          }

          if (k < 3 && this.board[i][k + 1] === this.board[i][k]) {
            this.board[i][k + 1] *= 2;
            this.score += this.board[i][k + 1];
            this.board[i][k] = 0;
            moved = true;
          }
        }
      }
    }

    if (moved) {
      this.generateNewNumber();
    }
  }
  moveUp() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      for (let i = 1; i < 4; i++) {
        if (this.board[i][j] !== 0) {
          let k = i;

          while (k > 0 && this.board[k - 1][j] === 0) {
            this.board[k - 1][j] = this.board[k][j];
            this.board[k][j] = 0;
            k--;
            moved = true;
          }

          if (k > 0 && this.board[k - 1][j] === this.board[k][j]) {
            this.board[k - 1][j] *= 2;
            this.score += this.board[k - 1][j];
            this.board[k][j] = 0;
            moved = true;
          }
        }
      }
    }

    if (moved) {
      this.generateNewNumber();
    }
  }
  moveDown() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      for (let i = 2; i >= 0; i--) {
        if (this.board[i][j] !== 0) {
          let k = i;

          while (k < 3 && this.board[k + 1][j] === 0) {
            this.board[k + 1][j] = this.board[k][j];
            this.board[k][j] = 0;
            k++;
            moved = true;
          }

          if (k < 3 && this.board[k + 1][j] === this.board[k][j]) {
            this.board[k + 1][j] *= 2;
            this.score += this.board[k + 1][j];
            this.board[k][j] = 0;
            moved = true;
          }
        }
      }
    }

    if (moved) {
      this.generateNewNumber();
    }
  }
  getScore() {
    return this.score;
  }
  getState() {
    return this.board;
  }
  getStatus() {
    return ['idle', 'playing', 'win', 'lose'].includes(this.status)
      ? this.status
      : 'idle';
  }
  start() {
    this.status = 'playing';
    this.generateNewNumber();
    this.generateNewNumber();
  }
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }
  generateRandomNumber() {
    return Math.random() < 0.9 ? 2 : 4;
  }
  generateNewNumber() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({
            row: i,
            col: j,
          });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col }
        = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = this.generateRandomNumber();
    }
  }
}

// Handle keydown events
document.addEventListener('keydown', (evt) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(evt.key)) {
    evt.preventDefault();

    switch (evt.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
    }
    updateUI();
  }
});

// Update UI function
function updateUI() {
  const board = game.getState();

  // Оновлення стану дошки
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = document.querySelector(`.field-row:nth-child(${i + 1})
      .field-cell:nth-child(${j + 1})`);

      cell.textContent = board[i][j] === 0 ? '' : board[i][j];
      cell.className = 'field-cell';

      // Додавання класу для стилізації згідно зі значенням
      if (board[i][j] !== 0) {
        cell.classList.add(`field-cell--${board[i][j]}`);
      }
    }
  }
  // Оновлення рахунку
  document.querySelector('.game-score').textContent = game.getScore();

  const stat = game.getStatus();
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  // Показ або приховування повідомлень
  if (stat === 'win') {
    winMessage.classList.remove('hidden');
  } else if (stat === 'lose' || !canMove()) {
    loseMessage.classList.remove('hidden');
  } else {
    loseMessage.classList.add('hidden');
  }

  // Функція перевірки можливості ходу
  function canMove() {
  // Перевірка, чи є порожні клітини
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (game.board[i][j] === 0) {
          return true;
        }
      }
    }

    // Перевірка, чи є можливість злиття клітин
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
      // Перевірка можливості злиття з клітинами поряд
        if (i > 0 && game.board[i][j] === game.board[i - 1][j]) {
          return true;
        }

        if (i < 3 && game.board[i][j] === game.board[i + 1][j]) {
          return true;
        }

        if (j > 0 && game.board[i][j] === game.board[i][j - 1]) {
          return true;
        }

        if (j < 3 && game.board[i][j] === game.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  const startButton = document.querySelector('.start');

  // Зміна тексту кнопки під час гри
  if (stat === 'playing' && startButton) {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }

  // Додавання повідомлення перед початком гри
  const startMessage = document.querySelector('.message-start');

  if (stat === 'idle') {
    startMessage.classList.remove('hidden');
  } else {
    startMessage.classList.add('hidden');
  }
}

const game = new Game();

// Initialize game
updateUI();

// Add event listener to the start/restart button
document.querySelector('.container').addEventListener('click', (evt) => {
  if (
    evt.target.classList.contains('start')
    || evt.target.classList.contains('restart')
  ) {
    game.restart();
    updateUI();
  }
});
