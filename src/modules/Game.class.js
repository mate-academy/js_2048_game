'use strict';

// ініціалізувати
// сгенерувати дві ячейки в випадковому місці
// зробити метод рендеру цієї ячейки
// методи:
// - create cell
// - update cell
// - remove cell
class Game {
  static gameStatus = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  static getInitialState() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  constructor(initialState = Game.getInitialState()) {
    this.gameStatus = Game.gameStatus.idle;
    this.score = 0;
    this.state = initialState;
  }

  getEmptyTiles() {
    const emptyTiles = [];

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.state[x][y] === 0) {
          emptyTiles.push([x, y]);
        }
      }
    }

    return emptyTiles;
  }

  generateTile(count = 1) {
    const availableTiles = this.getEmptyTiles();
    const minTilesToAdd = Math.min(count, availableTiles.length);

    if (!availableTiles.length) {
      this.availableMoves();

      return;
    }

    for (let i = 0; i < minTilesToAdd; i++) {
      const randomIndex = Math.floor(Math.random() * availableTiles.length);

      // для вибору і видалення випадкової вільної клітинки
      const [row, col] = availableTiles.splice(randomIndex, 1)[0];

      this.state[row][col] = Math.random() >= 0.9 ? 4 : 2;
    }

    this.updateBoard();
  }

  updateBoard() {
    const fieldRow = document.querySelectorAll('.field-row');

    fieldRow.forEach((row, index) => {
      row.querySelectorAll('.field-cell').forEach((cell, i) => {
        const num = this.state[index][i];

        cell.classList = 'field-cell';
        cell.innerHTML = '';

        if (num === 0) {
          return;
        }

        if (num === 2048) {
          this.gameStatus = Game.gameStatus.win;
        }

        cell.classList.add(`field-cell--${num}`);
        cell.innerHTML = num;
      });
    });
  }

  availableMoves() {
    const newState = this.getState().map((row) => this.compareAndMerge(row));

    if (JSON.stringify(newState) === JSON.stringify(this.state)) {
      this.gameStatus = Game.gameStatus.lose;
    }
  }

  moveLeft() {
    const newState = this.getState().map((row) => this.compareAndMerge(row));

    this.state = newState;
    this.updateBoard();
    this.generateTile();
  }

  moveRight() {
    const newState = this.getState().map((row) => {
      return this.compareAndMerge(row.reverse());
    });

    this.state = newState.map((row) => row.reverse());
    this.updateBoard();
    this.generateTile();
  }

  moveUp() {
    for (let i = 0; i < 4; i++) {
      let rowFromCol = [
        this.state[0][i],
        this.state[1][i],
        this.state[2][i],
        this.state[3][i],
      ];

      rowFromCol = this.compareAndMerge(rowFromCol);

      this.state[0][i] = rowFromCol[0];
      this.state[1][i] = rowFromCol[1];
      this.state[2][i] = rowFromCol[2];
      this.state[3][i] = rowFromCol[3];
    }

    this.updateBoard();
    this.generateTile();
  }

  moveDown() {
    for (let i = 0; i < 4; i++) {
      let rowFromCol = [
        this.state[0][i],
        this.state[1][i],
        this.state[2][i],
        this.state[3][i],
      ];

      rowFromCol = this.compareAndMerge(rowFromCol.reverse());
      rowFromCol.reverse();

      this.state[0][i] = rowFromCol[0];
      this.state[1][i] = rowFromCol[1];
      this.state[2][i] = rowFromCol[2];
      this.state[3][i] = rowFromCol[3];
    }

    this.updateBoard();
    this.generateTile();
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
    return this.state;
  }

  getStatus() {
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.gameStatus = Game.gameStatus.playing;
    this.generateTile(2);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.state = Game.getInitialState();
    this.gameStatus = Game.gameStatus.idle;
    this.updateBoard();
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  // Add your own methods here
  getNextIterableCells() {}

  compareAndMerge(row) {
    let changedRow = this.filterZero(row);

    for (let i = 0; i < changedRow.length; i++) {
      if (changedRow[i] === changedRow[i + 1]) {
        changedRow[i] += changedRow[i + 1];
        changedRow[i + 1] = 0;
        this.score += changedRow[i];
      }
    }

    changedRow = this.filterZero(changedRow);

    while (changedRow.length < 4) {
      changedRow.push(0);
    }

    // console.log(changedRow);

    return changedRow;
  }
}

module.exports = Game;
