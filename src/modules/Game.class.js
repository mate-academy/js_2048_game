'use strict';

const { ACTIONS, STATUSES } = require('../shared/constants');

class Game {
  #MOVEMENT_ACTIONS = new Set([
    ACTIONS.MOVE_LEFT,
    ACTIONS.MOVE_RIGHT,
    ACTIONS.MOVE_UP,
    ACTIONS.MOVE_DOWN,
  ]);

  #initialState;
  // TODO!: change lastIndex into lastRowIndex and lastColIndex
  // ! and apply respectively.
  lastIndex = 3;

  #state;
  #status = STATUSES.IDLE;
  #score = 0;
  #emptyCellCount = 0;

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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // TODO: Do everything with one-dimension Uint32Array!
    // TODO:    Or a smaller Uint array for just the power
    // TODO:    + math out the conversion to 2D everywhere.

    // > Checking for 4x4

    if (initialState.length !== 4 || initialState[0].length !== 4) {
      throw new Error('The field size should be 4x4.');
      // TODO: Don't just throw?
      // TODO: Better check for col amount.
    }

    // > Checking for 2^n

    const invalidTile = {
      rowIndex: -1,
      colIndex: -1,
      value: 0,
    };

    if (
      initialState.some((row, rowIndex) =>
        row.some((tile, colIndex) => {
          const power = Math.log2(tile);

          if (tile === 0 || (Number.isInteger(power) && power !== 0)) {
            return false;
          }

          invalidTile.rowIndex = rowIndex;
          invalidTile.colIndex = colIndex;
          invalidTile.value = tile;

          return true;
        }),
      ) // eslint-disable-line function-paren-newline
    ) {
      throw new Error(
        `The state must contain only 2^n values` +
          `, but the tile ${invalidTile.value}` +
          ` on row ${invalidTile.rowIndex + 1}, column ${invalidTile.colIndex + 1}` +
          ` doesn't satisfy that requirement.`,
      ); // eslint-disable-line function-paren-newline
    }

    // > Backing up the initial state

    this.#initialState = this.deepCopy2DState(initialState);
    // TODO: stringify and parse maybe.

    // > Preparing the game

    this.#assemble(initialState);
  }

  /**
   * Sets `state`, `emptyCellCount`, and `status` based on the state
   * passed as a first parameter.
   * Spawns a tile if the passed state is empty.
   */
  #assemble(state) {
    this.#state = state;
    // ? Does the place where the state is stored make a difference?

    this.countEmptyCells();

    if (this.#emptyCellCount === (this.lastIndex + 1) * (this.lastIndex + 1)) {
      // "if the field is empty"
      this.spawnTile();
      this.#emptyCellCount--;
    }

    if (this.#emptyCellCount === 0 && !this.isMergePossible()) {
      this.#status = STATUSES.LOSE;
    }

    // three loops...
  }

  /**
   * Performs a deep copy of a 2D state passed as a first parameter.
   *
   * @returns {number[][]}
   */
  deepCopy2DState(state) {
    return state.map((row) => [...row.map((cell) => cell)]);
  }

  /**
   * Counts empty cells in the current state of the game,
   * sets the `emptyCellCount` private property of the game
   * instance.
   */
  countEmptyCells() {
    this.#emptyCellCount = this.#state.reduce(
      (rowSum, row) =>
        rowSum +
        row.reduce((cellSum, cell) => cellSum + (cell === 0 ? 1 : 0), 0),
      0,
    );
  }

  /**
   * Determines if the merge is possible in the current
   * state of the game.
   */
  isMergePossible() {
    // TODO: refactor
    // similarAdjacentTilesPresent
    for (let i = 0; i < this.lastIndex; i++) {
      for (let j = 0; j < this.lastIndex; j++) {
        if (
          this.#state[i][j] === this.#state[i][j + 1] ||
          this.#state[i][j] === this.#state[i + 1][j]
        ) {
          return true;
        }
      }
    }

    for (let i = 0; i < this.lastIndex; i++) {
      if (
        this.#state[i][this.lastIndex] === this.#state[i + 1][this.lastIndex]
      ) {
        return true;
      }
    }

    for (let j = 0; j < this.lastIndex; j++) {
      if (
        this.#state[this.lastIndex][j] === this.#state[this.lastIndex][j + 1]
      ) {
        return true;
      }
    }

    return false;
  }

  action(identifier) {
    if (this.#MOVEMENT_ACTIONS.has(identifier)) {
      this.handleMove(identifier);
    }
  }

  handleMove(direction) {
    switch (direction) {
      case ACTIONS.MOVE_LEFT:
        // These middlemen are here for the tests
        //    according to README requirements.
        this.moveLeft();
        break;
      case ACTIONS.MOVE_RIGHT:
        this.moveRight();
        break;
      case ACTIONS.MOVE_UP:
        this.moveUp();
        break;
      case ACTIONS.MOVE_DOWN:
        this.moveDown();
        break;
      default:
        throw new Error(`Movement action "${direction}" not recognized.`);
    }
  }

  moveLeft() {
    /* eslint-disable prettier/prettier */
    return this.#performMove(
      (lineIndex, cellIndex) => [lineIndex, cellIndex],
    );
    /* eslint-enable */
  }

  moveRight() {
    /* eslint-disable prettier/prettier */
    return this.#performMove((lineIndex, cellIndex) => [
      lineIndex,
      this.lastIndex - cellIndex,
    ]);
    /* eslint-enable */
  }

  moveUp() {
    /* eslint-disable prettier/prettier */
    return this.#performMove(
      (lineIndex, cellIndex) => [cellIndex, lineIndex],
    );
    /* eslint-enable */
  }

  moveDown() {
    /* eslint-disable prettier/prettier */
    return this.#performMove((lineIndex, cellIndex) => [
      this.lastIndex - cellIndex,
      lineIndex,
    ]);
    /* eslint-enable */
  }

  /**
   * Merges and shifts tiles in the direction specified by the passed mapper.
   * Increases score. Spawns a tile. Updates status.
   *
   * @param {function(number, number): [number, number]} mapIndices
   * Maps `(lineIndex, cellIndex)` to `[rowIndex, colIndex]`.
   */
  #performMove(mapIndices) {
    // TODO: Extract loops into methods?
    // TODO: Separate merging and shifting from checks?
    // TODO:    Do checks in another loop kinda?
    // TODO: COMBINE everything in just one loop instead?
    // TODO:    For research purposes.
    // > Configuration
    // TODO: These indices have to be mapped too!
    // TODO:    (only if grids can be of different size)
    const lastLineIndex = this.lastIndex;
    const lastCellIndex = this.lastIndex;

    // # Loop 1: Merging

    // > Declaring stuff to track
    let haveTilesMoved = false;
    let scoreIncrease = 0;
    let isNextMovePossible = false;
    // This "isNextMovePossible" could be replaced
    // with isMergeOnNextMovePossible + change checks later in code for both
    // isMergeOnNextMovePossible and emptyCellCount something.

    // > Looping through lines
    for (let lineIndex = 0; lineIndex <= lastLineIndex; lineIndex++) {
      let accumulatorValue = 0;
      let accumulatorIndex;

      // > Looping through cells
      for (let cellIndex = 0; cellIndex <= lastCellIndex; cellIndex++) {
        const [rowIndex, colIndex] = mapIndices(lineIndex, cellIndex);

        const cellValue = this.#state[rowIndex][colIndex];

        if (cellValue === 0) {
          continue;
        }

        // > Changing accumulator
        if (accumulatorValue !== cellValue) {
          accumulatorValue = cellValue;
          accumulatorIndex = cellIndex;
          continue;
        }

        // > Merging
        const [accumulatorRowIndex, accumulatorColIndex] = mapIndices(
          lineIndex,
          accumulatorIndex,
        );

        this.#state[accumulatorRowIndex][accumulatorColIndex] +=
          accumulatorValue;
        this.#state[rowIndex][colIndex] = 0;
        // * One of them becomes empty, so increase empty count:
        this.#emptyCellCount++;

        if (!haveTilesMoved) {
          haveTilesMoved = true;
          // * The move finishes in the next loop.
          // * This can also be named haveTilesMerged,
          // * if distinguishing is important.
        }

        scoreIncrease += 2 * accumulatorValue;

        if (accumulatorValue === 1024) {
          this.#status = STATUSES.WIN;
        }

        accumulatorValue = 0;
        // * Index doesn't have to be reset
      }
    }

    if (this.#emptyCellCount >= 2) {
      isNextMovePossible = true;
    }

    // # Loop 2: Shifting

    // > Preparing to spawn a tile
    let newTilePosition = -1;
    let newTileReached = false;
    let newTileLineIndex = -1;
    let newTileCellIndex = -1;
    let newTileAdjacentTileInLine = -1;

    if (this.#emptyCellCount >= 1) {
      newTilePosition = Math.floor(Math.random() * this.#emptyCellCount);
    }

    // > Looping through lines
    for (let lineIndex = 0; lineIndex <= lastLineIndex; lineIndex++) {
      let nextCellOffset = 0;

      // * This tile would be compared to adjacent tiles in the same line
      // * to determine if a merge would be possible on next turn in this line.
      // ? is there a benefit to moving it out of the loop
      // ? and resetting on each lineIndex iteration?
      let currentTile = -1;

      // > Looping through cells to find an empty cell
      for (let cellIndex = 0; cellIndex <= lastCellIndex; cellIndex++) {
        const [rowIndex, colIndex] = mapIndices(lineIndex, cellIndex);

        const currentCell = this.#state[rowIndex][colIndex];

        if (currentCell !== 0) {
          if (isNextMovePossible) {
            continue;
          }

          if (currentTile === currentCell) {
            isNextMovePossible = true;
            continue;
          }

          // * It's a little messy here, this assignment can
          // * appear to be redundant if the cross-line check
          // * passses, but at the same time this assignment
          // * has to happen before the lineIndex === 0 check
          // * which skips everything after it.
          currentTile = currentCell;

          if (lineIndex === 0) {
            continue;
          }

          const [prevRowIndex, prevColIndex] = mapIndices(
            lineIndex - 1,
            cellIndex,
          );

          if (currentCell === this.#state[prevRowIndex][prevColIndex]) {
            isNextMovePossible = true;
          }

          continue;
        }

        // > ... thus the target is the first empty cell.

        let nextCellIndex = cellIndex + nextCellOffset;

        if (nextCellIndex > lastCellIndex) {
          break;
        }

        // > Looping through cells starting from target to find a tile
        for (; nextCellIndex <= lastCellIndex; nextCellIndex++) {
          const [nextRowIndex, nextColIndex] = mapIndices(
            lineIndex,
            nextCellIndex,
          );

          const nextTile = this.#state[nextRowIndex][nextColIndex];

          if (nextTile === 0) {
            nextCellOffset++;

            if (newTileReached) {
              continue;
            }

            if (newTilePosition > 0) {
              newTilePosition--;
            } else {
              newTileReached = true;
              newTileLineIndex = lineIndex;
              newTileCellIndex = lastCellIndex - (nextCellOffset - 1);
              // * 1. "Offset - 1" because it was already incremented;
              // * 2. Subtract from the end because the tile will be placed
              // *    from the empty cell side. This doesn't affect the
              // *    probability.

              // * There's an option to add the amount of tiles to this offset
              // * and place a tile starting from the side that everything moved
              // * to, but instead the same result in terms of probability can
              // * be achieved by placing a tile starting from the empty side.
              // TODO: Store indices for row and col, no need to map latter.
            }

            continue;
          }

          // > Moving a tile to the empty cell
          this.#state[rowIndex][colIndex] = nextTile;
          this.#state[nextRowIndex][nextColIndex] = 0;
          // * And now the move is finished for that tile.

          if (!haveTilesMoved) {
            haveTilesMoved = true;
          }

          // > "Would merge be possible on next turn" checks
          if (isNextMovePossible) {
            break;
          }

          // > In-line
          if (currentTile === nextTile) {
            isNextMovePossible = true;
            break;
          }

          currentTile = nextTile;

          // > Cross-line
          if (lineIndex === 0) {
            break;
          }

          const [prevRowIndex, prevColIndex] = mapIndices(
            lineIndex - 1,
            cellIndex,
          );

          if (nextTile === this.#state[prevRowIndex][prevColIndex]) {
            isNextMovePossible = true;
            break;
          }

          break;
        }
      }

      // * I'm sure this could be done better
      // * but I'm just pushing through at this point.
      // * One alternative is to loop through that line
      // * in the "placing tile" part of the code.
      if (newTileReached && newTileAdjacentTileInLine === -1) {
        newTileAdjacentTileInLine = currentTile;
      }
    }

    // # Checks & New tile (with its own checks!)

    if (!haveTilesMoved) {
      return;
    }

    // > Placing new tile
    const newTile = Math.random() < 0.9 ? 2 : 4;

    const [newTileRowIndex, newTileColIndex] = mapIndices(
      newTileLineIndex,
      newTileCellIndex,
    );

    this.#state[newTileRowIndex][newTileColIndex] = newTile;
    this.#emptyCellCount--;

    // > "Would merge be possible on next turn" checks for new tile
    if (!isNextMovePossible) {
      if (newTile === newTileAdjacentTileInLine) {
        isNextMovePossible = true;
      } else {
        // It's also possible to figure out the cell index in a merging loop
        // and pick up the line-adjacent tiles in a shifting loop, so that
        // it would not be necessary to access the state here.

        let prevLineAdjacentTile = -1;
        let nextLineAdjacentTile = -1;

        if (newTileLineIndex > 0) {
          const [prevLineTileRowIndex, prevLineTileColIndex] = mapIndices(
            newTileLineIndex - 1,
            newTileCellIndex,
          );

          prevLineAdjacentTile =
            this.#state[prevLineTileRowIndex][prevLineTileColIndex];
        }

        if (newTileLineIndex < lastLineIndex) {
          const [nextLineTileRowIndex, nextLineTileColIndex] = mapIndices(
            newTileLineIndex + 1,
            newTileCellIndex,
          );

          nextLineAdjacentTile =
            this.#state[nextLineTileRowIndex][nextLineTileColIndex];
        }

        if (
          newTile === prevLineAdjacentTile ||
          newTile === nextLineAdjacentTile
        ) {
          isNextMovePossible = true;
        }
      }
    }

    this.#score += scoreIncrease;

    if (!isNextMovePossible && this.#status !== STATUSES.WIN) {
      this.#status = STATUSES.LOSE;
    }
  }

  /**
   * Returns the current player score.
   *
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * Returns the current game state.
   *
   * @returns {number[][]}
   */
  getState() {
    return this.#state;
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
    // ? Is performing such check ok?
    if (STATUSES[this.#status.toUpperCase()] === undefined) {
      throw Error(`Status "${this.#status}" not recognized.`);
    }

    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#status = STATUSES.PLAYING;
    // or this.#assemble here too.
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#status = STATUSES.PLAYING;
    this.#assemble(this.deepCopy2DState(this.#initialState));
    this.#score = 0;
  }

  /**
   * Spawns a tile in an empty cell.
   * "2" spawns with probability 90%,
   * "4" spawns with probability 10%.
   */
  spawnTile() {
    const lastCellIndex = this.lastIndex;

    const tile = Math.random() < 0.9 ? 2 : 4;

    let position = Math.floor(Math.random() * this.#emptyCellCount);

    for (const row of this.#state) {
      for (let cellIndex = 0; cellIndex <= lastCellIndex; cellIndex++) {
        if (row[cellIndex] === 0) {
          if (position === 0) {
            row[cellIndex] = tile;

            return;
          }

          position--;
        }
      }
    }
  }
}

module.exports = Game;
