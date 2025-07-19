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
    this.board = initialState ?? [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft(row) {
    let arrayAxu = row.filter((number) => number > 0);

    for (let i = 0; i < arrayAxu.length - 1; i++) {
      if (arrayAxu[i] === arrayAxu[i + 1]) {
        arrayAxu[i] *= 2;
        this.score += arrayAxu[i];
        arrayAxu[i + 1] = 0;
        i++;
      }
    }
    arrayAxu = arrayAxu.filter((number) => number > 0);

    while (arrayAxu.length < 4) {
      arrayAxu.push(0);
    }

    return arrayAxu;
  }

  moveRight(row) {
    let arrayAxu = row.filter((number) => number > 0);

    for (let i = arrayAxu.length - 1; i > 0; i--) {
      if (arrayAxu[i] === arrayAxu[i - 1]) {
        arrayAxu[i] *= 2;
        this.score += arrayAxu[i];
        arrayAxu[i - 1] = 0;
        i--;
      }
    }
    arrayAxu = arrayAxu.filter((number) => number > 0);

    while (arrayAxu.length < 4) {
      arrayAxu.unshift(0);
    }

    return arrayAxu;
  }

  moveUp(colum) {
    let arrayAxu = colum.filter((number) => number > 0);

    for (let i = 0; i < arrayAxu.length - 1; i++) {
      if (arrayAxu[i] === arrayAxu[i + 1]) {
        arrayAxu[i] *= 2;
        this.score += arrayAxu[i];
        arrayAxu[i + 1] = 0;
        i++;
      }
    }
    arrayAxu = arrayAxu.filter((number) => number > 0);

    while (arrayAxu.length < 4) {
      arrayAxu.push(0);
    }

    return arrayAxu;
  }

  moveDown(colum) {
    let arrayAxu = colum.filter((number) => number > 0);

    for (let i = arrayAxu.length - 1; i > 0; i--) {
      if (arrayAxu[i] === arrayAxu[i - 1]) {
        arrayAxu[i] *= 2;
        this.score += arrayAxu[i];
        arrayAxu[i - 1] = 0;
        i--;
      }
    }
    arrayAxu = arrayAxu.filter((number) => number > 0);

    while (arrayAxu.length < 4) {
      arrayAxu.unshift(0);
    }

    return arrayAxu;
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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';

    let piecesPlaced = 0;

    while (piecesPlaced < 2) {
      const codeRow = Math.floor(Math.random() * 4);
      const codeColum = Math.floor(Math.random() * 4);
      const value = Math.random() < 0.9 ? 2 : 4;

      if (this.board[codeRow][codeColum] === 0) {
        this.board[codeRow][codeColum] = value;
        piecesPlaced++;
      }
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    return this.start();
  }

  // Add your own methods here

  // metodos de movimento complicados:
  moveBoardLeft() {
    const oldBoard = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.moveLeft(this.board[i]);
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.checkGameStatus();
  }

  moveBoardRight() {
    const oldBoard = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.moveRight(this.board[i]);
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.checkGameStatus();
  }

  moveBoardUp() {
    const oldBoard = JSON.stringify(this.board);

    for (let col = 0; col < 4; col++) {
      let column = this.board.map((row) => row[col]);

      column = this.moveUp(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.checkGameStatus();
  }

  moveBoardDown() {
    const oldBoard = JSON.stringify(this.board);

    for (let col = 0; col < 4; col++) {
      let column = this.board.map((row) => row[col]);

      column = this.moveDown(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.checkGameStatus();
  }

  // metodo para inserir 2 ou 4
  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // verificar derrota ou vitória
  checkGameStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    // verifica se há movimentos possíveis
    const hasZero = this.board.some((row) => row.includes(0));

    if (hasZero) {
      return;
    }

    // verifica combinações horizontáis
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return;
        }

        if (this.board[j][i] === this.board[j + 1][i]) {
          return;
        }
      }
    }

    // sem movimentos
    this.status = 'lose';
  }
}

module.exports = Game;

// export default Game;
