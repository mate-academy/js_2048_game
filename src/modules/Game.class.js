'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.board = initialState;
    this.size = initialState.length;

    this.fieldsRows = this.getFieldsRows();

    this.currentScore = 0;
    this.currentScoreElement = document.querySelector('.game-score');

    this.loseMessage = document.querySelector('.message-lose');
    this.winMessage = document.querySelector('.message-win');
    this.startMessage = document.querySelector('.message-start');

    this.gameStatus = 'idle';
  }

  moveLeft() {
    this.move('ArrowLeft');
  }

  moveRight() {
    this.move('ArrowRight');
  }

  moveUp() {
    this.move('ArrowUp');
  }

  moveDown() {
    this.move('ArrowDown');
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.currentScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.fillRandomEmptyCell();
    this.fillRandomEmptyCell();

    const startBtn = document.querySelector('.start');

    this.startBtn = startBtn;

    addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight':
          this.moveRight();
          break;
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
      }
    });

    startBtn.addEventListener('click', () => {
      if (startBtn.classList.contains('start')) {
        this.gameStatus = 'playing';
        this.menageStates();
      } else {
        this.restart();
      }
    });
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board.forEach((column, i) => {
      column.forEach((el, j) => {
        this.board[i][j] = 0;
      });
    });

    this.updateField();

    this.gameStatus = 'idle';
    this.fillRandomEmptyCell();
    this.fillRandomEmptyCell();
    this.menageStates();
  }

  menageStates() {
    switch (this.gameStatus) {
      case 'idle':
        this.currentScore = 0;
        this.currentScoreElement.innerHTML = this.currentScore;
        this.startBtn.className = 'button start';
        this.startBtn.innerHTML = 'Start';
        this.loseMessage.classList.add('hidden');
        this.winMessage.classList.add('hidden');
        this.startMessage.classList.remove('hidden');
        break;
      case 'playing':
        this.startBtn.style.pointerEvents = 'none';
        this.startMessage.classList.add('hidden');
        break;
      case 'win':
        this.winMessage.classList.remove('hidden');
        break;
      case 'lose':
        this.loseMessage.classList.remove('hidden');
        break;
      default:
        throw new Error('Something went wrong');
    }
  }

  move(direction) {
    let hasChanged = false;

    this.gameStatus = 'playing';

    this.menageStates();
    this.startBtn.className = 'button restart';
    this.startBtn.innerHTML = 'Restart';
    this.startBtn.style.pointerEvents = 'initial';
    this.checkIfTheGameOver();

    if (direction === 'ArrowUp' || direction === 'ArrowDown') {
      for (let j = 0; j < this.size; j++) {
        const column = [...Array(this.size)].map((_, i) => this.board[i][j]);
        const newColumn = this.transformField(column, direction === 'ArrowUp');

        for (let i = 0; i < this.size; i++) {
          if (this.board[i][j] !== newColumn[i]) {
            hasChanged = true;
            this.board[i][j] = newColumn[i];
          }
        }
      }
    } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
      for (let i = 0; i < this.size; i++) {
        const row = this.board[i];
        const newRow = this.transformField(row, direction === 'ArrowLeft');

        if (row.join(',') !== newRow.join(',')) {
          hasChanged = true;
          this.board[i] = newRow;
        }
      }
    }

    if (hasChanged) {
      this.fillRandomEmptyCell();
    }
  }

  checkIfTheGameOver() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          return;
        }

        if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
          return;
        }

        if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return;
        }
      }
    }

    this.gameStatus = 'lose';
    this.menageStates();
  }

  transformField(line, moveToStart) {
    const newLine = line.filter((cell) => cell !== 0);

    if (!moveToStart) {
      newLine.reverse();
    }

    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        this.updateScore(newLine[i]);
        newLine.splice(i + 1, 1);
      }
    }

    while (newLine.length < this.size) {
      newLine.push(0);
    }

    if (!moveToStart) {
      newLine.reverse();
    }

    return newLine;
  }

  updateField() {
    this.fieldsRows.forEach((column, i) => {
      column.forEach((cell, j) => {
        cell.innerHTML = this.board[i][j] === 0 ? '' : this.board[i][j];
        cell.className = `field-cell field-cell--${this.board[i][j]}`;
      });
    });
  }

  getFieldsRows() {
    const nodesArr = [];
    const fieldsRows = document.querySelectorAll('.field-row');

    fieldsRows.forEach((row) => {
      nodesArr.push(
        Array.from(row.childNodes).filter(
          (node) => node.nodeType === Node.ELEMENT_NODE,
        ),
      );
    });

    return nodesArr;
  }

  updateScore(value) {
    const winValue = 2048;

    if (value === winValue) {
      this.gameStatus = 'win';
      this.menageStates();
    }

    this.currentScore += value;
    this.currentScoreElement.innerHTML = this.currentScore;
  }

  fillRandomEmptyCell() {
    const emptyFields = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyFields.push({
            x: i,
            y: j,
          });
        }
      }
    }

    if (emptyFields.length > 0) {
      const randomCell
        = emptyFields[Math.floor(Math.random() * emptyFields.length)];

      this.board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
      this.updateField();

      this.toggleAnimationClass(this.fieldsRows[randomCell.x][randomCell.y]);
    }
  }

  toggleAnimationClass(value) {
    value.classList.add('new-title');

    setTimeout(() => {
      value.classList.remove('new-title');
    }, 300);
  }
}

module.exports = Game;
