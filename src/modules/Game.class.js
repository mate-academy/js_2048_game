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
   * The initial state of the this.board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the this.board will be initialized with the provided
   * initial state.
   */
  constructor(
    gameField,
    buttonStart,
    gameScore,
    messageLose,
    messageWin,
    messageStart,
  ) {
    // eslint-disable-next-line no-console
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.gameField = gameField;
    this.buttonStart = buttonStart;
    this.messageLose = messageLose;
    this.messageWin = messageWin;
    this.messageStart = messageStart;
    this.gameScore = gameScore;

    this.score = 0;
    this.idle = true;
    this.playing = false;
    this.lose = false;
    this.win = false;
  }

  moveLeft() {
    let boardChanged = false;

    for (let row = 0; row < this.board.length; row++) {
      const newRow = this.board[row].filter((value) => value !== 0);
      const mergedRow = [];

      for (let col = 0; col < newRow.length; col++) {
        if (newRow[col] === newRow[col + 1]) {
          const mergedValue = newRow[col] * 2;

          mergedRow.push(mergedValue);
          this.score += mergedValue;
          boardChanged = true;
          col++;
        } else {
          mergedRow.push(newRow[col]);
        }
      }

      while (mergedRow.length < this.board[row].length) {
        mergedRow.push(0);
      }

      if (JSON.stringify(this.board[row]) !== JSON.stringify(mergedRow)) {
        this.board[row] = mergedRow;
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addRandomTile();
    }
  }

  moveRight() {
    let boardChanged = false;

    for (let row = 0; row < this.board.length; row++) {
      const newRow = this.board[row].filter((value) => value !== 0).reverse();
      const mergedRow = [];

      for (let col = 0; col < newRow.length; col++) {
        if (newRow[col] === newRow[col + 1]) {
          const mergedValue = newRow[col] * 2;

          mergedRow.push(mergedValue);
          this.score += mergedValue;
          boardChanged = true;
          col++;
        } else {
          mergedRow.push(newRow[col]);
        }
      }

      while (mergedRow.length < this.board[row].length) {
        mergedRow.push(0);
      }

      mergedRow.reverse();

      if (JSON.stringify(this.board[row]) !== JSON.stringify(mergedRow)) {
        this.board[row] = mergedRow;
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.addRandomTile();
    }
  }

  moveUp() {
    let boardChanged = false;

    for (let col = 0; col < this.board.length; col++) {
      const newCol = this.board
        .map((row) => row[col])
        .filter((value) => value !== 0);
      const mergedCol = [];

      for (let row = 0; row < newCol.length; row++) {
        if (newCol[row] === newCol[row + 1]) {
          const mergedValue = newCol[row] * 2;

          mergedCol.push(mergedValue);
          this.score += mergedValue;
          boardChanged = true;
          row++;
        } else {
          mergedCol.push(newCol[row]);
        }
      }

      while (mergedCol.length < this.board.length) {
        mergedCol.push(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== mergedCol[row]) {
          this.board[row][col] = mergedCol[row];
          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.addRandomTile();
    }
  }

  moveDown() {
    let boardChanged = false;

    for (let col = 0; col < this.board.length; col++) {
      const newCol = this.board
        .map((row) => row[col])
        .filter((value) => value !== 0)
        .reverse();
      const mergedCol = [];

      for (let row = 0; row < newCol.length; row++) {
        if (row < newCol.length - 1 && newCol[row] === newCol[row + 1]) {
          const mergedValue = newCol[row] * 2;

          mergedCol.push(mergedValue);
          this.score += mergedValue;
          boardChanged = true;
          row++;
        } else {
          mergedCol.push(newCol[row]);
        }
      }

      while (mergedCol.length < this.board.length) {
        mergedCol.push(0);
      }
      mergedCol.reverse();

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== mergedCol[row]) {
          this.board[row][col] = mergedCol[row];
          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.addRandomTile();
    }
  }

  makeMove() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
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
        default:
          break;
      }
      this.updateGameField();
      this.getScore();
      this.checkWin();
      this.canMakeMove();
    });
  }

  /**
   * @returns {number}
   */
  getScore() {
    this.gameScore.textContent = this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
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
    if (this.idle) {
      return 'idle';
    }

    if (this.lose) {
      return 'lose';
    }

    if (this.win) {
      return 'win';
    }

    if (this.playing) {
      return 'playing';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    if (!this.playing) {
      this.addRandomTile();
      this.addRandomTile();

      this.getState();

      this.updateButton('restart');
      this.playing = true;
      this.idle = false;
      this.messageStart.className = 'message message-start hidden';
      this.messageLose.className = 'message message-lose hidden';
      this.messageWin.className = 'message message-win hidden';
    }
  }

  restart() {
    if (this.playing) {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.score = 0;
      this.getScore();

      this.updateGameField();

      this.updateButton('start');
      this.idle = true;
      this.playing = false;
      this.messageStart.className = 'message message-start';
      this.messageLose.className = 'message message-lose hidden';
      this.messageWin.className = 'message message-win hidden';
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
      this.gameField.rows[row].cells[col].textContent = this.board[row][col];

      this.gameField.rows[row].cells[col].className =
        `field-cell field-cell--${this.board[row][col]}`;
    }
  }

  updateButton(state) {
    if (state === 'start') {
      this.buttonStart.classList.add('start');
      this.buttonStart.classList.remove('restart');
      this.buttonStart.textContent = 'Start';
    } else if (state === 'restart') {
      this.buttonStart.classList.remove('start');
      this.buttonStart.classList.add('restart');
      this.buttonStart.textContent = 'Restart';
    }
  }

  updateGameField() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        this.gameField.rows[row].cells[col].textContent =
          this.board[row][col] === 0 ? '' : this.board[row][col];

        this.gameField.rows[row].cells[col].className =
          this.board[row][col] === 0
            ? 'field-cell'
            : `field-cell field-cell--${this.board[row][col]}`;
      }
    }
  }

  canMakeMove() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          this.lose = false;

          return;
        }

        if (
          col < this.board[row].length - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          this.lose = false;

          return;
        }

        if (
          row < this.board.length - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          this.lose = false;

          return;
        }
      }
    }

    this.lose = true;
    this.messageLose.classList.remove('hidden');
  }

  checkWin() {
    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 2024) {
          this.win = true;
          this.messageWin.classList.remove('hidden');
        }
      }
    }
  }
}

// Add your own methods here

module.exports = Game;
