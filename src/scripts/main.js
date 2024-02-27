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

  // move function
  move(direction) {
    let moved = false;
    let start, end, step;

    if (direction === 'left' || direction === 'up') {
      start = 1;
      end = 4;
      step = 1;
    } else {
      start = 2;
      end = -1;
      step = -1;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = start; j !== end; j += step) {
        const cellValue = (direction === 'left' || direction === 'right')
          ? this.board[i][j]
          : this.board[j][i];
        let k = j;

        if (cellValue !== 0) {
          let condition;

          if (direction === 'left' || direction === 'up') {
            condition = k > 0;
          } else {
            condition = k < 3;
          }

          while (condition && (direction === 'left' || direction === 'right')
            ? this.board[i][k - step] === 0
            : this.board[k - step][i] === 0) {
            if (direction === 'left' || direction === 'right') {
              this.board[i][k - step] = this.board[i][k];
              this.board[i][k] = 0;
            } else {
              this.board[k - step][i] = this.board[k][i];
              this.board[k][i] = 0;
            }
            k -= step;
            moved = true;
          }

          if (condition && (direction === 'left' || direction === 'right')
            ? this.board[i][k - step] === this.board[i][k]
            : this.board[k - step][i] === this.board[k][i]) {
            if (direction === 'left' || direction === 'right') {
              this.board[i][k - step] *= 2;
              this.score += this.board[i][k - step];
              this.board[i][k] = 0;
            } else {
              this.board[k - step][i] *= 2;
              this.score += this.board[k - step][i];
              this.board[k][i] = 0;
            }
            moved = true;
          }
        }
      }
    }

    if (moved) {
      this.generateNewNumber();
    }
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
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
    this.status = 'idle';
    this.generateNewNumber();
    this.generateNewNumber();
    document.querySelector('.message-start').classList.add('hidden');
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
            row: i, col: j,
          });
        }
      }
    }

    if (emptyCells.length > 0) {
      const
        {
          row,
          col,
        } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = this.generateRandomNumber();
    }
  }
}

// Handle keydown events
document.addEventListener('keydown', evt => {
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

  // Показ або приховування повідомлень
  if (stat === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (stat === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  } else {
    document.querySelector('.message-container').classList.add('hidden');
  }

  const startButton = document.querySelector('.start');

  // Зміна тексту кнопки під час гри
  if (stat === 'playing' && startButton) {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

// Initialize game
const game = new Game();

updateUI();

// Add event listener to the start/restart button
document.querySelector('.container').addEventListener('click', evt => {
  if (evt.target.classList.contains('start')
  || evt.target.classList.contains('restart')) {
    game.restart();
    updateUI();
  }
});
