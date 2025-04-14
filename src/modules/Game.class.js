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
    this.addRandomTile();
    this.addRandomTile();
  }

  moveLeft() {
    const moved = this.move(0, -1);

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }
  moveRight() {
    const moved = this.move(0, 1);

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }
  moveUp() {
    const moved = this.move(-1, 0);

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }
  moveDown() {
    const moved = this.move(1, 0);

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }
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
    this.status = 'playing';
    this.addRandomTile();
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

  // Add your own methods here
  move(rowDelta, colDelta) {
    let moved = false;
    const merged = [];

    const inBounds = (r, c) => r >= 0 && r < 4 && c >= 0 && c < 4;

    const traverse = () => {
      const rows = [0, 1, 2, 3];
      const cols = [0, 1, 2, 3];

      if (rowDelta === 1) {
        rows.reverse();
      } // down

      if (colDelta === 1) {
        cols.reverse();
      } // right

      for (const r of rows) {
        for (const c of cols) {
          const current = this.board[r][c];

          if (current === 0) {
            continue;
          }

          let nr = r;
          let nc = c;

          while (
            inBounds(nr + rowDelta, nc + colDelta) &&
            this.board[nr + rowDelta][nc + colDelta] === 0
          ) {
            nr += rowDelta;
            nc += colDelta;
          }

          if (
            inBounds(nr + rowDelta, nc + colDelta) &&
            this.board[nr + rowDelta][nc + colDelta] === current &&
            !merged.includes(`${nr + rowDelta}-${nc + colDelta}`)
          ) {
            this.board[nr + rowDelta][nc + colDelta] *= 2;
            this.board[r][c] = 0;
            merged.push(`${nr + rowDelta}-${nc + colDelta}`);
            this.score += this.board[nr + rowDelta][nc + colDelta];
            moved = true;
          } else if (nr !== r || nc !== c) {
            this.board[nr][nc] = current;
            this.board[r][c] = 0;
            moved = true;
          }
        }
      }
    };

    traverse();

    return moved;
  }

  // Adds a new tile (2 or 4) to a random empty cell
  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // Check if the player has won or lost
  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  // Check if any moves are possible
  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        } // Empty cell exists

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        } // Can merge down

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        } // Can merge right
      }
    }

    return false;
  }
}

module.exports = Game;
