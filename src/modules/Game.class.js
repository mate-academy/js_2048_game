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
    this.initialBoard = initialState;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.boardScore = 0;

    this.currentStatus = 'idle';

    this.isAbleToMove = true;
    this.isGameActive = false;
    this.isGameWon = false;
    this.isGameLost = false;
  }

  moveLeft() {
    if (this.isGameActive) {
      this.moveTo('left');
    }
  }
  moveRight() {
    if (this.isGameActive) {
      this.moveTo('right');
    }
  }
  moveUp() {
    if (this.isGameActive) {
      this.moveTo('up');
    }
  }
  moveDown() {
    if (this.isGameActive) {
      this.moveTo('down');
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.boardScore;
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
    switch (true) {
      case this.isGameWon:
        this.currentStatus = 'win';
        break;
      case this.isGameLost:
        this.currentStatus = 'lose';
        break;
      case this.isGameActive:
        this.currentStatus = 'playing';
        break;
      default:
        this.currentStatus = 'idle';
        break;
    }

    return this.currentStatus;
  }

  /**
   * Starts the game.
   */
  start() {
//================================================================================
    /*this.board = this.initialBoard || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];*/

    /*

      Не працюэ тест, коли ставлю this.initialBoard,
      але без нього тест пройти не можу

      it('should allow to start a new game', () => {
        game2048.restart();
        game2048.start();

        expect(game2048.getStatus()).toBe('playing');
      });

    */
//================================================================================
    this.isGameActive = true;
    this.placeNewCell();
    this.placeNewCell();
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
    this.boardScore = 0;

    this.currentStatus = 'idle';
    this.isGameActive = false;
    this.isGameWon = false;
    this.isGameLost = false;
  }

  placeNewCell() {
    let randomRow, randomColumn;

    do {
      randomRow = Math.floor(Math.random() * 4);
      randomColumn = Math.floor(Math.random() * 4);
    } while (
      this.board[randomRow][randomColumn] !== 0
    );

    this.board[randomRow][randomColumn] = this.createCell();
  }

  createCell() {
    const randomValue = Math.random();

    return randomValue < 0.1 ? 4 : 2;
  }

  moveTo(direction) {
    if (!this.isGameActive) {
      return;
    }

    const numCols = this.board[0].length;
    let currentTable = JSON.parse(JSON.stringify(this.board));
    let addScore = 0;

    const transpose = (table) => {
      return table[0].map((_, colIndex) => table.map(row => row[colIndex]));
    };

    const reverseRow = (table) => {
      return table.map(row => row.slice().reverse());
    };

    const moveTable = (table) => {
      const newTable = table.map(row => {
        let newRow = row.filter(num => num !== 0);
        const zerosToAdd = numCols - newRow.length;

        newRow = [...Array(zerosToAdd).fill(0), ...newRow];

        for (let i = newRow.length; i >= 0; i--) {
          if (newRow[i - 1] === newRow[i]) {
            newRow[i - 1] *= 2;
            newRow[i] = 0;
            addScore += newRow[i - 1];
            i--;
          }
        }
        newRow = newRow.filter(num => num !== 0);

        const zerosToAddEnd = numCols - newRow.length;

        newRow = [...Array(zerosToAddEnd).fill(0), ...newRow];

        return newRow;
      });

      return newTable;
    };

    const isGameOver = () => {
      const GAME_FIELD = 4;

      for (let i = 0; i < GAME_FIELD; i++) {
        for (let j = 0; j < GAME_FIELD; j++) {
          if (this.board[i][j] === 0) {
            return false;
          }
        }
      }

      for (let i = 0; i < GAME_FIELD; i++) {
        for (let j = 0; j < GAME_FIELD; j++) {
          if (j < GAME_FIELD - 1
              && this.board[i][j] === this.board[i][j + 1]) {
            return false;
          }

          if (i < GAME_FIELD - 1
              && this.board[i][j] === this.board[i + 1][j]) {
            return false;
          }
        }
      }

      this.isGameActive = false;
      this.isGameLost = true;

      return true;
    };

    const makeMove = (moveToSide) => {
      if (JSON.stringify(moveToSide) === JSON.stringify(currentTable)) {
        return;
      }

      this.board = moveToSide;
      currentTable = moveToSide;

      if (this.board.flat().includes(2048)) {
        this.isGameActive = false;
        this.isGameWon = true;

        this.getStatus();

        return;
      }

      this.placeNewCell();

      if (!isGameOver()) {
        this.isAbleToMove = false;
      }
    };

    switch (direction) {
      case 'up':
        const moveUp = transpose(
          reverseRow(
            moveTable(
              reverseRow(
                transpose(currentTable)))));

        makeMove(moveUp);

        this.boardScore += addScore;
        break;
      case 'down':
        const moveDown = transpose(
          moveTable(
            transpose(currentTable)));

        makeMove(moveDown);

        this.boardScore += addScore;
        break;
      case 'right':
        const moveRight = moveTable(currentTable);

        makeMove(moveRight);

        this.boardScore += addScore;
        break;
      case 'left':
        const moveLeft = reverseRow(
          moveTable(
            reverseRow(currentTable)));

        makeMove(moveLeft);

        this.boardScore += addScore;
        break;
    }
  }
  // Add your own methods here
}

module.exports = Game;
