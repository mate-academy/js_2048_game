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
    // console.log(initialState);
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState;
    this.status = 'idle';
    this.score = 0;
  }

  renderBoard(b) {
    const cells = Array.from(document.getElementsByClassName('field-cell'));

    const prep = [];

    for (const elem of b) {
      for (const e of elem) {
        prep.push(e);
      }
    }

    for (let i = 0; i < cells.length; i++) {
      if (prep[i] === 0) {
        cells[i].textContent = '';
        cells[i].className = 'field-cell';
      }

      if (prep[i] !== 0) {
        cells[i].textContent = prep[i];
        cells[i].className = `field-cell field-cell--${String(prep[i])}`;
      }
    }
  }

  moveLeft() {
    if (this.status === 'playing') {
      const newBoard = this.board.map((row) => [...row]);

      for (let i = 0; i < 4; i++) {
        let row = newBoard[i].filter((el) => el !== 0);

        row = row.reduce((acum, elem, index, arr) => {
          if (arr[index] === arr[index + 1]) {
            acum.push(elem * 2);
            this.updateScore(elem * 2);
            arr[index + 1] = 0;
          } else if (elem !== 0) {
            acum.push(elem);
          }

          return acum;
        }, []);

        while (row.length < 4) {
          row.push(0);
        }

        newBoard[i] = row;
      }

      if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
        this.board = newBoard; // Обновляем доску
        this.renderBoard(this.board);
        this.createCell(); // Создаём новую плитку
      } else {
        this.renderBoard(this.board);
      }
    }

    this.canMove();
  }

  moveRight() {
    if (this.status === 'playing') {
      const newBoard = this.board.map((row) => [...row]);

      for (let i = 0; i < 4; i++) {
        let row = newBoard[i].filter((elem) => elem !== 0);

        row = row.reduce((acum, elem, index, arr) => {
          if (arr[index] === arr[index + 1]) {
            acum.push(elem * 2);
            this.updateScore(elem * 2);

            arr[index + 1] = 0;
          } else if (elem !== 0) {
            acum.push(elem);
          }

          return acum;
        }, []);

        while (row.length < 4) {
          row.unshift(0);
        }
        newBoard[i] = row;
      }

      if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
        this.board = newBoard;
        this.renderBoard(this.board);
        this.createCell();
      } else {
        this.renderBoard(this.board);
      }
    }

    this.canMove();
  }

  moveDown() {
    if (this.status === 'playing') {
      const newBoard = this.board.map((row) => [...row]);

      for (let i = 0; i < 4; i++) {
        let column = [];

        for (let j = 0; j < 4; j++) {
          column.push(newBoard[j][i]);
        }

        column.reverse();

        column = column.filter((el) => el !== 0);

        column = column.reduce((acum, element, index, arr) => {
          if (arr[index] === arr[index + 1]) {
            acum.push(element * 2);
            this.updateScore(element * 2);
            arr[index + 1] = 0;
          } else if (element !== 0) {
            acum.push(element);
          }

          return acum;
        }, []);

        while (column.length < 4) {
          column.push(0);
        }

        column.reverse();

        for (let j = 0; j < 4; j++) {
          newBoard[j][i] = column[j];
        }
      }

      if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
        this.board = newBoard;
        this.renderBoard(this.board);
        this.createCell();
      } else {
        this.renderBoard(this.board);
      }
    }
    this.canMove();
  }

  moveUp() {
    if (this.status === 'playing') {
      const newBoard = this.board.map((row) => [...row]);

      for (let i = 0; i < 4; i++) {
        let column = [];

        for (let j = 0; j < 4; j++) {
          if (newBoard[j][i] !== 0) {
            column.push(newBoard[j][i]);
          }
        }

        column = column.reduce((acum, element, index, arr) => {
          if (arr[index] === arr[index + 1]) {
            acum.push(element * 2);
            this.updateScore(element * 2);
            arr[index + 1] = 0;
          } else if (element !== 0) {
            acum.push(element);
          }

          return acum;
        }, []);

        while (column.length < 4) {
          column.push(0); // Добавляем 0 в конец, а не в середину
        }

        for (let j = 0; j < 4; j++) {
          newBoard[j][i] = column[j];
        }
      }

      if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
        this.board = newBoard;
        this.renderBoard(this.board);
        this.createCell();
      } else {
        this.renderBoard(this.board);
      }
    }

    this.canMove();
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
    this.createCell();
    this.createCell();

    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState;
    this.status = 'idle';
    this.score = 0;

    this.renderBoard(this.board);
  }

  // Add your own methods here

  createCell() {
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
      this.renderBoard(this.board);
    }
  }

  updateScore(points) {
    if (points === 2048) {
      this.status = 'win';
    }
    this.score += points;
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return (this.status = 'lose');
  }
}

module.exports = Game;
