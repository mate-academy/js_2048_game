import { GAME_STATUS } from '../constants';

export default class Game {
  constructor() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  move(direction) {
    const newState = this.calculateNewState(direction);

    if (!this.areStatesEqual(this.state, newState)) {
      this.state = newState;
      this.addNewTile();
      this.updateGameStatus();
    }
  }

  calculateNewState(direction) {
    switch (direction) {
      case 'left':
        return this.handleHorizontalMove(false);
      case 'right':
        return this.handleHorizontalMove(true);
      case 'up':
        return this.handleVerticalMove(false);
      case 'down':
        return this.handleVerticalMove(true);
      default:
        return this.state;
    }
  }

  handleHorizontalMove(isReversed) {
    return this.state.map((row) => {
      let processed = [...row];

      if (isReversed) {
        processed.reverse();
      }

      processed = this.mergeTiles(processed);

      return isReversed ? processed.reverse() : processed;
    });
  }

  handleVerticalMove(isReversed) {
    const newState = Array.from({ length: 4 }, () => []);

    for (let col = 0; col < 4; col++) {
      const column = this.state.map((row) => row[col]);

      if (isReversed) {
        column.reverse();
      }

      const merged = this.mergeTiles(column);

      if (isReversed) {
        merged.reverse();
      }

      merged.forEach((value, row) => {
        newState[row][col] = value;
      });
    }

    return newState;
  }

  mergeTiles(line) {
    const merged = line.filter((tile) => tile !== 0);

    for (let i = 0; i < merged.length - 1; i++) {
      if (merged[i] === merged[i + 1]) {
        merged[i] *= 2;
        this.score += merged[i];
        merged.splice(i + 1, 1);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  areStatesEqual(stateA, stateB) {
    return JSON.stringify(stateA) === JSON.stringify(stateB);
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

  start() {
    this.status = GAME_STATUS.PLAYING;

    this.addNewTile();
    this.addNewTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  addNewTile() {
    const emptyCells = [];

    this.state.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push({ i, j });
        }
      });
    });

    if (emptyCells.length) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { i, j } = emptyCells[randomIndex];

      this.state[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  updateGameStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = GAME_STATUS.WIN;

      return;
    }

    if (!this.canMove()) {
      this.status = GAME_STATUS.LOSE;
    }
  }

  canMove() {
    if (this.state.some((row) => row.includes(0))) {
      return true;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.state[i][j];
        const hasHorizontalMerge = j < 3 && current === this.state[i][j + 1];
        const hasVerticalMerge = i < 3 && current === this.state[i + 1][j];

        if (hasHorizontalMerge || hasVerticalMerge) {
          return true;
        }
      }
    }

    return false;
  }
}
