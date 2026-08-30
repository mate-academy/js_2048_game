'use strict';

/**
 * Stateless matrix helpers shared by the game.
 * None of these methods touch instance state on purpose,
 * so they live as statics on a base class.
 */
class BoardUtils {
  static createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  static cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  static boardsEqual(boardA, boardB) {
    return boardA.every((row, r) => row.every((v, c) => v === boardB[r][c]));
  }

  static transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  static reverseRow(row) {
    return [...row].reverse();
  }

  static addRandomTile(board) {
    const emptyCells = [];

    board.forEach((boardRow, r) => {
      boardRow.forEach((value, c) => {
        if (value === 0) {
          emptyCells.push([r, c]);
        }
      });
    });

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = BoardUtils.cloneBoard(board);

    newBoard[row][col] = Math.random() < 0.1 ? 4 : 2;

    return newBoard;
  }

  static hasWinningTile(board) {
    return board.some((row) => row.includes(2048));
  }

  static hasAdjacentPair(board) {
    return board.some((row) => {
      return row.some((value, c) => c < row.length - 1 && value === row[c + 1]);
    });
  }

  static isMoveAvailable(board) {
    const hasEmptyCell = board.some((row) => row.includes(0));

    if (hasEmptyCell) {
      return true;
    }

    return (
      BoardUtils.hasAdjacentPair(board) ||
      BoardUtils.hasAdjacentPair(BoardUtils.transpose(board))
    );
  }

  static moveRowLeft(row) {
    const values = row.filter((value) => value !== 0);
    const mergedRow = [];
    let scoreGained = 0;

    for (let i = 0; i < values.length; i++) {
      const current = values[i];
      const next = values[i + 1];

      if (current === next) {
        const mergedValue = current * 2;

        mergedRow.push(mergedValue);
        scoreGained += mergedValue;
        i++;
      } else {
        mergedRow.push(current);
      }
    }

    while (mergedRow.length < row.length) {
      mergedRow.push(0);
    }

    return { row: mergedRow, scoreGained };
  }
}

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game extends BoardUtils {
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
    super();

    this.initialState = initialState
      ? Game.cloneBoard(initialState)
      : Game.createEmptyBoard();

    this.board = Game.cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  move(transformBoard, restoreBoard) {
    if (this.status !== 'playing') {
      return;
    }

    let scoreGained = 0;

    const movedRows = transformBoard(this.board).map((row) => {
      const result = Game.moveRowLeft(row);

      scoreGained += result.scoreGained;

      return result.row;
    });

    const newBoard = restoreBoard(movedRows);

    if (Game.boardsEqual(this.board, newBoard)) {
      return;
    }

    this.board = Game.addRandomTile(newBoard);
    this.score += scoreGained;

    if (Game.hasWinningTile(this.board)) {
      this.status = 'win';
    } else if (!Game.isMoveAvailable(this.board)) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    this.move(
      (board) => board,
      (board) => board,
    );
  }

  moveRight() {
    this.move(
      (board) => board.map((row) => Game.reverseRow(row)),
      (board) => board.map((row) => Game.reverseRow(row)),
    );
  }

  moveUp() {
    this.move(
      (board) => Game.transpose(board),
      (board) => Game.transpose(board),
    );
  }

  moveDown() {
    this.move(
      (board) => Game.transpose(board).map((row) => Game.reverseRow(row)),
      (board) => Game.transpose(board.map((row) => Game.reverseRow(row))),
    );
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
    return Game.cloneBoard(this.board);
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
    if (this.status !== 'idle') {
      return;
    }

    this.board = Game.addRandomTile(this.board);
    this.board = Game.addRandomTile(this.board);
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Game.cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
