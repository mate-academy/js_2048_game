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

    console.log(initialState);
  }

  moveLeft() {
    const newBoard = this.board.map((row) => [...row]);
    const compressed = this.compressBoard(newBoard, 'left');

    this.mergeCells(compressed, 'left');

    const finalCompressed = this.compressBoard(compressed, 'left');

    this.board = finalCompressed;
    this.status = this.getStatus();
  }

  moveRight() {
    const newBoard = this.board.map((row) => [...row]);
    const compressed = this.compressBoard(newBoard, 'right');

    this.mergeCells(compressed, 'right');

    const finalCompressed = this.compressBoard(compressed, 'right');

    this.board = finalCompressed;
    this.status = this.getStatus();
  }

  moveUp() {
    const columns = [];

    for (let j = 0; j < 4; j++) {
      const col = [];

      for (let i = 0; i < 4; i++) {
        col.push(this.board[i][j]);
      }
      columns.push(col);
    }

    const compressed = this.compressBoard(columns, 'up');

    this.mergeCells(compressed, 'up');

    const finalCompressed = this.compressBoard(compressed, 'up');

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = finalCompressed[j][i];
      }
    }

    this.status = this.getStatus();
  }

  moveDown() {
    const columns = [];

    for (let j = 0; j < 4; j++) {
      const col = [];

      for (let i = 0; i < 4; i++) {
        col.push(this.board[i][j]);
      }
      columns.push(col);
    }

    const compressed = this.compressBoard(columns, 'down');

    this.mergeCells(compressed, 'down');

    const finalCompressed = this.compressBoard(compressed, 'down');

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = finalCompressed[j][i];
      }
    }

    this.status = this.getStatus();
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
    const isEmpty = this.board.every((row) => row.every((cell) => cell === 0));

    if (isEmpty) {
      return (this.status = 'idle');
    }

    if (this.board.some((row) => row.some((cell) => cell === 2048))) {
      return (this.status = 'win');
    }

    const noEmptyCells = this.board.every((row) => {
      return row.every((cell) => cell !== 0);
    });

    if (noEmptyCells) {
      for (let i = 0; i < this.board.length; i++) {
        for (let y = 0; y < this.board[i].length; y++) {
          if (
            (y < 3 && this.board[i][y] === this.board[i][y + 1]) ||
            (i < 3 && this.board[i][y] === this.board[i + 1][y])
          ) {
            return (this.status = 'playing');
          }
        }
      }

      return (this.status = 'lose');
    }

    return (this.status = 'playing');
  }

  start() {
    this.board = [
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
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }

  addRandomTile() {
    const coords = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let y = 0; y < this.board[i].length; y++) {
        if (!Number.isFinite(this.board[i][y]) || this.board[i][y] === 0) {
          coords.push([i, y]);
        }
      }
    }

    if (coords.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * coords.length);
    const [row, col] = coords[randomIndex];

    if (Math.random() < 0.9) {
      this.board[row][col] = 2;
    } else {
      this.board[row][col] = 4;
    }
  }

  compressBoard(board, direction) {
    const offsetArray = [];

    for (let i = 0; i < board.length; i++) {
      const notZeroArray = [];

      for (let y = 0; y < board[i].length; y++) {
        if (board[i][y] !== 0) {
          notZeroArray.push(board[i][y]);
        }
      }

      const notZeroLength = notZeroArray.length;

      for (let x = 0; x < 4 - notZeroLength; x++) {
        if (direction === 'left' || direction === 'up') {
          notZeroArray.push(0);
        }

        if (direction === 'right' || direction === 'down') {
          notZeroArray.unshift(0);
        }
      }

      offsetArray.push(notZeroArray);
    }

    return offsetArray;
  }

  mergeCells(board, direction) {
    for (let i = 0; i < board.length; i++) {
      if (direction === 'left' || direction === 'up') {
        for (let y = 0; y < board[i].length - 1; y++) {
          const current = board[i][y];
          const next = board[i][y + 1];

          if (Number.isFinite(current) && current === next) {
            board[i][y] += next;
            board[i][y + 1] = 0;
            this.score += board[i][y];
            y++;
          }
        }
      }

      if (direction === 'right' || direction === 'down') {
        for (let y = board[i].length - 1; y > 0; y--) {
          const current = board[i][y];
          const prev = board[i][y - 1];

          if (Number.isFinite(current) && current === prev) {
            board[i][y] += prev;
            board[i][y - 1] = 0;
            this.score += board[i][y];
            y--;
          }
        }
      }
    }
  }
}
export default Game;
