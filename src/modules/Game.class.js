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
    // eslint-disable-next-line no-console
    const defaultBord = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : defaultBord;

    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.appStatus = 'idle';
    /* console.log(initialState); */
  }

  moveLeft() {
    return this.handleMove('left');
  }
  moveRight() {
    return this.handleMove('right');
  }
  moveUp() {
    return this.handleMove('up');
  }
  moveDown() {
    return this.handleMove('down');
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
    return this.appStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.appStatus = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.appStatus = 'idle';
    this.score = 0;
    this.start();
  }

  check() {
    if (this.board.flat().includes(2048)) {
      this.appStatus = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c < 3 && current === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.appStatus = 'loss';
  }

  // Add your own methods here
  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (empty.length) {
      const { r: randomR, c: randomC } =
        empty[Math.floor(Math.random() * empty.length)];

      this.board[randomR][randomC] = Math.random() < 0.9 ? 2 : 4;
    }
  }
  handleMove(dir) {
    if (this.appStatus !== 'playing') {
      return false;
    }

    const old = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      const line = this.getLine(i, dir);
      const { newLine, p } = this.merge(line);

      this.score += p;
      this.setLine(i, dir, newLine);
    }

    const moved = old !== JSON.stringify(this.board);

    if (moved) {
      this.addRandomTile();
      this.check();
    }

    return moved;
  }

  merge(line) {
    const res = line.filter((x) => x !== 0);
    let p = 0;

    for (let i = 0; i < res.length - 1; i++) {
      if (res[i] === res[i + 1]) {
        res[i] *= 2;
        p += res[i];
        res.splice(i + 1, 1);
      }
    }

    while (res.length < 4) {
      res.push(0);
    }

    return { newLine: res, p };
  }

  getLine(idx, dir) {
    const l = [];

    for (let i = 0; i < 4; i++) {
      if (dir === 'left') {
        l.push(this.board[idx][i]);
      } else if (dir === 'right') {
        l.push(this.board[idx][3 - i]);
      } else if (dir === 'up') {
        l.push(this.board[i][idx]);
      } else if (dir === 'down') {
        l.push(this.board[3 - i][idx]);
      }
    }

    return l;
  }

  setLine(idx, dir, nl) {
    for (let i = 0; i < 4; i++) {
      if (dir === 'left') {
        this.board[idx][i] = nl[i];
      } else if (dir === 'right') {
        this.board[idx][3 - i] = nl[i];
      } else if (dir === 'up') {
        this.board[i][idx] = nl[i];
      } else if (dir === 'down') {
        this.board[3 - i][idx] = nl[i];
      }
    }
  }
}
export default Game;
