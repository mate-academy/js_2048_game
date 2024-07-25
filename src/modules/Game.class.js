'use strict';

class Game {
  constructor(initialState) {
    this.score = 0;
    this.state = 'idle';
    this.startButtonHasBeenClicked = false;
    this.button = document.querySelector('.start');

    this.gameActive = false;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  getState() {
    return this.board;
  }

  updateDOMFromBoard() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];

        const cell = document.querySelector(
          `.field-row:nth-child(${row + 1}) .field-cell:nth-child(${col + 1})`,
        );

        if (cell) {
          cell.textContent = value ? value.toString() : '';
          cell.className = `field-cell field-cell--${value || ''}`;
        }
      }
    }

    if (this.board.flat().includes(2048)) {
      this.updateState('win');
    }
  }

  updateState(newState) {
    this.state = newState;
  }

  addScore(value) {
    this.score += value;

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  getScore() {
    return this.score;
  }

  initializeGame() {
    this.score = 0;
    this.addScore(0);
    this.hideMessages();

    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });

    this.spawnRandomNumber();
    this.spawnRandomNumber();

    this.updateDOMFromBoard();
  }

  start() {
    this.updateState('playing');
    this.initializeGame();
    this.startButtonHasBeenClicked = true;

    if (this.button) {
      this.button.textContent = 'Restart';
      this.button.classList.remove('start');
      this.button.classList.add('restart');
    }
  }

  restart() {
    this.updateState('idle');
    this.gameActive = false;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.addScore(0);

    this.hideMessages();
    this.updateDOMFromBoard();

    if (this.button) {
      this.button.classList.remove('restart');
      this.button.classList.add('start');
      this.button.textContent = 'Start';
    }
  }

  getStatus() {
    return this.state;
  }

  moveLeft() {
    if (this.state !== 'playing') {
      return false;
    }

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      const merged = [false, false, false, false];

      for (let col = 1; col < 4; col++) {
        if (this.board[row][col] !== 0) {
          let currentCol = col;

          while (currentCol > 0) {
            if (this.board[row][currentCol - 1] === 0) {
              this.board[row][currentCol - 1] = this.board[row][currentCol];
              this.board[row][currentCol] = 0;
              currentCol--;
              hasChanged = true;
            } else if (
              this.board[row][currentCol - 1] === this.board[row][currentCol] &&
              !merged[currentCol - 1]
            ) {
              this.board[row][currentCol - 1] *= 2;
              this.board[row][currentCol] = 0;
              merged[currentCol - 1] = true;
              this.addScore(this.board[row][currentCol - 1]);
              hasChanged = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    if (hasChanged) {
      this.spawnRandomNumber();
    }

    this.updateDOMFromBoard();

    return hasChanged;
  }

  moveRight() {
    if (this.state !== 'playing') {
      return false;
    }

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      const merged = [false, false, false, false];

      for (let col = 2; col >= 0; col--) {
        if (this.board[row][col] !== 0) {
          let currentCol = col;

          while (currentCol < 3) {
            if (this.board[row][currentCol + 1] === 0) {
              this.board[row][currentCol + 1] = this.board[row][currentCol];
              this.board[row][currentCol] = 0;
              currentCol++;
              hasChanged = true;
            } else if (
              this.board[row][currentCol + 1] === this.board[row][currentCol] &&
              !merged[currentCol + 1]
            ) {
              this.board[row][currentCol + 1] *= 2;
              this.board[row][currentCol] = 0;
              merged[currentCol + 1] = true;
              this.addScore(this.board[row][currentCol + 1]);
              hasChanged = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    if (hasChanged) {
      this.spawnRandomNumber();
    }

    this.updateDOMFromBoard();

    return hasChanged;
  }

  moveUp() {
    if (this.state !== 'playing') {
      return false;
    }

    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      const merged = [false, false, false, false];

      for (let row = 1; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          let currentRow = row;

          while (currentRow > 0) {
            if (this.board[currentRow - 1][col] === 0) {
              this.board[currentRow - 1][col] = this.board[currentRow][col];
              this.board[currentRow][col] = 0;
              currentRow--;
              hasChanged = true;
            } else if (
              this.board[currentRow - 1][col] === this.board[currentRow][col] &&
              !merged[currentRow - 1]
            ) {
              this.board[currentRow - 1][col] *= 2;
              this.board[currentRow][col] = 0;
              merged[currentRow - 1] = true;
              this.addScore(this.board[currentRow - 1][col]);
              hasChanged = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    if (hasChanged) {
      this.spawnRandomNumber();
    }

    this.updateDOMFromBoard();

    return hasChanged;
  }

  moveDown() {
    if (this.state !== 'playing') {
      return false;
    }

    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      const merged = [false, false, false, false];

      for (let row = 2; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          let currentRow = row;

          while (currentRow < 3) {
            if (this.board[currentRow + 1][col] === 0) {
              this.board[currentRow + 1][col] = this.board[currentRow][col];
              this.board[currentRow][col] = 0;
              currentRow++;
              hasChanged = true;
            } else if (
              this.board[currentRow + 1][col] === this.board[currentRow][col] &&
              !merged[currentRow + 1]
            ) {
              this.board[currentRow + 1][col] *= 2;
              this.board[currentRow][col] = 0;
              merged[currentRow + 1] = true;
              this.addScore(this.board[currentRow + 1][col]);
              hasChanged = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }

    if (hasChanged) {
      this.spawnRandomNumber();
    }

    this.updateDOMFromBoard();

    return hasChanged;
  }

  handleKeyDown(evt) {
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (!validKeys.includes(evt.key)) {
      return;
    }

    switch (evt.key) {
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
    }
  }

  spawnRandomNumber() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let row = 0; row < 4; row++) {
      // eslint-disable-next-line no-shadow
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      this.checkLoseCondition();

      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;

    this.updateDOMFromBoard();
  }

  hideMessages() {
    const messageLose = document.querySelector('.message-lose');
    const messageWin = document.querySelector('.message-win');
    const messageStart = document.querySelector('.message-start');

    if (messageLose) {
      messageLose.classList.add('hidden');
    }

    if (messageWin) {
      messageWin.classList.add('hidden');
    }

    if (messageStart) {
      messageStart.classList.add('hidden');
    }
  }

  checkLoseCondition() {
    const hasEmptyCell = this.board.flat().some((cell) => cell === 0);

    if (!hasEmptyCell) {
      const canMerge = this.checkPossibleMerges();

      if (!canMerge) {
        this.hideMessages();
        this.updateState('lose');
        document.querySelector('.message-lose').classList.remove('hidden');
        this.gameActive = false;
      }
    }
  }

  checkPossibleMerges(cels) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          (col < 3 && this.board[row][col] === this.board[row][col + 1]) ||
          (row < 3 && this.board[row][col] === this.board[row + 1][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
