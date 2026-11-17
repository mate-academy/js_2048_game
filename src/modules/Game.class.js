/* eslint-disable padding-line-between-statements */
/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable spaced-comment */
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
    const emptyBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    const startBoard = initialState || emptyBoard;
    this.initialState = startBoard.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = [
      //очистити дошку
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  processLine(line) {
    const tiles = line.filter((tile) => tile !== 0);

    for (let i = 0; i < tiles.length - 1; i++) {
      //перевірка сусідньої пари;
      if (tiles[i] === tiles[i + 1]) {
        tiles[i] *= 2; // ліва плитка подвоюється;
        this.score += tiles[i]; // додається значення нової плитки
        tiles.splice(i + 1, 1); // видалити праву плитку
      }
    }

    while (tiles.length < line.length) {
      // перейти на одну позицію   додати нулі до довжини line
      tiles.push(0);
    }

    return tiles;
  }

  moveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];
      const newRow = this.processLine(row);

      this.board[i] = newRow;
    }
  }
  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      const originalRow = [...this.board[i]].reverse(); //
      const newRow = this.processLine(originalRow);

      this.board[i] = newRow.reverse();
    }
  }
  moveUp() {
    for (let c = 0; c < this.board.length; c++) {
      const column = this.board.map((row) => row[c]);
      const newColumn = this.processLine(column);

      for (let r = 0; r < this.board.length; r++) {
        this.board[r][c] = newColumn[r];
      }
    }
  }
  moveDown() {
    for (let c = 0; c < this.board.length; c++) {
      const column = this.board.map((row) => row[c]);
      const newColumn = this.processLine(column.reverse()).reverse();

      for (let r = 0; r < this.board.length; r++) {
        this.board[r][c] = newColumn[r];
      }
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board.length; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.1 ? 2 : 4;
    }
  }
}

export default Game;
