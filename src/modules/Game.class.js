'use strict';
import { control } from '../scripts/main';

const score = document.querySelector('.game-score');

class Game {
  constructor(
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    initialState,
  ) {
    this.board = board;
    this.initialState = 'idle';
    this.score = 0;
    this.width = 4;
    this.squares = document.getElementsByClassName('field-cell');
    this.didMove = false;
  }

  generate(firstValue = false) {
    const emptyExists = Array.from(this.squares).some(
      (s) => s.innerHTML === '0',
    );

    if (!emptyExists || (!this.didMove && !firstValue)) {
      return;
    }

    const randomNumber = Math.floor(Math.random() * this.squares.length);

    if (this.squares[randomNumber].innerHTML === '0') {
      const value = Math.random() < 0.1 ? 4 : 2;

      this.squares[randomNumber].innerHTML = String(value);
    } else {
      this.generate(firstValue);
    }
  }

  beforeStart() {
    for (let i = 0; i < this.squares.length; i++) {
      this.squares[i].innerHTML = 0;
    }

    this.addColors();
  }

  checkIfWin() {
    for (let i = 0; i < this.squares.length; i++) {
      if (this.squares[i].innerHTML === '2048') {
        this.initialState = 'win';
        document.removeEventListener('keydown', control);
        break;
      }
    }
  }

  checkIfLose() {
    for (let i = 0; i < 16; i++) {
      if (this.squares[i].innerHTML === '0') {
        return;
      }
    }

    for (let i = 0; i < 16; i++) {
      if (i % 4 !== 3) {
        if (this.squares[i].innerHTML === this.squares[i + 1].innerHTML) {
          return;
        }
      }
    }

    for (let i = 0; i < 12; i++) {
      if (this.squares[i].innerHTML === this.squares[i + 4].innerHTML) {
        return;
      }
    }

    this.initialState = 'lose';
    document.removeEventListener('keydown', control);
  }

  addColors() {
    for (let i = 0; i < this.squares.length; i++) {
      this.squares[i].className = 'field-cell';

      if (this.squares[i].innerHTML === '0') {
        this.squares[i].style.color = '#d6cdc4';
        this.squares[i].style.backgroundColor = ' #d6cdc4';
      } else {
        this.squares[i].classList.add(
          `field-cell--${this.squares[i].innerHTML}`,
        );
        this.squares[i].style.color = '';
        this.squares[i].style.backgroundColor = '';
      }
    }
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        const first = this.squares[i].innerHTML;
        const second = this.squares[i + 1].innerHTML;
        const third = this.squares[i + 2].innerHTML;
        const fourth = this.squares[i + 3].innerHTML;
        const row = [
          parseInt(first),
          parseInt(second),
          parseInt(third),
          parseInt(fourth),
        ];

        const filteredRow = row.filter((x) => x);
        const missing = 4 - filteredRow.length;
        const zeros = Array(missing).fill(0);
        const newRow = filteredRow.concat(zeros);

        if (!row.every((val, idx) => val === newRow[idx])) {
          moved = true;
        }

        this.squares[i].innerHTML = newRow[0];
        this.squares[i + 1].innerHTML = newRow[1];
        this.squares[i + 2].innerHTML = newRow[2];
        this.squares[i + 3].innerHTML = newRow[3];
      }
    }

    this.didMove = moved;
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        const first = this.squares[i].innerHTML;
        const second = this.squares[i + 1].innerHTML;
        const third = this.squares[i + 2].innerHTML;
        const fourth = this.squares[i + 3].innerHTML;
        const row = [
          parseInt(first),
          parseInt(second),
          parseInt(third),
          parseInt(fourth),
        ];

        const filteredRow = row.filter((x) => x);
        const missing = 4 - filteredRow.length;
        const zeros = Array(missing).fill(0);
        const newRow = zeros.concat(filteredRow);

        if (!row.every((val, idx) => val === newRow[idx])) {
          moved = true;
        }

        this.squares[i].innerHTML = newRow[0];
        this.squares[i + 1].innerHTML = newRow[1];
        this.squares[i + 2].innerHTML = newRow[2];
        this.squares[i + 3].innerHTML = newRow[3];
      }
    }

    this.didMove = moved;
  }

  moveUp() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const first = this.squares[i].innerHTML;
      const second = this.squares[i + this.width].innerHTML;
      const third = this.squares[i + this.width * 2].innerHTML;
      const fourth = this.squares[i + this.width * 3].innerHTML;
      const column = [
        parseInt(first),
        parseInt(second),
        parseInt(third),
        parseInt(fourth),
      ];

      const filteredColumn = column.filter((x) => x);
      const missing = 4 - filteredColumn.length;
      const zeros = Array(missing).fill(0);
      const newColumn = filteredColumn.concat(zeros);

      if (!column.every((val, idx) => val === newColumn[idx])) {
        moved = true;
      }

      this.squares[i].innerHTML = newColumn[0];
      this.squares[i + this.width].innerHTML = newColumn[1];
      this.squares[i + this.width * 2].innerHTML = newColumn[2];
      this.squares[i + this.width * 3].innerHTML = newColumn[3];
    }

    this.didMove = moved;
  }

  moveDown() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const first = this.squares[i].innerHTML;
      const second = this.squares[i + this.width].innerHTML;
      const third = this.squares[i + this.width * 2].innerHTML;
      const fourth = this.squares[i + this.width * 3].innerHTML;
      const column = [
        parseInt(first),
        parseInt(second),
        parseInt(third),
        parseInt(fourth),
      ];

      const filteredColumn = column.filter((x) => x);
      const missing = 4 - filteredColumn.length;
      const zeros = Array(missing).fill(0);
      const newColumn = zeros.concat(filteredColumn);

      if (!column.every((val, idx) => val === newColumn[idx])) {
        moved = true;
      }

      this.squares[i].innerHTML = newColumn[0];
      this.squares[i + this.width].innerHTML = newColumn[1];
      this.squares[i + this.width * 2].innerHTML = newColumn[2];
      this.squares[i + this.width * 3].innerHTML = newColumn[3];
    }

    this.didMove = moved;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.initialState;
  }

  start() {
    this.initialState = 'playing';
    this.generate(true);
    this.generate(true);
    this.addColors();
  }

  restart() {
    this.beforeStart();
    this.initialState = 'idle';
    this.score = 0;
    score.innerHTML = 0;
  }

  combineRow(move) {
    for (let i = 0; i < 15; i++) {
      if (
        this.squares[i].innerHTML !== '0' &&
        this.squares[i].innerHTML === this.squares[i + 1].innerHTML &&
        i % 4 !== 3
      ) {
        const combined =
          parseInt(this.squares[i].innerHTML) +
          parseInt(this.squares[i + 1].innerHTML);

        this.squares[i].innerHTML = combined;
        this.squares[i + 1].innerHTML = 0;
        this.score += combined;
        score.innerHTML = this.score;

        this.didMove = true;
      }
    }

    const previousDidMove = this.didMove;

    this.checkIfWin();
    this.checkIfLose();

    if (move === 'right') {
      this.moveRight();
    }

    if (move === 'left') {
      this.moveLeft();
    }

    if (previousDidMove !== this.didMove) {
      this.didMove = previousDidMove;
    }
  }

  combineColumn(move) {
    for (let i = 0; i < 12; i++) {
      if (
        this.squares[i].innerHTML !== '0' &&
        this.squares[i].innerHTML === this.squares[i + this.width].innerHTML
      ) {
        const combined =
          parseInt(this.squares[i].innerHTML) +
          parseInt(this.squares[i + this.width].innerHTML);

        this.squares[i].innerHTML = combined;
        this.squares[i + this.width].innerHTML = 0;
        this.score += combined;
        score.innerHTML = this.score;

        this.didMove = true;
      }
    }

    const previousDidMove = this.didMove;

    this.checkIfWin();
    this.checkIfLose();

    if (move === 'up') {
      this.moveUp();
    }

    if (move === 'down') {
      this.moveDown();
    }

    if (previousDidMove !== this.didMove) {
      this.didMove = previousDidMove;
    }
  }
}

module.exports = Game;
