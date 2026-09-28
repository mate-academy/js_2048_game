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
    const defaultBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const startingBoard = initialState || defaultBoard;

    this.initialState = JSON.parse(JSON.stringify(startingBoard));
    this.board = JSON.parse(JSON.stringify(startingBoard));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    return this.makeMove('left');
  }

  moveRight() {
    return this.makeMove('right');
  }

  moveUp() {
    return this.makeMove('up');
  }

  moveDown() {
    return this.makeMove('down');
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
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    if (this.isEmptyBoard()) {
      this.spawnTile();
      this.spawnTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'playing';

    if (this.isEmptyBoard()) {
      this.spawnTile();
      this.spawnTile();
    }
  }

  isEmptyBoard() {
    return this.board.every((row) => row.every((cell) => cell === 0));
  }

  spawnTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const targetCell = emptyCells[randomIndex];

    this.board[targetCell.row][targetCell.col] = Math.random() < 0.1 ? 4 : 2;
  }

  slideRowLeft(row) {
    const nonZeros = row.filter((val) => val !== 0);
    const newRow = [];
    let gainedScore = 0;
    let index = 0;

    while (index < nonZeros.length) {
      if (
        index + 1 < nonZeros.length &&
        nonZeros[index] === nonZeros[index + 1]
      ) {
        const mergedValue = nonZeros[index] * 2;

        newRow.push(mergedValue);
        gainedScore += mergedValue;
        index += 2;
      } else {
        newRow.push(nonZeros[index]);
        index += 1;
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, gainedScore };
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  makeMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    let currentBoard = JSON.parse(JSON.stringify(this.board));

    if (direction === 'right') {
      currentBoard = currentBoard.map((row) => [...row].reverse());
    } else if (direction === 'up') {
      currentBoard = this.transpose(currentBoard);
    } else if (direction === 'down') {
      const reversed = currentBoard.map((row) => [...row].reverse());

      currentBoard = this.transpose(reversed);
    }

    const newBoard = [];
    let totalScoreGained = 0;

    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      const { newRow, gainedScore } = this.slideRowLeft(currentBoard[rowIndex]);

      newBoard.push(newRow);
      totalScoreGained += gainedScore;
    }

    let finalBoard = newBoard;

    if (direction === 'right') {
      finalBoard = finalBoard.map((row) => [...row].reverse());
    } else if (direction === 'up') {
      finalBoard = this.transpose(finalBoard);
    } else if (direction === 'down') {
      const reversed = finalBoard.map((row) => [...row].reverse());

      finalBoard = this.transpose(reversed);
    }

    const hasChanged =
      JSON.stringify(this.board) !== JSON.stringify(finalBoard);

    if (hasChanged) {
      this.board = finalBoard;
      this.score += totalScoreGained;
      this.spawnTile();
      this.checkGameStatus();

      return true;
    }

    return false;
  }

  checkGameStatus() {
    let has2048 = false;
    let hasEmptyCell = false;

    this.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 2048) {
          has2048 = true;
        }

        if (cell === 0) {
          hasEmptyCell = true;
        }
      });
    });

    if (has2048) {
      this.status = 'win';

      return;
    }

    if (hasEmptyCell) {
      return;
    }

    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 4; colIndex += 1) {
        const val = this.board[rowIndex][colIndex];

        if (colIndex + 1 < 4 && val === this.board[rowIndex][colIndex + 1]) {
          return;
        }

        if (rowIndex + 1 < 4 && val === this.board[rowIndex + 1][colIndex]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
