'use strict';

class Game {
  static Statuses = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(initialState) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = Game.Statuses.IDLE;
  }

  start() {
    this.status = Game.Statuses.PLAYING;
    this.addNewTile();
    this.addNewTile();
  }

  restart() {
    this.score = 0;
    this.status = Game.Statuses.IDLE;
    this.board = JSON.parse(JSON.stringify(this.initialState));
  }

  moveLeft() {
    const moveLogic = () => {
      for (let row = 0; row < 4; row++) {
        let temp = this.board[row].filter((n) => n !== 0);

        temp = this.mergeTiles(temp);
        temp = this.addTrailingZeros(temp);

        this.board[row] = temp;
      }
    };

    this.move(moveLogic);
  }
  moveRight() {
    const moveLogic = () => {
      for (let row = 0; row < 4; row++) {
        let temp = this.board[row].filter((n) => n !== 0);

        temp = this.mergeTiles(temp.reverse());
        temp = this.addTrailingZeros(temp).reverse();
        this.board[row] = temp;
      }
    };

    this.move(moveLogic);
  }
  moveUp() {
    const moveLogic = () => {
      for (let col = 0; col < 4; col++) {
        let temp = [];

        for (let row = 0; row < 4; row++) {
          temp.push(this.board[row][col]);
        }
        temp = temp.filter((n) => n !== 0);

        temp = this.mergeTiles(temp);
        temp = this.addTrailingZeros(temp);

        for (let row = 0; row < 4; row++) {
          this.board[row][col] = temp[row];
        }
      }
    };

    this.move(moveLogic);
  }
  moveDown() {
    const moveLogic = () => {
      for (let col = 0; col < 4; col++) {
        let temp = [];

        for (let row = 0; row < 4; row++) {
          temp.push(this.board[row][col]);
        }
        temp = temp.filter((n) => n !== 0);
        temp = this.mergeTiles(temp.reverse());
        temp = this.addTrailingZeros(temp).reverse();

        for (let row = 0; row < 4; row++) {
          this.board[row][col] = temp[row];
        }
      }
    };

    this.move(moveLogic);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  mergeTiles(cells) {
    const mergedCells = [];

    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === cells[i + 1]) {
        mergedCells.push(cells[i] * 2);
        this.score += cells[i] * 2;
        i++;
      } else {
        mergedCells.push(cells[i]);
      }
    }

    return mergedCells;
  }

  addNewTile() {
    const emptyCells = this.board.reduce((cells, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          cells.push({ row: rowIndex, col: colIndex });
        }
      });

      return cells;
    }, []);

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row: chosenRow, col: chosenCol } = emptyCells[randomIndex];
    const newValue = Math.random() < 0.1 ? 4 : 2;

    this.board[chosenRow][chosenCol] = newValue;
  }

  addTrailingZeros(cells) {
    const normalizeCells = cells.slice();

    while (normalizeCells.length < 4) {
      normalizeCells.push(0);
    }

    return normalizeCells;
  }

  updateStatus() {
    let possibilityNextMove = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (current === 2048) {
          this.status = Game.Statuses.WIN;

          return;
        }

        if (current === 0) {
          possibilityNextMove = true;
        }

        if (col < 3 && current === this.board[row][col + 1]) {
          possibilityNextMove = true;
        }

        if (row < 3 && current === this.board[row + 1][col]) {
          possibilityNextMove = true;
        }
      }
    }

    this.status = possibilityNextMove
      ? Game.Statuses.PLAYING
      : Game.Statuses.LOSE;
  }

  move(moveFunc) {
    if (this.status !== Game.Statuses.PLAYING) {
      return;
    }

    const prevState = JSON.stringify(this.board);

    moveFunc();

    const currentState = JSON.stringify(this.board);

    if (prevState !== currentState) {
      this.addNewTile();
      this.updateStatus();
    }
  }
}

module.exports = Game;
