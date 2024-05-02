'use strict';

const BOARD_SIZE = 4;
const DEFAULT_BOARD = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Game {
  constructor(board = DEFAULT_BOARD) {
    this.board = board;
    this.score = 0;
    this.status = 'idle';
  }

  Slide() {
    const score = document.querySelector('.game-score');
    let scoreToAdd = 0;

    const previousBoard = this.board.map(
      (outer) => outer.map((_, i) => outer[i]),
      // eslint-disable-line function-paren-newline
    );

    for (let row = 0; row < BOARD_SIZE; row++) {
      let MargedTile;

      for (let tile = 1; tile < BOARD_SIZE; tile++) {
        if (this.board[row][tile] > 0) {
          let howFarMove = 0;

          while (this.board[row][tile - howFarMove - 1] === 0) {
            howFarMove++;
          }

          if (
            this.board[row][tile] === this.board[row][tile - howFarMove - 1] &&
            tile - howFarMove - 1 !== MargedTile
          ) {
            howFarMove++;
            MargedTile = tile - howFarMove;

            this.board[row][tile - howFarMove] =
              this.board[row][tile] + this.board[row][tile - howFarMove];

            scoreToAdd += this.board[row][tile - howFarMove];
          } else {
            this.board[row][tile - howFarMove] = this.board[row][tile];
          }

          if (tile - howFarMove !== tile) {
            this.board[row][tile] = 0;
          }

          if (this.board.flat().includes(2048)) {
            this.status = 'win';
          }
        }
      }
    }

    if (JSON.stringify(this.board) !== JSON.stringify(previousBoard)) {
      this.#setRandomTile();
      score.innerHTML = `${+score.innerHTML + scoreToAdd}`;
    }
  }

  moveLeft() {
    this.Slide();
    this.setBoard();
  }

  moveRight() {
    this.#reverse();
    this.Slide();
    this.#reverse();
    this.setBoard();
  }

  moveUp() {
    this.#rotate();
    this.Slide();
    this.#rotate();
    this.setBoard();
  }

  moveDown() {
    this.#rotate();
    this.moveRight();
    this.#rotate();
    this.setBoard();
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

  start() {
    this.status = 'playing';
    this.#setRandomTile();
    this.#setRandomTile();
  }

  restart() {
    const score = document.querySelector('.game-score');

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.start();

    this.score = 0;
    score.innerHTML = 0;
  }

  setBoard() {
    const cells = document.querySelectorAll('.field-cell');
    let cellIndex = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cellValue = this.board[row][col];

        if (cellValue !== 0) {
          cells[cellIndex].textContent = cellValue;
          cells[cellIndex].className = ` field-cell field-cell--${cellValue}`;
        } else {
          cells[cellIndex].className = 'field-cell';
          cells[cellIndex].textContent = '';
        }

        cellIndex++;
      }
    }
  }

  #reverse() {
    this.board.forEach((row) => row.reverse());
  }

  #rotate() {
    this.board = this.board.map((row, i) => {
      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        newRow.push(this.board[j][i]);
      }

      return newRow;
    });
  }

  #setRandomTile() {
    const number = Math.ceil(Math.random() * 10) > 9 ? 4 : 2;

    let randomRow, randomCol;

    const getRandomNumber = () => Math.floor(Math.random() * 4);

    const placeNumber = () => {
      randomRow = getRandomNumber();
      randomCol = getRandomNumber();

      if (this.board[randomRow][randomCol] === 0) {
        this.board[randomRow][randomCol] = number;
        this.setBoard();
      } else {
        placeNumber();
      }
    };

    placeNumber();
  }
}

module.exports = Game;
