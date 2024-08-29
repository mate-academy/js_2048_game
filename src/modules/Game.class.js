'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    rows = 4,
    columns = 4,
  ) {
    this.initialState = initialState;
    this.rows = rows;
    this.columns = columns;
    this.score = 0;
    this.status = 'idle';
  }

  updateTile(tile, num) {
    tile.innerText = num > 0 ? num : '';
    tile.classList.value = '';
    tile.classList.add('tile');

    if (num > 0) {
      tile.classList.add('--' + num.toString());
    }
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  slide(row) {
    let newRow = this.filterZero(row);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        this.score += newRow[i];
      }
    }

    newRow = this.filterZero(newRow);

    while (newRow.length < this.columns) {
      newRow.push(0);
    }

    return newRow;
  }

  setupMovements() {
    document.addEventListener('keyup', (e) => {
      if (this.status === 'playing') {
        switch (e.code) {
          case 'ArrowLeft':
            this.moveLeft();
            break;
          case 'ArrowRight':
            this.moveRight();
            break;
          case 'ArrowUp':
            this.moveUp();
            break;
          case 'ArrowDown':
            this.moveDown();
            break;
        }
      }
    });
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < this.rows; i++) {
      const row = this.initialState[i];
      const newRow = this.slide(row);

      if (newRow.toString() !== row.toString()) {
        moved = true;
      }
      this.initialState[i] = newRow;

      for (let c = 0; c < this.columns; c++) {
        const tile = document.getElementById(i.toString() + '-' + c.toString());
        const num = this.initialState[i][c];

        this.updateTile(tile, num);
      }
    }

    if (moved) {
      this.addNewTile();
    }
    this.checkGameStatus();
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < this.rows; i++) {
      const row = this.initialState[i].slice(); // Cria uma cópia do array

      row.reverse();

      const newRow = this.slide(row);

      newRow.reverse();

      if (newRow.toString() !== this.initialState[i].toString()) {
        moved = true;
      }
      this.initialState[i] = newRow;

      for (let c = 0; c < this.columns; c++) {
        const tile = document.getElementById(i.toString() + '-' + c.toString());
        const num = this.initialState[i][c];

        this.updateTile(tile, num);
      }
    }

    if (moved) {
      this.addNewTile();
    }
    this.checkGameStatus();
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < this.columns; c++) {
      const row = [
        this.initialState[0][c],
        this.initialState[1][c],
        this.initialState[2][c],
        this.initialState[3][c],
      ];
      const newRow = this.slide(row);

      if (newRow.toString() !== row.toString()) {
        moved = true;
      }

      for (let r = 0; r < this.rows; r++) {
        this.initialState[r][c] = newRow[r];

        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.initialState[r][c];

        this.updateTile(tile, num);
      }
    }

    if (moved) {
      this.addNewTile();
    }
    this.checkGameStatus();
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < this.columns; c++) {
      const row = [
        this.initialState[0][c],
        this.initialState[1][c],
        this.initialState[2][c],
        this.initialState[3][c],
      ];

      row.reverse();

      const newRow = this.slide(row);

      newRow.reverse();

      if (newRow.toString() !== row.toString()) {
        moved = true;
      }

      for (let r = 0; r < this.rows; r++) {
        this.initialState[r][c] = newRow[r];

        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.initialState[r][c];

        this.updateTile(tile, num);
      }
    }

    if (moved) {
      this.addNewTile();
    }
    this.checkGameStatus();
  }

  addNewTile() {
    const emptyTiles = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.initialState[r][c] === 0) {
          emptyTiles.push({ r, c });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { r, c } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.initialState[r][c] = Math.random() < 0.9 ? 2 : 4;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      this.updateTile(tile, this.initialState[r][c]);
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.initialState;
  }

  checkGameStatus() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.initialState[r][c] === 2048) {
          this.status = 'win';
          alert('Você ganhou!');

          return;
        }
      }
    }

    let possibleMoves = false;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.initialState[r][c] === 0) {
          possibleMoves = true;
        }

        if (
          r < this.rows - 1 &&
          this.initialState[r][c] === this.initialState[r + 1][c]
        ) {
          possibleMoves = true;
        }

        if (
          c < this.columns - 1 &&
          this.initialState[r][c] === this.initialState[r][c + 1]
        ) {
          possibleMoves = true;
        }
      }
    }

    if (!possibleMoves) {
      this.status = 'lose';
      alert('Game Over!');
    }
  }

  start() {
    this.status = 'playing';
    this.addNewTile();
    this.addNewTile();
    this.setupMovements();
  }

  restart() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }
}

module.exports = Game;
