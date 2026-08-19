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

  static SIZE = 4;
  static INITIAL_TILES = 2;
  static BEST_SCORE_KEY = '2048-best-score';

  constructor(initialState) {
    if (initialState) {
      this.board = initialState;
    } else {
      this.board = this.createBoard();
    }

    this.tiles = [];
    this.nextTileId = 0;

    this.score = 0;
    this.bestScore = Number(localStorage.getItem(Game.BEST_SCORE_KEY)) || 0;
    this.status = 'idle';
  }

  createRow() {
    return Array.from({ length: Game.SIZE }, () => 0);
  }

  createBoard() {
    return Array.from({ length: Game.SIZE }, () => this.createRow());
  }

  moveLeft() {
    return this.applyMove('left');
  }
  moveRight() {
    return this.applyMove('right');
  }
  moveUp() {
    return this.applyMove('up');
  }
  moveDown() {
    return this.applyMove('down');
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  getBestScore() {
    return this.bestScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const board = this.createBoard();

    this.tiles.forEach((tile) => {
      board[tile.row][tile.col] = tile.value;
    });

    return board;
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
    this.board = this.createBoard();
    this.tiles = [];
    this.nextTileId = 0;

    this.score = 0;
    this.status = 'playing';

    for (let i = 0; i < Game.INITIAL_TILES; i++) {
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  getTiles() {
    return this.tiles;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [row, col] = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;

    this.tiles.push({
      id: this.nextTileId++,
      value,
      row,
      col,
      previousRow: row,
      previousCol: col,
    });
  }

  saveTilePositions() {
    this.tiles.forEach((tile) => {
      tile.previousRow = tile.row;
      tile.previousCol = tile.col;
    });
  }

  hasChanged(oldBoard, newBoard) {
    for (let row = 0; row < Game.SIZE; row++) {
      for (let col = 0; col < Game.SIZE; col++) {
        if (oldBoard[row][col] !== newBoard[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      return (this.status = 'win');
    }

    const hasEmpty = this.getEmptyCells().length > 0;
    const hasMoves = this.canMerge();

    if (!hasEmpty && !hasMoves) {
      return (this.status = 'lose');
    }
  }

  canMerge() {
    for (let row = 0; row < Game.SIZE; row++) {
      for (let col = 0; col < Game.SIZE; col++) {
        const value = this.board[row][col];

        if (
          (col < Game.SIZE - 1 && value === this.board[row][col + 1]) ||
          (row < Game.SIZE - 1 && value === this.board[row + 1][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  processRow(tiles = []) {
    const nonZeroTiles = tiles.filter(Boolean);

    const merged = [];
    let scoreGained = 0;

    for (let i = 0; i < nonZeroTiles.length; i++) {
      const currentTile = nonZeroTiles[i];
      const nextTile = nonZeroTiles[i + 1];

      if (nextTile && currentTile.value === nextTile.value) {
        const mergedTile = {
          id: this.nextTileId++,
          value: currentTile.value * 2,
          mergedFrom: [currentTile.id, nextTile.id],
          previousRow: currentTile.row,
          previousCol: currentTile.col,
        };

        merged.push(mergedTile);

        scoreGained += mergedTile.value;

        i++;
      } else {
        merged.push(currentTile);
      }
    }

    while (merged.length < Game.SIZE) {
      merged.push(null);
    }

    return { row: merged, score: scoreGained };
  }

  getTileBoard() {
    const tileBoard = Array.from({ length: Game.SIZE }, () => {
      return Array(Game.SIZE).fill(null);
    });

    this.tiles.forEach((tile) => {
      tileBoard[tile.row][tile.col] = tile;
    });

    return tileBoard;
  }

  applyMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    this.saveTilePositions();

    const isVertical = direction === 'up' || direction === 'down';
    const isReversed = direction === 'right' || direction === 'down';

    const tileBoard = this.getTileBoard();

    const orientedTiles = isVertical ? this.transpose(tileBoard) : tileBoard;

    const preparedTiles = isReversed
      ? orientedTiles.map((row) => [...row].reverse())
      : orientedTiles;

    let totalScore = 0;

    const mergedTiles = preparedTiles.map((row) => {
      const { row: newRow, score } = this.processRow(row);

      totalScore += score;

      return newRow;
    });

    const unreversedTiles = isReversed
      ? mergedTiles.map((row) => [...row].reverse())
      : mergedTiles;

    const finalTiles = isVertical
      ? this.transpose(unreversedTiles)
      : unreversedTiles;

    finalTiles.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        if (tile) {
          tile.row = rowIndex;
          tile.col = colIndex;
        }
      });
    });

    const finalBoard = this.createBoardFromTiles(finalTiles);

    const moved = this.hasChanged(this.board, finalBoard);

    if (!moved) {
      return false;
    }

    this.tiles = finalTiles.flat().filter(Boolean);

    this.board = finalBoard;
    this.score += totalScore;

    this.bestScore = Math.max(this.score, this.bestScore);

    localStorage.setItem(Game.BEST_SCORE_KEY, this.bestScore);

    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  createBoardFromTiles(tilesBoard) {
    return tilesBoard.map((row) => {
      return row.map((tile) => (tile ? tile.value : 0));
    });
  }

  transpose(board) {
    if (board.length === 0) {
      return [];
    }

    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }
}

module.exports = Game;
