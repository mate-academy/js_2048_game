'use strict';

const {
  BOARD_SIZE,
  TILE_TWO,
  TILE_FOUR,
  EMPTY_CELL,
  START_TILES_COUNT,
  WIN_TILE,
  FOUR_PROBABILITY,
  STATUSES,
} = require('../scripts/constants');

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
   * [[EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
   *  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
   *  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
   *  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    if (initialState !== undefined) {
      this.initialState = initialState.map((row) => [...row]);
    } else {
      this.initialState = this.createEmptyBoard();
    }

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = STATUSES.IDLE;
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
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
    return this.state.map((row) => [...row]);
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
    if (this.status === STATUSES.IDLE) {
      this.status = STATUSES.PLAYING;

      for (let i = 0; i < START_TILES_COUNT; i++) {
        this.addRandomTile();
      }
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = STATUSES.IDLE;
  }

  // Add your own methods here

  twoOrFour() {
    const rand = Math.random();

    if (rand < FOUR_PROBABILITY) {
      return TILE_FOUR;
    } else {
      return TILE_TWO;
    }
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (this.state[r][c] === EMPTY_CELL) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return null;
    }

    const randomCell = Math.floor(Math.random() * empty.length);
    const row = empty[randomCell][0];
    const col = empty[randomCell][1];
    const value = this.twoOrFour();

    this.state[row][col] = value;

    return { row, col, value };
  }

  transpose() {
    const newState = [];

    for (let r = 0; r < this.state.length; r++) {
      newState[r] = [];

      for (let c = 0; c < this.state[r].length; c++) {
        newState[r][c] = this.state[c][r];
      }
    }

    this.state = newState;
  }

  checkWin() {
    if (this.state.some((row) => row.some((el) => el === WIN_TILE))) {
      this.status = STATUSES.WIN;
    }
  }

  hasMoves() {
    const checkState = this.getState();

    if (
      checkState.some((row) => row.some((el) => el === EMPTY_CELL)) === true
    ) {
      return true;
    }

    for (let r = 0; r < checkState.length; r++) {
      for (let c = 0; c < checkState.length; c++) {
        if (
          c < checkState.length - 1 &&
          checkState[r][c] === checkState[r][c + 1]
        ) {
          return true;
        }

        if (
          r < checkState.length - 1 &&
          checkState[r][c] === checkState[r + 1][c]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  createMoveMeta() {
    return {
      moved: false,
      moves: [],
      merges: [],
      spawnedTile: null,
      scoreDelta: 0,
    };
  }

  move(direction) {
    const meta = this.createMoveMeta();

    if (this.status !== STATUSES.PLAYING) {
      return meta;
    }

    const prevScore = this.score;
    const lines = this.getLines(direction);

    lines.forEach((line) => this.processLine(line, meta));

    meta.scoreDelta = this.score - prevScore;

    if (meta.moved) {
      meta.spawnedTile = this.addRandomTile();
      this.checkWin();

      if (this.status !== STATUSES.WIN && !this.hasMoves()) {
        this.status = STATUSES.LOSE;
      }
    }

    return meta;
  }

  getLines(direction) {
    const lines = [];

    if (direction === 'left') {
      for (let row = 0; row < BOARD_SIZE; row++) {
        lines.push(this.createLine(row, direction));
      }
    }

    if (direction === 'right') {
      for (let row = 0; row < BOARD_SIZE; row++) {
        lines.push(this.createLine(row, direction));
      }
    }

    if (direction === 'up') {
      for (let index = 0; index < BOARD_SIZE; index++) {
        lines.push(this.createLine(index, direction));
      }
    }

    if (direction === 'down') {
      for (let index = 0; index < BOARD_SIZE; index++) {
        lines.push(this.createLine(index, direction));
      }
    }

    return lines;
  }

  processLine(line, meta) {
    const tiles = line
      .map((coord) => ({
        value: this.state[coord.row][coord.col],
        from: coord,
      }))
      .filter((tile) => tile.value !== EMPTY_CELL);
    const nextValues = new Array(BOARD_SIZE).fill(EMPTY_CELL);
    let targetIndex = 0;

    for (let i = 0; i < tiles.length; i++) {
      const current = tiles[i];
      const next = tiles[i + 1];
      const to = line[targetIndex];

      if (next && current.value === next.value) {
        const mergedValue = current.value * 2;

        nextValues[targetIndex] = mergedValue;
        this.score += mergedValue;

        meta.merges.push({
          into: { row: to.row, col: to.col, value: mergedValue },
          sources: [
            {
              from: {
                row: current.from.row,
                col: current.from.col,
              },
              value: current.value,
            },
            {
              from: {
                row: next.from.row,
                col: next.from.col,
              },
              value: next.value,
            },
          ],
        });

        i++;
      } else {
        nextValues[targetIndex] = current.value;

        if (current.from.row !== to.row || current.from.col !== to.col) {
          meta.moves.push({
            from: {
              row: current.from.row,
              col: current.from.col,
            },
            to: {
              row: to.row,
              col: to.col,
            },
            value: current.value,
          });
        }
      }

      targetIndex++;
    }

    line.forEach((coord, index) => {
      if (this.state[coord.row][coord.col] !== nextValues[index]) {
        meta.moved = true;
      }

      this.state[coord.row][coord.col] = nextValues[index];
    });
  }

  createEmptyBoard() {
    const createRow = () => Array(BOARD_SIZE).fill(EMPTY_CELL);

    return Array.from({ length: BOARD_SIZE }, createRow);
  }

  createLine(index, direction) {
    const line = [];

    if (direction === 'left') {
      for (let col = 0; col < BOARD_SIZE; col++) {
        line.push({ row: index, col });
      }
    }

    if (direction === 'right') {
      for (let col = BOARD_SIZE - 1; col >= 0; col--) {
        line.push({ row: index, col });
      }
    }

    if (direction === 'up') {
      for (let row = 0; row < BOARD_SIZE; row++) {
        line.push({ row, col: index });
      }
    }

    if (direction === 'down') {
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        line.push({ row, col: index });
      }
    }

    return line;
  }
}

module.exports = Game;
