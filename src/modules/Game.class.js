'use strict';
/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
import { mergeAndShift } from '../utils/mergeAndShift.js';

class Game {
  static STATUS = {
    waiting: 'waiting',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.status = Game.STATUS.waiting;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
  }

  move(direction) {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);
    let hasMoved = false;
    let totalMergeSum = 0;
    let newState = [];

    if (direction === 'left' || direction === 'right') {
      newState = this.state.map((row) => {
        const reversed = direction === 'right' ? row.reverse() : row;
        const { merged, mergeSum } = mergeAndShift(reversed);

        totalMergeSum += mergeSum;

        if (!hasMoved && !merged.every((val, i) => val === row[i])) {
          hasMoved = true;
        }

        return direction === 'right' ? merged.reverse() : merged;
      });
    } else {
      const transposed = this.transpose(this.state);

      newState = transposed.map((col) => {
        const reversed = direction === 'down' ? col.reverse() : col;
        const { merged, mergeSum } = mergeAndShift(reversed);

        totalMergeSum += mergeSum;

        if (!hasMoved && !merged.every((val, i) => val === col[i])) {
          hasMoved = true;
        }

        return direction === 'down' ? merged.reverse() : merged;
      });
      newState = this.transpose(newState);
    }

    if (hasMoved) {
      this.state = newState;
      this.score += totalMergeSum;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    } else {
      this.state = previousState;
    }

    return hasMoved;
  }

  moveLeft() {
    return this.move('left');
  }
  moveRight() {
    return this.move('right');
  }
  moveUp() {
    return this.move('up');
  }
  moveDown() {
    return this.move('down');
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  getScore() {
    return this.score;
  }
  getState() {
    return this.state;
  }
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = Game.STATUS.playing;
    this.state = this.initialState.map((row) => [...row]);
    this.addNumbers();
    this.addNumbers();
    this.setState();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = Game.STATUS.waiting;
    this.state = this.initialState.map((row) => [...row]);
    this.setState();
  }

  addNumbers() {
    const emptyCells = this.state
      .flatMap((row, r) => row.map((cell, c) => (cell === 0 ? { r, c } : null)))
      .filter(Boolean);

    if (emptyCells.length) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  setState() {
    document.querySelectorAll('.field-cell').forEach((cell, i) => {
      const value = this.state.flat()[i];

      cell.className = 'field-cell';
      cell.textContent = value || '';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  }

  checkStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = Game.STATUS.win;

      return;
    }

    if (this.state.some((row) => row.includes(0))) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.state[i][j] === this.state[i][j + 1] ||
          this.state[j][i] === this.state[j + 1][i]
        ) {
          return;
        }
      }
    }
    this.status = Game.STATUS.lose;
  }
}

export default Game;
