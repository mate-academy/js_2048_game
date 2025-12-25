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
    const emptyField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.field = initialState || emptyField;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    const newField = this.field.map((row) => this.processRow(row));
    const changed = this.hasFieldChanged(this.field, newField);

    if (!changed) {
      return false;
    }

    this.field = newField;
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    const newField = this.field.map((row) => {
      return this.processRow([...row].reverse()).reverse();
    });

    const changed = this.hasFieldChanged(this.field, newField);

    if (!changed) {
      return false;
    }

    this.field = newField;
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    const transposed = this.transpose(this.field);
    const newField = this.transpose(
      transposed.map((row) => this.processRow(row)),
    );

    const changed = this.hasFieldChanged(this.field, newField);

    if (!changed) {
      return false;
    }

    this.field = newField;
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    const transposed = this.transpose(this.field);
    const newField = this.transpose(
      transposed.map((row) => this.processRow([...row].reverse()).reverse()),
    );

    const changed = this.hasFieldChanged(this.field, newField);

    if (!changed) {
      return false;
    }

    this.field = newField;
    this.addRandomTile();
    this.updateStatus();

    return true;
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
    return this.field;
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
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here

  processRow(row) {
    const filtered = row.filter((v) => v !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        this.score += merged;
        result.push(merged);
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  addRandomTile() {
    const emptyCells = [];

    this.field.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (!emptyCells.length) {
      return;
    }

    const [targetRow, targetCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.field[targetRow][targetCol] = Math.random() < 0.9 ? 2 : 4;
  }

  hasFieldChanged(oldField, newField) {
    return JSON.stringify(oldField) !== JSON.stringify(newField);
  }

  transpose(field) {
    return field[0].map((_, i) => field.map((row) => row[i]));
  }

  updateStatus() {
    if (this.field.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    const movesAvailable =
      this.movePossible(this.field) ||
      this.movePossible(this.transpose(this.field));

    if (!movesAvailable) {
      this.status = 'lose';
    }
  }

  movePossible(field) {
    return field.some((row) => {
      return row.some((cell, i) => cell === 0 || cell === row[i + 1]);
    });
  }
}

module.exports = Game;
