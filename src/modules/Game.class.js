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
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let row = 0; row < this.board.length; row++) {
      const line = this.board[row];
      const massiveZero = [];
      const currentLine = [];

      for (let i = 0; i < line.length; i++) {
        if (line[i] === 0) {
          massiveZero.push(line[i]);
        } else {
          currentLine.push(line[i]);
        }
      }

      if (currentLine.length !== 1) {
        for (let i = 0; i < currentLine.length - 1; i++) {
          if (currentLine[i] === currentLine[i + 1]) {
            const sum = currentLine[i] + currentLine[i + 1];

            this.score += sum;
            currentLine.splice(i, 2, sum);
            massiveZero.push(0);
          }
        }
      }

      this.board[row] = [...currentLine, ...massiveZero];
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();

      return true;
    }

    return false;
  }
  moveRight() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let row = 0; row < this.board.length; row++) {
      const line = this.board[row];
      const massiveZero = [];
      const currentLine = [];

      for (let i = 0; i < line.length; i++) {
        if (line[i] === 0) {
          massiveZero.push(line[i]);
        } else {
          currentLine.push(line[i]);
        }
      }

      if (currentLine.length !== 1) {
        for (let i = currentLine.length - 1; i > 0; i--) {
          if (currentLine[i] === currentLine[i - 1]) {
            const sum = currentLine[i] + currentLine[i - 1];

            this.score += sum;
            currentLine.splice(i - 1, 2, sum);
            i--;
            massiveZero.push(0);
          }
        }
      }

      this.board[row] = [...massiveZero, ...currentLine];
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();

      return true;
    }

    return false;
  }
  moveUp() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));
    const size = this.board[0].length;

    for (let i = 0; i < size; i++) {
      const massiveZero = [];
      const currentColumn = [];

      for (let row = 0; row < size; row++) {
        const line = this.board[row];

        if (line[i] === 0) {
          massiveZero.push(line[i]);
        } else {
          currentColumn.push(line[i]);
        }
      }

      if (currentColumn.length !== 1) {
        for (let j = 0; j < currentColumn.length - 1; j++) {
          if (currentColumn[j] === currentColumn[j + 1]) {
            const sum = currentColumn[j] + currentColumn[j + 1];

            this.score += sum;
            currentColumn.splice(j, 2, sum);
            massiveZero.push(0);
          }
        }
      }

      const newColumn = [...currentColumn, ...massiveZero];

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][i] = newColumn[row];
      }
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();

      return true;
    }

    return false;
  }
  moveDown() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));
    const size = this.board[0].length;

    for (let i = 0; i < size; i++) {
      const massiveZero = [];
      const currentColumn = [];

      for (let row = 0; row < size; row++) {
        const line = this.board[row];

        if (line[i] === 0) {
          massiveZero.push(line[i]);
        } else {
          currentColumn.push(line[i]);
        }
      }

      if (currentColumn.length !== 1) {
        for (let j = currentColumn.length; j > 0; j--) {
          if (currentColumn[j] === currentColumn[j - 1]) {
            const sum = currentColumn[j] + currentColumn[j - 1];

            this.score += sum;
            currentColumn.splice(j - 1, 2, sum);
            j--;
            massiveZero.push(0);
          }
        }
      }

      const newColumn = [...massiveZero, ...currentColumn];

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][i] = newColumn[row];
      }
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();

      return true;
    }

    return false;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'idle') {
      this.status = 'playing';

      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      const value = Math.random() < 0.1 ? 4 : 2;

      this.board[row][col] = value;
    }
  }
  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }
  checkGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }
}

module.exports = Game;
