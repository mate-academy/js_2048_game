'use strict';

class Game {
  state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState) {
    if (initialState) {
      this.state = initialState.map((row) => [...row]);
    }
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const oldState = this.state.map((row) => [...row]);
    let stateChanged = false;

    for (let row = 0; row < 4; row++) {
      const { line, gainedScore } = this.processLine(this.state[row]);

      if (line.some((val, index) => val !== oldState[row][index])) {
        stateChanged = true;
      }

      this.state[row] = line;
      this.score += gainedScore;
    }

    if (stateChanged) {
      this.addRandomCell();
    }

    this.checkGameStatus();
  }

  moveRight() {
    const oldState = this.state.map((row) => [...row]);
    let stateChanged = false;

    for (let row = 0; row < 4; row++) {
      const reversed = this.state[row].reverse();
      const { line, gainedScore } = this.processLine(reversed);
      const newLine = [...line].reverse();

      if (newLine.some((val, index) => val !== oldState[row][index])) {
        stateChanged = true;
      }

      this.state[row] = newLine;
      this.score += gainedScore;
    }

    if (stateChanged) {
      this.addRandomCell();
    }

    this.checkGameStatus();
  }

  moveUp() {
    let stateChanged = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const { line, gainedScore } = this.processLine(column);

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== line[row]) {
          stateChanged = true;
        }

        this.state[row][col] = line[row];
      }

      this.score += gainedScore;
    }

    if (stateChanged) {
      this.addRandomCell();
    }

    this.checkGameStatus();
  }

  moveDown() {
    let stateChanged = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const { line, gainedScore } = this.processLine(column.reverse());
      const newColumn = [...line].reverse();

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newColumn[row]) {
          stateChanged = true;
        }
        this.state[row][col] = newColumn[row];
      }

      this.score += gainedScore;
    }

    if (stateChanged) {
      this.addRandomCell();
    }

    this.checkGameStatus();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.start();
  }

  addRandomCell() {
    const freeCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          freeCells.push([row, col]);
        }
      }
    }

    if (freeCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * freeCells.length);
      const [row, col] = freeCells[randomIndex];

      const newValue = Math.random() < 0.1 ? 4 : 2;

      this.state[row][col] = newValue;
    }
  }

  processLine(line) {
    const filtered = line.filter((n) => n !== 0);
    const merged = [];
    let gainedScore = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        merged.push(mergedValue);
        gainedScore += mergedValue;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return {
      line: merged,
      gainedScore: gainedScore,
    };
  }

  checkGameStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.state.some((row) => row.includes(0))) {
      this.status = 'playing';

      return;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];

        if (col < 3 && current === this.state[row][col + 1]) {
          this.status = 'playing';

          return;
        }

        if (row < 3 && current === this.state[row + 1][col]) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
