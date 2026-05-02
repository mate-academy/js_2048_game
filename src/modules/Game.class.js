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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.field = initialState;
    this.score = 0;
    this.status = 'idle';
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  addRandomTile() {
    const emptyCells = [];

    this.field.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.field[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    // Salvar estado anterior
    const oldField = JSON.stringify(this.field);

    this.field.forEach((row) => {
      const nonZeroCells = row.filter((cell) => cell !== 0);
      const mergedCells = [];

      for (let i = 0; i < nonZeroCells.length; i++) {
        if (nonZeroCells[i] === nonZeroCells[i + 1]) {
          const mergedValue = nonZeroCells[i] * 2;

          mergedCells.push(mergedValue);
          this.score += mergedValue;
          i++; // Skip the next cell as it's merged
        } else {
          mergedCells.push(nonZeroCells[i]);
        }
      }

      while (mergedCells.length < row.length) {
        mergedCells.push(0); // Fill the rest with zeros
      }
      row.splice(0, row.length, ...mergedCells); // Update the original row
    });

    if (JSON.stringify(this.field) !== oldField) {
      this.addRandomTile();
    }
  }

  moveRight() {
    const oldField = JSON.stringify(this.field);

    this.field.forEach((row) => {
      const nonZeroCells = row.filter((cell) => cell !== 0);
      const mergedCells = [];

      for (let i = nonZeroCells.length - 1; i >= 0; i--) {
        if (nonZeroCells[i] === nonZeroCells[i - 1]) {
          const mergedValue = nonZeroCells[i] * 2;

          mergedCells.push(mergedValue);
          this.score += mergedValue;
          i--; // Skip the next cell as it's merged
        } else {
          mergedCells.unshift(nonZeroCells[i]);
        }
      }

      while (mergedCells.length < row.length) {
        mergedCells.unshift(0); // Fill the rest with zeros
      }
      row.splice(0, row.length, ...mergedCells); // Update the original row
    });

    if (JSON.stringify(this.field) !== oldField) {
      this.addRandomTile();
    }
  }

  moveUp() {
    const oldField = JSON.stringify(this.field);

    for (let col = 0; col < 4; col++) {
      // Extrai a coluna
      const column = [
        this.field[0][col],
        this.field[1][col],
        this.field[2][col],
        this.field[3][col],
      ];

      // Processa a coluna (igual ao moveLeft)
      const nonZeroCells = column.filter((cell) => cell !== 0);
      const mergedCells = [];

      for (let i = 0; i < nonZeroCells.length; i++) {
        if (nonZeroCells[i] === nonZeroCells[i + 1]) {
          const mergedValue = nonZeroCells[i] * 2;

          mergedCells.push(mergedValue);
          this.score += mergedValue;
          i++; // Skip the next cell as it's merged
        } else {
          mergedCells.push(nonZeroCells[i]);
        }
      }

      while (mergedCells.length < 4) {
        mergedCells.push(0);
      }

      // Escreve de volta
      for (let row = 0; row < 4; row++) {
        this.field[row][col] = mergedCells[row];
      }
    }

    if (JSON.stringify(this.field) !== oldField) {
      this.addRandomTile();
    }
  }

  moveDown() {
    const oldField = JSON.stringify(this.field);

    for (let col = 0; col < 4; col++) {
      // Extrai a coluna
      const column = [
        this.field[0][col],
        this.field[1][col],
        this.field[2][col],
        this.field[3][col],
      ];

      // Processa a coluna (igual ao moveLeft)
      const nonZeroCells = column.filter((cell) => cell !== 0);
      const mergedCells = [];

      for (let i = nonZeroCells.length - 1; i >= 0; i--) {
        if (nonZeroCells[i] === nonZeroCells[i - 1]) {
          const mergedValue = nonZeroCells[i] * 2;

          mergedCells.push(mergedValue);
          this.score += mergedValue;
          i--; // Skip the next cell as it's merged
        } else {
          mergedCells.push(nonZeroCells[i]);
        }
      }

      while (mergedCells.length < 4) {
        mergedCells.push(0);
      }

      mergedCells.reverse();

      // Escreve de volta
      for (let row = 0; row < 4; row++) {
        this.field[row][col] = mergedCells[row];
      }
    }

    if (JSON.stringify(this.field) !== oldField) {
      this.addRandomTile();
    }
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
  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          return true; // There's an empty cell
        }

        if (col < 3 && this.field[row][col] === this.field[row][col + 1]) {
          return true; // There's a possible horizontal merge
        }

        if (row < 3 && this.field[row][col] === this.field[row + 1][col]) {
          return true; // There's a possible vertical merge
        }
      }
    }

    return false; // No moves available
  }

  getStatus() {
    // Implement the logic to determine the game status

    if (this.field.find((row) => row.includes(2048)) !== undefined) {
      this.status = 'win';
    } else if (!this.hasAvailableMoves() && this.status !== 'win') {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addRandomTile();
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addRandomTile();
    this.status = 'playing';
  }
  // Add your own methods here
}

export default Game;
