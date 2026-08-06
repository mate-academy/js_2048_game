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
    this.initialState = initialState;

    this.board =
      initialState ||
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
  }

  addRandomCell() {
    const emptyCell = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        if (column === 0) {
          emptyCell.push({ r: rowIndex, c: columnIndex });
        }
      });
    });

    if (emptyCell.length === 0) {
      return;
    }

    const randomEmptyCell = Math.floor(Math.random() * emptyCell.length);
    const targetCell = emptyCell[randomEmptyCell];
    const valueCell2or4 = Math.random() < 0.9 ? 2 : 4;

    this.board[targetCell.r][targetCell.c] = valueCell2or4;
  }

  canMove() {
    const size = this.board.length;

    const hasMoves = this.board.some((row, rowIndex) => {
      return row.some((current, currentIndex) => {
        if (current === 0) {
          return true;
        }

        if (currentIndex < size - 1 && current === row[currentIndex + 1]) {
          return true;
        }

        if (
          rowIndex < size - 1 &&
          current === this.board[rowIndex + 1][currentIndex]
        ) {
          return true;
        }

        return false;
      });
    });

    return hasMoves;
  }

  isWin() {
    const hasWin = this.board.some((row) => {
      return row.some((current) => {
        return current === 2048;
      });
    });

    if (hasWin) {
      this.status = 'win';
    }

    return hasWin;
  }

  isLose() {
    const hasEmptyCells = this.board.some((row) => {
      return row.some((current) => current === 0);
    });

    const hasLose = !hasEmptyCells && !this.canMove();

    if (hasLose) {
      this.status = 'lose';
    }

    return hasLose;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const result = this.moveLine(this.board[row]);

      if (JSON.stringify(this.board[row]) !== JSON.stringify(result.line)) {
        moved = true;
      }

      this.board[row] = result.line;
      this.score += result.score;
    }

    if (moved) {
      this.addRandomCell();
      this.isWin();
      this.isLose();
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const reversed = this.board[row].reverse();
      const result = this.moveLine(reversed);

      if (
        JSON.stringify(this.board[row]) !==
        JSON.stringify(result.line.reverse())
      ) {
        moved = true;
      }

      this.board[row] = result.line.reverse();
      this.score += result.score;
    }

    if (moved) {
      this.addRandomCell();
      this.isWin();
      this.isLose();
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let column = 0; column < 4; column++) {
      const col = [
        this.board[0][column],
        this.board[1][column],
        this.board[2][column],
        this.board[3][column],
      ];
      const result = this.moveLine(col);

      if (JSON.stringify(col) !== JSON.stringify(result.line)) {
        moved = true;
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][column] = result.line[row];
      }

      this.score += result.score;
    }

    if (moved) {
      this.addRandomCell();
      this.isWin();
      this.isLose();
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let column = 0; column < 4; column++) {
      const col = [
        this.board[0][column],
        this.board[1][column],
        this.board[2][column],
        this.board[3][column],
      ];

      const reversed = [...col].reverse();

      const result = this.moveLine(reversed);

      const newColumn = result.line.reverse();

      if (JSON.stringify(col) !== JSON.stringify(newColumn)) {
        moved = true;
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][column] = newColumn[row];
      }

      this.score += result.score;
    }

    if (moved) {
      this.addRandomCell();
      this.isWin();
      this.isLose();
    }

    return moved;
  }

  moveLine(line) {
    const filterLine = line.filter((cell) => cell !== 0);

    const result = [];
    let score = 0;
    let skipCell = false;

    for (let index = 0; index < filterLine.length; index++) {
      if (skipCell) {
        result.push(filterLine[index]);
        skipCell = false;

        continue;
      }

      if (
        index < filterLine.length - 1 &&
        filterLine[index] === filterLine[index + 1]
      ) {
        result.push(filterLine[index] * 2);
        score += filterLine[index] * 2;
        skipCell = true;
        index++;
      } else {
        result.push(filterLine[index]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return {
      line: result,
      score: score,
    };
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
    this.addRandomCell();
    this.addRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board =
      this.initialState ||
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
}

export default Game;
