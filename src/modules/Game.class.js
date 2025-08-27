'use strict';

const CHANGE_TO_GENERATE_4 = 0.1; // 10%

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
    this.status = {
      IDLE: 'idle',
      PLAYING: 'playing',
      WIN: 'win',
      LOSE: 'lose',
    };
    this.gameStatus = this.status.IDLE;

    this.score = 0;

    // create game with empty cells
    if (initialState === undefined || initialState === null) {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    } else {
      this.board = initialState;
    }
    this.checkWin();
  }

  moveLeft() {
    if (this.checkLose() === true) {
      return;
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 1; col < this.board[row].length; col++) {
        let currentCol = col;

        while (currentCol > 0) {
          const currentCellValue = this.board[row][currentCol];
          const leftCellValue = this.board[row][currentCol - 1];

          if (currentCellValue === 0) {
            break;
          }

          if (leftCellValue === 0) {
            this.board[row][currentCol - 1] = currentCellValue;
            this.board[row][currentCol] = 0;
            currentCol--;
          } else if (currentCellValue === leftCellValue) {
            this.board[row][currentCol - 1] *= 2;
            this.board[row][currentCol] = 0;
            this.score += this.board[row][currentCol - 1];
            this.checkWin();
            this.checkLose();
            break;
          } else {
            break;
          }
        }
      }
    }
    this.checkWin();
  }
  moveRight() {
    if (this.checkLose() === true) {
      return;
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = this.board[row].length - 2; col >= 0; col--) {
        let currentCol = col;

        while (currentCol < this.board[row].length - 1) {
          const currentCellValue = this.board[row][currentCol];
          const rightCellValue = this.board[row][currentCol + 1];

          if (currentCellValue === 0) {
            break;
          }

          if (rightCellValue === 0) {
            this.board[row][currentCol + 1] = currentCellValue;
            this.board[row][currentCol] = 0;
            currentCol++;
          } else if (currentCellValue === rightCellValue) {
            this.board[row][currentCol + 1] *= 2;
            this.board[row][currentCol] = 0;
            this.score += this.board[row][currentCol + 1];
            break;
          } else {
            break;
          }
        }
      }
    }
    this.checkWin();
  }
  moveUp() {
    if (this.checkLose() === true) {
      return;
    }

    for (let col = 0; col < this.board[0].length; col++) {
      for (let row = 1; row < this.board.length; row++) {
        let currentRow = row;

        while (currentRow > 0) {
          const currentCellValue = this.board[currentRow][col];
          const upCellValue = this.board[currentRow - 1][col];

          if (currentCellValue === 0) {
            break;
          }

          if (upCellValue === 0) {
            this.board[currentRow - 1][col] = currentCellValue;
            this.board[currentRow][col] = 0;
            currentRow--;
          } else if (currentCellValue === upCellValue) {
            this.board[currentRow - 1][col] *= 2;
            this.board[currentRow][col] = 0;
            this.score += this.board[currentRow - 1][col];
            break;
          } else {
            break;
          }
        }
      }
    }
    this.checkWin();
  }
  moveDown() {
    if (this.checkLose() === true) {
      return;
    }

    for (let col = 0; col < this.board[0].length; col++) {
      for (let row = this.board.length - 2; row >= 0; row--) {
        let currentRow = row;

        while (currentRow < this.board.length - 1) {
          const currentCellValue = this.board[currentRow][col];
          const downCellValue = this.board[currentRow + 1][col];

          if (currentCellValue === 0) {
            break;
          }

          if (downCellValue === 0) {
            this.board[currentRow + 1][col] = currentCellValue;
            this.board[currentRow][col] = 0;
            currentRow++;
          } else if (currentCellValue === downCellValue) {
            this.board[currentRow + 1][col] *= 2;
            this.board[currentRow][col] = 0;
            this.score += this.board[currentRow + 1][col];
            break;
          } else {
            break;
          }
        }
      }
    }
    this.checkWin();
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
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.gameStatus === this.status.IDLE) {
      // initialize random cells
      const empty = this.getEmptyCells();

      if (empty.length < 2) {
        return;
      }

      const [row1, col1] = this.getRandomEmptyCell();

      let row2, col2;

      do {
        [row2, col2] = this.getRandomEmptyCell();
      } while (row1 === row2 && col1 === col2);

      this.board[row1][col1] = 2;
      this.board[row2][col2] = 2;

      // change game status
      this.gameStatus = this.status.PLAYING;
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = 0;
        this.score = 0;
      }
    }

    this.gameStatus = this.status.IDLE;
  }

  addRandomTile() {
    if (this.getEmptyCells().length === 0) {
      return;
    }

    const newTileValue = getRandomTileValue();
    let row, col;

    do {
      [row, col] = this.getRandomEmptyCell();
    } while (this.board[row][col] !== 0);

    this.board[row][col] = newTileValue;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  getRandomEmptyCell() {
    const emptyCells = this.getEmptyCells();
    const index = Math.floor(Math.random() * emptyCells.length);

    // getting random pair of row and col
    // '[0]' to return [row, col] instead of [[row, col]]
    return emptyCells.splice(index, 1)[0];
  }

  checkWin() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 2048) {
          this.gameStatus = this.status.WIN;

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const current = this.board[row][col];

        if (current === 0) {
          return false;
        }

        if (row < this.board.length - 1) {
          const down = this.board[row + 1][col];

          if (current === down) {
            return false;
          }
        }

        if (col < this.board[row].length - 1) {
          const right = this.board[row][col + 1];

          if (current === right) {
            return false;
          }
        }
      }
    }

    this.gameStatus = this.status.LOSE;

    return true;
  }
}

function getRandomTileValue() {
  if (Math.random() <= CHANGE_TO_GENERATE_4) {
    return 4;
  } else {
    return 2;
  }
}

module.exports = Game;
