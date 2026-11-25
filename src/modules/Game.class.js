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
  constructor(initialState = null) {
    if (initialState) {
      this.field = initialState;
    } else {
      this.field = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.initialField = this.field.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    // Faz uma cópia profunda do campo antes de mexer
    const oldField = JSON.stringify(this.field);

    for (let row = 0; row < 4; row++) {
      const line = this.field[row].filter((val) => val !== 0);

      const merged = [];
      let skip = false;

      for (let i = 0; i < line.length - 1; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (line[i] === line[i + 1]) {
          merged.push(line[i] * 2);
          this.score += line[i] * 2;
          skip = true;
        } else {
          merged.push(line[i]);
        }
      }

      if (!skip && line.length > 0) {
        merged.push(line[line.length - 1]);
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      this.field[row] = merged;
    }

    const newField = JSON.stringify(this.field);

    const changed = oldField !== newField;

    if (changed) {
      this.addRandomTile();
    }

    this.checkWin();

    if (this.isGameOver() && this.status !== 'win') {
      this.status = 'lose';
    }

    // Compara com o que ficou depois
    return changed;
    // Retorna true se houve mudança, false caso contrário
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldField = JSON.stringify(this.field);

    for (let row = 0; row < 4; row++) {
      const line = this.field[row].filter((cell) => cell !== 0).reverse();

      const merged = [];
      let skip = false;

      for (let i = 0; i < line.length - 1; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (line[i] === line[i + 1]) {
          merged.push(line[i] * 2);
          this.score += line[i] * 2;
          skip = true;
        } else {
          merged.push(line[i]);
        }
      }

      if (!skip && line.length > 0) {
        merged.push(line[line.length - 1]);
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      this.field[row] = merged.reverse();
    }

    const newField = JSON.stringify(this.field);
    const changed = oldField !== newField;

    if (changed) {
      this.addRandomTile();
    }

    this.checkWin();

    if (this.isGameOver() && this.status !== 'win') {
      this.status = 'lose';
    }

    return changed;
    // Retorna true se houve mudança, false caso contrário
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldField = JSON.stringify(this.field);

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.field[row][col]);
      }

      const filtered = column.filter((cell) => cell !== 0);
      const merged = [];
      let skip = false;

      for (let i = 0; i < filtered.length - 1; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          skip = true;
        } else {
          merged.push(filtered[i]);
        }
      }

      if (!skip && filtered.length > 0) {
        merged.push(filtered[filtered.length - 1]);
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.field[row][col] = merged[row];
      }
    }

    const newField = JSON.stringify(this.field);
    const changed = oldField !== newField;

    if (changed) {
      this.addRandomTile();
    }

    this.checkWin();

    if (this.isGameOver() && this.status !== 'win') {
      this.status = 'lose';
    }

    return changed;
    // Retorna true se houve mudança, false caso contrário
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    const oldField = JSON.stringify(this.field);

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.field[row][col]);
      }

      const filtered = column.filter((cell) => cell !== 0);
      const reversed = filtered.reverse();
      const merged = [];
      let skip = false;

      for (let i = 0; i < reversed.length - 1; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (reversed[i] === reversed[i + 1]) {
          merged.push(reversed[i] * 2);
          this.score += reversed[i] * 2;
          skip = true;
        } else {
          merged.push(reversed[i]);
        }
      }

      if (!skip && reversed.length > 0) {
        merged.push(reversed[reversed.length - 1]);
      }

      while (merged.length < 4) {
        merged.push(0);
        // adciona zeros no início do array para preencher a coluna
      }

      const result = merged.reverse(); // inverte de volta

      for (let row = 0; row < 4; row++) {
        this.field[row][col] = result[row];
      }
    }

    const newField = JSON.stringify(this.field);
    const changed = oldField !== newField;

    if (changed) {
      this.addRandomTile();
    }

    this.checkWin();

    if (this.isGameOver() && this.status !== 'win') {
      this.status = 'lose';
    }

    return changed;
    // Retorna true se houve mudança, false caso contrário
  }

  isGameOver() {
    // 1. Verifica se tem célula vazia
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          return false;
        }
      }
    }
    // 2. Verifica se tem células adjacentes iguais (horizontal e vertical)

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.field[row][col];

        // Verifica direita
        if (col < 3 && current === this.field[row][col + 1]) {
          return false;
        }
        // Verifica baixo

        if (row < 3 && current === this.field[row + 1][col]) {
          return false;
        }
      }
    }

    // Se chegou aqui, não tem mais movimentos
    return true;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
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
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */

  start() {
    /*
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    */

    this.score = 0;
    this.status = 'playing';

    this.checkWin();

    if (this.status === 'win') {
      return;
    }

    this.addRandomTile();
    this.addRandomTile();

    if (this.status !== 'win' && this.isGameOver()) {
      this.status = 'lose';
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = this.initialField.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      if (this.isGameOver()) {
        this.status = 'lose';
      }

      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2;
    // 10% chance for 4, 90% chance for 2

    this.field[randomCell.row][randomCell.col] = value;
  }

  // Add your own methods here
}

module.exports = Game;
