'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.previousState = this.state.map((row) => [...row]);

    this.score = 0;
    this.gameOver = false;
  }

  // Returns empty cells
  static getEmptyCells(state) {
    return state.flat().filter((cell) => cell === 0);
  }

  moveLeft() {
    this.#move(false, false);
  }

  moveRight() {
    this.#move(false, true);
  }

  moveUp() {
    this.#move(true, false);
  }

  moveDown() {
    this.#move(true, true);
  }

  // Universal function to move tiles
  #move(isVertical = false, reverse = false) {
    if (this.getStatus() !== 'playing' || this.getStatus() === 'win') {
      return;
    }

    this.previousState = this.state.map((row) => [...row]);

    let changed = false;

    for (let i = 0; i < 4; i++) {
      const stack = this.#collectStack(i, isVertical, reverse);
      const newStack = this.#combineStack(stack);

      if (this.#updateState(i, newStack, isVertical, reverse)) {
        changed = true;
      }
    }

    if (changed) {
      this.#generateRandomTile();

      if (!this.hasPossibleMoves()) {
        this.gameOver = true;
      }
    }
  }

  #collectStack(index, isVertical, reverse) {
    const stack = [];

    for (let j = 0; j < 4; j++) {
      const cellValue = isVertical
        ? this.state[reverse ? 3 - j : j][index]
        : this.state[index][reverse ? 3 - j : j];

      if (cellValue !== 0) {
        stack.push(cellValue);
      }
    }

    return stack;
  }

  #combineStack(stack) {
    const newStack = [];

    while (stack.length > 0) {
      const firstNumber = stack.shift();

      if (stack.length > 0 && firstNumber === stack[0]) {
        const combinedNumbers = firstNumber + stack.shift();

        newStack.push(combinedNumbers);
        this.#updateScore(combinedNumbers);
      } else {
        newStack.push(firstNumber);
      }
    }

    while (newStack.length < 4) {
      newStack.push(0);
    }

    return newStack;
  }

  #updateState(index, newStack, isVertical, reverse) {
    let changed = false;

    for (let j = 0; j < 4; j++) {
      const currentValue = isVertical
        ? this.state[reverse ? 3 - j : j][index]
        : this.state[index][reverse ? 3 - j : j];

      if (currentValue !== newStack[j]) {
        changed = true;

        if (isVertical) {
          this.state[reverse ? 3 - j : j][index] = newStack[j];
        } else {
          this.state[index][reverse ? 3 - j : j] = newStack[j];
        }
      }
    }

    return changed;
  }

  getScore() {
    return this.score;
  }

  #updateScore(newScore = 0) {
    this.score += newScore;

    return this.score;
  }

  getState() {
    return this.state;
  }

  getPreviousState() {
    return this.previousState;
  }

  getStatus() {
    const isInitial =
      JSON.stringify(this.state) === JSON.stringify(this.initialState);

    if (isInitial) {
      return 'idle';
    }

    if (this.state.flat().includes(2048)) {
      return 'win';
    }

    if (this.gameOver) {
      return 'lose';
    }

    return 'playing';
  }

  // Starts the game
  start() {
    this.previousState = this.state.map((row) => [...row]);

    // Generates first two numbers at game start
    this.#generateRandomTile();
    this.#generateRandomTile();
  }

  // Resets the game
  restart() {
    this.previousState = this.state.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.gameOver = false;
  }

  // Returns false if there are no more available moves
  hasPossibleMoves() {
    // Check if there's at least one empty cell
    if (this.state.flat().includes(0)) {
      return true;
    }

    // Check if tiles can be merged
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];

        // Check horizontal merge
        if (col < 3 && current === this.state[row][col + 1]) {
          return true;
        }

        // Check vertical merge
        if (row < 3 && current === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  // Generates random number for cell
  #generateRandomTile() {
    let row, col;

    do {
      // Random row and column
      row = Math.floor(Math.random() * 4);
      col = Math.floor(Math.random() * 4);
    } while (this.state[row][col] !== 0); // Checking that the cell is empty

    /**
     * Math.floor(Math.random() * 100) generates number from 0 to 100
     * if random number < 10, 4 is returned, otherwise 2 is returned
     * resulting in a 90% chance for 2 and a 10% chance for 4
     */
    this.state[row][col] = Math.floor(Math.random() * 100) < 10 ? 4 : 2;
  }
}

module.exports = Game;
