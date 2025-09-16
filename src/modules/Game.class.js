'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
  class Game {
  /**
   * Creates a new game instance.
   * @private
   * @type {number}
   */
  #size;

  /**
   * @private
   * @type {number}
   */
  #score;

  /**
   * The initial state of the board.
   * @private
   * @type {number[][]}
   */
  #initialState;

   /**
   * The current game status.
   * @private
   * @type {string}
   */
  #status;

   /**
   * The current state of the game board.
   * @private
   * @type {number[][]}
   */
  #state;


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
    this.#size = initialState ? initialState.length : 4;
    this.#initialState = initialState || Array.from({ length: this.#size }, () => Array(this.#size).fill(0));
    this.#state = JSON.parse(JSON.stringify(this.#initialState));
    this.#score = 0;
    this.#status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'

  }

  // moveLeft() {}
  // moveRight() {}
  // moveUp() {}
  // moveDown() {}

  /**
   * @returns {number}
   */

  #didPlayerWin() {
    for (let row = 0; row < this.#size; row++) {
      for (let col = 0; col < this.#size; col++) {
        if (this.#state[row][col] === 2048) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Checks if the game is lost (board is full and no possible moves).
   *
   * @returns {boolean}
   * @private
   */
  #didPlayerLose() {
    // A game is only lost if the board is full.
    if (this.#state.some(row => row.includes(0))) {
      return false;
    }

    // Check for possible horizontal merges
    for (let row = 0; row < this.#size; row++) {
      for (let col = 0; col < this.#size - 1; col++) {
        if (this.#state[row][col] === this.#state[row][col + 1]) {
          return false;
        }
      }
    }

    // Check for possible vertical merges
    for (let col = 0; col < this.#size; col++) {
      for (let row = 0; row < this.#size - 1; row++) {
        if (this.#state[row][col] === this.#state[row + 1][col]) {
          return false;
        }
      }
    }

    // If the board is full and no merges are possible, the game is lost.
    return true;
  }

  // --- Método de Atualização do Status (agora com verificação) ---

  /**
   * Checks for a valid move, adds a new tile, and updates the game status.
   *
   * @private
   * @param {string} originalState The JSON string of the board before the move.
   */
  #checkAndUpdate(originalState) {
    const newState = JSON.stringify(this.#state);
    if (originalState !== newState) {
      this.#addNewTile();

      if (this.#didPlayerWin()) {
        this.#status = 'win';
      } else if (this.#didPlayerLose()) {
        this.#status = 'lose';
      }
    }
  }
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return JSON.parse(JSON.stringify(this.#state));
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
    return this.#status;
  }

  #addInitialTiles() {
    this.#addNewTile();
    this.#addNewTile();
  }

  /**
   * Starts the game.
   */
  start() {
     if (this.#status === 'idle') {
      this.#status = 'playing';
      this.#addInitialTiles();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
     this.#state = JSON.parse(JSON.stringify(this.#initialState));
    this.#score = 0;
    this.#status = 'idle';
    this.start();
  }

  // Add your own methods here
    #addNewTile() {
    const emptyCells = [];
    for (let row = 0; row < this.#size; row++) {
      for (let col = 0; col < this.#size; col++) {
        if (this.#state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.#state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  /**
   * Slides and merges a single line (row or column).
   *
   * @private
   * @param {number[]} line The array representing a row or column.
   * @returns {number[]} The new line after movement.
   */
  #slideAndCombine(line) {
    // 1. Filter out zeros
    const filteredLine = line.filter(tile => tile !== 0);

    // 2. Combine equal adjacent tiles
    for (let i = 0; i < filteredLine.length - 1; i++) {
      if (filteredLine[i] === filteredLine[i + 1]) {
        const mergedValue = filteredLine[i] * 2;
        filteredLine[i] = mergedValue;
        this.#score += mergedValue;
        filteredLine.splice(i + 1, 1);
        filteredLine.push(0); // Add a zero at the end
      }
    }

    // 3. Add zeros back to the end
    while (filteredLine.length < this.#size) {
      filteredLine.push(0);
    }

    return filteredLine;
  }

  /**
   * Checks for a valid move and updates the state.
   *
   * @private
   * @param {string} originalState The JSON string of the board before the move.
   */


  moveLeft() {
    if (this.#status !== 'playing') return;
    const originalState = JSON.stringify(this.#state);
    
    for (let i = 0; i < this.#size; i++) {
      this.#state[i] = this.#slideAndCombine(this.#state[i]);
    }
    
    this.#checkAndUpdate(originalState);
  }

  moveRight() {
    if (this.#status !== 'playing') return;
    const originalState = JSON.stringify(this.#state);
    
    for (let i = 0; i < this.#size; i++) {
      const reversedRow = [...this.#state[i]].reverse();
      const newRow = this.#slideAndCombine(reversedRow).reverse();
      this.#state[i] = newRow;
    }

    //const reversedRow = [...this.#state[i]].reverse()
    
    this.#checkAndUpdate(originalState);
  }

  moveUp() {
    if (this.#status !== 'playing') return;
    const originalState = JSON.stringify(this.#state);

    // Transpose the board to treat columns as rows
    const transposedBoard = this.#state[0].map((_, colIndex) => this.#state.map(row => row[colIndex]));
    
    for (let i = 0; i < this.#size; i++) {
      transposedBoard[i] = this.#slideAndCombine(transposedBoard[i]);
    }

    // Transpose the board back
    this.#state = transposedBoard[0].map((_, colIndex) => transposedBoard.map(row => row[colIndex]));
    
    this.#checkAndUpdate(originalState);
  }

  moveDown() {
    if (this.#status !== 'playing') return;
    const originalState = JSON.stringify(this.#state);
    
    // Transpose and reverse each column to treat them as rows from bottom to top
    const transposedBoard = this.#state[0].map((_, colIndex) => this.#state.map(row => row[colIndex]).reverse());
    
    for (let i = 0; i < this.#size; i++) {
      transposedBoard[i] = this.#slideAndCombine(transposedBoard[i]).reverse();
    }

    // Transpose the board back
    this.#state = transposedBoard[0].map((_, colIndex) => transposedBoard.map(row => row[colIndex]));
    
    this.#checkAndUpdate(originalState);
  }



}

module.exports = Game;
